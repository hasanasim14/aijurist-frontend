"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { FunctionComponent } from "react";
import { useChatContext } from "@/context/ChatContext";
import { formatApiResponse } from "@/lib/utils";
import { Menu, ArrowUp } from "lucide-react";
import { useApiContext } from "@/context/APIContext";
import { CaseRef } from "./CaseRef";
import { useSidebar } from "../ui/sidebar";
import { SummarizeDocuments } from "./SummarizeDocuments";
import { Button } from "../ui/button";
import { UploadDocuments } from "./UploadDocuments";
import { EnhanceButton } from "./EnhanceButton";
import ChatAnchorLinks from "./ChatAnchorLink";
import Header from "./Header";
import Image from "next/image";
import MarkDownComponent from "@/lib/markdown";
import NotLoggedInModal from "../NotLoggedInModal";

interface ChatMessage {
  user_query?: string | object;
  llm_response?: string | object;
  role?: string;
  content?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lookup?: any;
  document?: string;
}

const Message = React.memo(
  ({
    message,
    isUserMessage,
    displayContent,
    hasLookupData,
    anchorId,
    apiResponseIndex,
  }: {
    message: ChatMessage;
    isUserMessage: boolean;
    displayContent: string;
    hasLookupData: boolean;
    anchorId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiResponseIndex: any;
  }) => {
    return (
      <div
        className="flex flex-col transition-colors duration-300 my-2"
        id={anchorId}
      >
        {isUserMessage ? (
          <div className="p-3 my-5 rounded-lg max-w-2xl bg-[#e4e4e5] text-black self-end ml-10 border border-gray-300">
            {displayContent}
            {message.document && (
              <div className="text-xs mt-1 text-gray-500">
                Document: {message.document}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-start space-x-2 self-start mr-10">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border flex-shrink-0">
              <Image
                src="/logo-small.png"
                width={20}
                height={20}
                alt="Chatbot Logo"
                priority
              />
            </div>
            <div
              className={`relative p-4 rounded-lg max-w-2xl bg-[#f4f4f5] text-black border border-gray-200 ${
                hasLookupData ? "pb-16" : ""
              }`}
            >
              {isUserMessage ? (
                displayContent
              ) : (
                <MarkDownComponent>{displayContent}</MarkDownComponent>
              )}
              {hasLookupData && (
                <div className="absolute bottom-3 right-2">
                  <CaseRef
                    lookupData={message}
                    apiResponseIndex={apiResponseIndex}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Message.displayName = "Message";

interface ChatSectionProps {
  sendMessage?: (message: { customQuery: string }) => void;
}

const ChatSection: FunctionComponent<ChatSectionProps> = () => {
  const { selectedChatId, setSelectedChatId, resetPageTrigger } =
    useChatContext();
  const { setShouldCallApi } = useApiContext();
  const { state } = useSidebar();
  const [pastChat, setPastChat] = useState<ChatMessage[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | number>("");
  const [threadId, setThreadID] = useState(1);
  const [questionId, setQuestionID] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasChatContent, setHasChatContent] = useState(false);
  const [showHeading, setShowHeading] = useState(true);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [userFileFlag, setUserFileFlag] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const initialRenderRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // useRef to store the fileIDs
  const fileIdsRef = useRef<string[]>([]);

  const allMessages = useMemo(
    () => [...pastChat, ...currentMessages],
    [pastChat, currentMessages]
  );

  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      requestAnimationFrame(resizeTextarea);
    },
    [resizeTextarea]
  );

  useEffect(() => {
    setHasChatContent(allMessages.length > 0);
  }, [allMessages.length]);

  useEffect(() => {
    if (!selectedChatId) {
      setShowHeading(true);
    }

    if (resetPageTrigger) {
      setUserFileFlag(false);
    }
  }, [resetPageTrigger, selectedChatId, setShowHeading]);

  // Fetch Past Chats
  const fetchPastChats = useCallback(async () => {
    if (!selectedChatId || isFirstMessage) {
      setPastChat([]);
      return;
    }

    const authToken = sessionStorage.getItem("authToken") || "";

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/pastchat_t5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ chat_id: selectedChatId }),
        }
      );
      const data = await res.json();

      if (data?.detail?.message === "User Logged Out") {
        setOpenLogoutModal(true);
        console.log("Logged out");
      }

      const processedPastChat = Array.isArray(data?.data)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.data.flatMap((chat: any) => [
            {
              role: "user",
              content: chat.user_query,
              document: chat.document,
            },
            {
              role: "assistant",
              content: chat.llm_response,
              lookup: chat.lookup,
            },
          ])
        : [];

      setPastChat(processedPastChat);

      if (Array.isArray(data.data) && data.data.length > 0) {
        if (data.data[data.data.length - 1]?.thread_id) {
          setThreadID(data.data[data.data.length - 1].thread_id || 1);
        }
        if (data.data[data.data.length - 1]?.question_id) {
          setQuestionID(data.data[data.data.length - 1].question_id || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching chat", error);
      setPastChat([]);
    }
  }, [selectedChatId, isFirstMessage]);

  useEffect(() => {
    fetchPastChats();
    setCurrentMessages([]);

    // Reset activeChatId when switching to a new chat
    if (selectedChatId) {
      setActiveChatId("");
      setIsFirstMessage(false);
    } else {
      // If there's no selectedChatId, we're starting a new chat
      setIsFirstMessage(true);
    }

    if (!initialRenderRef.current && selectedChatId) {
      setShowHeading(false);
    }
    initialRenderRef.current = false;
  }, [selectedChatId, fetchPastChats, setShowHeading]);

  // Memoized scroll functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (currentMessages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [currentMessages.length, isLoading, scrollToBottom]);

  useEffect(() => {
    resizeTextarea();
  }, [resizeTextarea]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      scrollToTop();
    }
  }, [selectedChatId, scrollToTop]);

  const scrollToMessage = useCallback((index: number) => {
    const anchorId = `query-${index}`;
    const element =
      messageRefs.current[anchorId] || document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (options?: {
      summarize?: boolean;
      caseIds?: string[];
      customQuery?: string;
      documentFlag?: boolean;
    }) => {
      if (options?.caseIds?.length) {
        fileIdsRef.current = options.caseIds;
      }

      const userQuery = options?.customQuery || input.trim();

      if (!userQuery || isLoading) return;

      // Clearing the output after sending an output
      setInput("");
      setIsLoading(true);

      // Only set showHeading to false if we already have a selected chat
      if (selectedChatId) {
        setShowHeading(false);
      }

      // Add user message to chat with document reference
      const userMessage: ChatMessage = {
        role: "user",
        content: userQuery,
        document: currentDocument || undefined,
      };

      setCurrentMessages((prev) => [...prev, userMessage]);

      const timeout = 30 * 1000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const authToken = sessionStorage.getItem("authToken") || "";
      try {
        setShowHeading(false);

        const shouldSetFileFlag = options?.documentFlag || userFileFlag;
        // Request Body
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestBody: any = {
          SearchQuery: userQuery,
          chat_id: selectedChatId || activeChatId || "",
          p_question_id: questionId,
          p_thread_id: threadId,
          summarise: !!options?.summarize,
          document: currentDocument || undefined,
          ...(shouldSetFileFlag && {
            userFile: true,
            fileIDs: fileIdsRef.current,
          }),
        };

        // Set the flag if either condition is true
        if (shouldSetFileFlag) {
          setUserFileFlag(true);
        }

        // Summarize Documents object
        if (options?.summarize) {
          requestBody.fileIDs = options.caseIds;
        }

        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!res.ok)
          throw new Error(`API responded with status: ${res.status}`);

        const data = await res.json();

        // Add assistant response to chat
        setCurrentMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data?.llm_response
              ? data.data.llm_response
              : formatApiResponse(data),
            lookup: data.data?.lookup,
          },
        ]);

        // Update IDs if needed
        if (data.data) {
          if (data.data.thread_id !== undefined)
            setThreadID(data.data.thread_id);
          if (data.data.question_id !== undefined)
            setQuestionID(data.data.question_id);
          if (data.data.chat_id) {
            setActiveChatId(data.data.chat_id);
            setSelectedChatId(data.data.chat_id);

            // so that future fetchPastChats calls will work normally
            if (isFirstMessage) {
              setIsFirstMessage(false);
            }
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestBodyGenHeading: any = {
          chat_id: data?.data?.chat_id,
          SearchQuery: userQuery,
          llm_response: data?.data?.llm_response,
        };

        // If we are submitting for summarize documents
        if (options?.summarize) {
          requestBodyGenHeading.llm_response = userQuery;
        }

        if (res.ok && !selectedChatId && allMessages.length === 0) {
          const generateHeading = async () => {
            try {
              const anotherRes = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + "/gen_heading",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                  },
                  body: JSON.stringify(requestBodyGenHeading),
                }
              );
              if (anotherRes.ok) setShouldCallApi(true);
            } catch (error) {
              console.error("Error running another API:", error);
            }
          };
          generateHeading();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage =
            error.name === "AbortError"
              ? "Sorry, the chat API took too long to respond. Please try again later."
              : "Sorry, there was an error processing your request. Please try again at a later time";

          setCurrentMessages((prev) => [
            ...prev,
            { role: "assistant", content: errorMessage },
          ]);
        }
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
        inputRef.current?.focus();
        setCurrentDocument(null);
      }
    },
    [
      input,
      isLoading,
      selectedChatId,
      threadId,
      questionId,
      setShouldCallApi,
      allMessages,
      activeChatId,
      isFirstMessage,
      setShowHeading,
      currentDocument,
    ]
  );

  const handleFileUploaded = useCallback(
    (fileName: string) => {
      setCurrentDocument(fileName);
      const query = "Could you assist me in summarizing this file?";

      const caseIds = fileName.includes(",")
        ? fileName.split(",").map((f) => f.trim())
        : [fileName];

      sendMessage({
        customQuery: query,
        documentFlag: true,
        caseIds: caseIds,
      });
    },
    [sendMessage]
  );

  // Handle Enter key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (selectedChatId) {
          setShowHeading(false);
        }
        sendMessage();
      }
    },
    [sendMessage, selectedChatId, setShowHeading]
  );

  const onToggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  // Add event listener for card clicks
  useEffect(() => {
    const handleCardClick = (event: CustomEvent<{ query: string }>) => {
      sendMessage({ customQuery: event.detail.query });
    };

    document.addEventListener(
      "startChatFromCard",
      handleCardClick as EventListener
    );

    return () => {
      document.removeEventListener(
        "startChatFromCard",
        handleCardClick as EventListener
      );
    };
  }, [sendMessage]);

  // Memoized loading indicator
  const LoadingIndicator = useMemo(
    () => (
      <div className="flex items-start space-x-2 self-start mr-10">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border flex-shrink-0">
          <Image
            src="/logo-small.png"
            width={20}
            height={20}
            alt="Chatbot Logo"
            priority
          />
        </div>
        <div className="p-4 rounded-lg max-w-2xl bg-[#f4f4f5] text-black border border-gray-200">
          <div className="flex space-x-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    ),
    []
  );

  // Calculate user message indices for anchor links
  const userMessageIndices = useMemo(() => {
    const indices: number[] = [];
    allMessages.forEach((msg, index) => {
      if (msg.role === "user" || msg.user_query !== undefined) {
        indices.push(index);
      }
    });
    return indices;
  }, [allMessages]);

  let apiResponseIndex = 0;

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative">
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col h-full overflow-hidden relative w-full mx-auto"
      >
        {showHeading && <Header />}

        <div
          className={`flex-1 overflow-y-auto md:px-6 pr-4 ${
            state === "expanded"
              ? "md:max-w-[calc(100%-var(--sidebar-width)/4)] ml-[50px]"
              : "md:max-w-[calc(100%-var(--sidebar-width-icon)/4)] sm:ml-[100px]"
          } transition-all duration-300 ease-in-out min-h-[200px] ${
            userFileFlag ? "pb-40" : "pb-35"
          } w-full md:w-[70%] min-w-[300px]`}
        >
          {allMessages.map((message, index) => {
            const isUserMessage =
              message.role === "user" || message.user_query !== undefined;

            if (!isUserMessage) {
              apiResponseIndex++;
            }

            const content = isUserMessage
              ? message.content || message.user_query
              : message.content || message.llm_response;

            const displayContent =
              typeof content === "object"
                ? JSON.stringify(content)
                : String(content || "");

            const hasLookupData =
              !isUserMessage &&
              message.lookup &&
              typeof message.lookup === "object" &&
              Object.keys(message.lookup).length > 0;

            const userMsgIndex = userMessageIndices.indexOf(index);
            const anchorId = isUserMessage ? `query-${userMsgIndex}` : "";

            return (
              <Message
                key={`msg-${index}`}
                message={message}
                isUserMessage={isUserMessage}
                displayContent={displayContent}
                hasLookupData={hasLookupData}
                anchorId={anchorId}
                apiResponseIndex={!isUserMessage ? apiResponseIndex : undefined}
              />
            );
          })}

          {isLoading && LoadingIndicator}
          <div ref={messagesStartRef} />
          <div ref={messagesEndRef} />
        </div>
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
            state === "expanded"
              ? "md:translate-x-[calc(-50%+var(--sidebar-width)/4)]"
              : "md:translate-x-[calc(-50%+var(--sidebar-width-icon)/4)]"
          } w-[90%] md:w-[60%] max-w-3xl z-10 transition-all duration-300 ease-in-out`}
        >
          <div className="bg-white shadow-lg rounded-3xl px-4 py-2 border flex flex-col items-center w-full">
            {userFileFlag && (
              <p
                onClick={() => {
                  setUserFileFlag(false);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                {`Stop referring to document ${fileIdsRef.current}`}
              </p>
            )}
            <div className="w-full relative">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100 resize-none overflow-y-auto text-left py-2 placeholder-gray-500"
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{
                  height: "40px",
                  overflowY:
                    textareaRef.current &&
                    textareaRef.current.scrollHeight > 160
                      ? "auto"
                      : "hidden",
                  minHeight: "40px",
                  maxHeight: "160px",
                }}
              />
            </div>

            <NotLoggedInModal open={openLogoutModal} />

            <div className="w-full flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <UploadDocuments onFileUploaded={handleFileUploaded} />
                <SummarizeDocuments
                  setInput={setInput}
                  onSubmit={(query, caseIds) =>
                    sendMessage({
                      summarize: true,
                      caseIds,
                      customQuery: query,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <EnhanceButton
                  getInputText={() => input}
                  setInputText={(text) => setInput(text)}
                />
                <button
                  onClick={() => sendMessage()}
                  className={`p-1 rounded-full transition-colors ${
                    input.trim()
                      ? "bg-black text-white hover:bg-gray-900 cursor-pointer"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={
                    !input.trim() ||
                    isLoading ||
                    input ===
                      "Sorry, your query is too Short/Vague/Irrelevant to be enhanced"
                  }
                >
                  <ArrowUp size={18} className="m-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasChatContent && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleSidebar}
            className="fixed top-8 right-4 z-20 md:hidden rounded-2xl"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div
            className={`fixed inset-y-0 right-0 bg-white z-30 transition-transform duration-300 md:hidden w-[65%] ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <button
                onClick={onToggleSidebar}
                className="absolute top-8 left-4 p-2"
                aria-label="Close navigation"
              >
                ✕
              </button>
              <div className="mt-24">
                <ChatAnchorLinks
                  messages={allMessages}
                  onLinkClick={scrollToMessage}
                  maxLinks={15}
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block fixed top-20 right-6 w-64 max-w-[20%]">
            <ChatAnchorLinks
              messages={allMessages}
              onLinkClick={scrollToMessage}
              maxLinks={10}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatSection;
