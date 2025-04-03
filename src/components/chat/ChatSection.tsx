"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useChatContext } from "@/context/ChatContext";
import { formatApiResponse } from "@/lib/utils";
import { Menu, ArrowUp } from "lucide-react";
import { useApiContext } from "@/context/APIContext";
import { CaseRef } from "./CaseRef";
import { useSidebar } from "../ui/sidebar";
import { SummarizeDocuments } from "./SummarizeDocuments";
import { Button } from "../ui/button";
import { UploadDocuments } from "./UploadDocuments";
import ChatAnchorLinks from "./ChatAnchorLink";
import Header from "./Header";
import Image from "next/image";
import { EnhanceButton } from "./EnhanceButton";

interface ChatMessage {
  user_query?: string | object;
  llm_response?: string | object;
  role?: string;
  content?: string;
  lookup?: any;
}

// Memoized Message Component to prevent unnecessary re-renders
const Message = React.memo(
  ({
    message,
    isUserMessage,
    displayContent,
    hasLookupData,
    anchorId,
  }: {
    message: ChatMessage;
    isUserMessage: boolean;
    displayContent: string;
    hasLookupData: boolean;
    anchorId: string;
  }) => {
    return (
      <div
        className="flex flex-col space-y-2 transition-colors duration-300"
        id={anchorId}
      >
        {isUserMessage ? (
          <div className="p-3 my-5 rounded-lg max-w-2xl bg-[#e4e4e5] text-black self-end ml-10 border border-gray-300">
            {displayContent}
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
              className={`relative p-4 rounded-lg max-w-2xl bg-[#f4f4f5] text-black border border-gray-200 whitespace-pre-wrap ${
                hasLookupData ? "pb-16" : ""
              }`}
            >
              {displayContent}
              {hasLookupData && (
                <div className="absolute bottom-3 right-2">
                  <CaseRef lookupData={message} />
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

const ChatSection = () => {
  const { selectedChatId, resetPageTrigger } = useChatContext();
  const { setShouldCallApi } = useApiContext();
  const { state, isMobile } = useSidebar();
  const [pastChat, setPastChat] = useState<ChatMessage[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | number>("");
  const [threadId, setThreadID] = useState(1);
  const [questionId, setQuestionID] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasChatContent, setHasChatContent] = useState(false);
  const [showHeading, setShowHeading] = useState(true);
  const initialRenderRef = useRef(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Memoized combined messages to prevent unnecessary recalculations
  const allMessages = useMemo(
    () => [...pastChat, ...currentMessages],
    [pastChat, currentMessages]
  );

  // Optimized textarea resize handler
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, []);

  // Optimized input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      requestAnimationFrame(resizeTextarea);
    },
    [resizeTextarea]
  );

  // Check if there's chat content (optimized)
  useEffect(() => {
    setHasChatContent(allMessages.length > 0);
  }, [allMessages.length]);

  useEffect(() => {
    setShowHeading(true);
  }, [resetPageTrigger]);

  // Fetch past chats with useCallback to memoize the function
  const fetchPastChats = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!selectedChatId) {
      setPastChat([]);
      return;
    }

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL2 + "/pastchat_t5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chat_id: selectedChatId }),
        }
      );
      const data = await res.json();

      const processedPastChat = Array.isArray(data?.data)
        ? data.data.flatMap((chat: any) => [
            {
              role: "user",
              content: chat.user_query,
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
  }, [selectedChatId]);

  useEffect(() => {
    fetchPastChats();
    setCurrentMessages([]);

    if (!initialRenderRef.current && selectedChatId) {
      setShowHeading(false);
    }
    initialRenderRef.current = false;
  }, [selectedChatId, fetchPastChats]);

  useEffect(() => {
    if (selectedChatId) {
      scrollToTop();
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (currentMessages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [currentMessages.length, isLoading]);

  // Memoized scroll functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToMessage = useCallback((index: number) => {
    const anchorId = `query-${index}`;
    const element =
      messageRefs.current[anchorId] || document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, []);

  // Memoized sendMessage function
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);

    setCurrentMessages((prev) => [
      ...prev,
      { role: "user", content: userQuery },
    ]);

    const token = localStorage.getItem("authToken");
    const timeout = 30 * 1000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL2 + "/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          SearchQuery: userQuery,
          chat_id: selectedChatId || "",
          p_thread_id: threadId,
          p_question_id: questionId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

      const data = await res.json();

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

      if (data.data) {
        if (data.data.thread_id !== undefined) setThreadID(data.data.thread_id);
        if (data.data.question_id !== undefined)
          setQuestionID(data.data.question_id);
        if (
          data.data.chat_id &&
          (!selectedChatId || selectedChatId !== data.data.chat_id.toString())
        ) {
          setChatId(data.data.chat_id);
        }
      }

      if (res.ok && selectedChatId === "") {
        const generateHeading = async () => {
          try {
            const anotherRes = await fetch(
              process.env.NEXT_PUBLIC_BASE_URL2 + "/gen_heading",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  chat_id: data?.data?.chat_id,
                  llm_response: data?.data?.llm_response,
                  SearchQuery: data?.data?.user_query,
                }),
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
    }
  }, [
    input,
    isLoading,
    selectedChatId,
    threadId,
    questionId,
    setShouldCallApi,
  ]);

  // Handle Enter key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setShowHeading(false);
        sendMessage();
      }
    },
    [sendMessage]
  );

  const onToggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

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

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative max-w-5xl mx-auto">
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col h-full overflow-hidden relative w-full max-w-4xl mx-auto md:mb-16"
      >
        {showHeading && <Header />}

        <div
          className={`flex-1 overflow-y-auto px-4 md:px-6 md:max-w-[95%] ${
            isMobile ? "mb-45" : "mb-25"
          } ${state === "expanded" ? "md:pr-[20%]" : "md:pr-[10%]"}`}
        >
          {allMessages.map((message, index) => {
            const isUserMessage =
              message.role === "user" || message.user_query !== undefined;
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
              />
            );
          })}

          {isLoading && LoadingIndicator}
          <div ref={messagesStartRef} />
          <div ref={messagesEndRef} />
        </div>
        <div className="fixed bottom-4 w-[90%] max-w-sm md:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-3xl px-4 py-2 border flex flex-col items-center z-10">
          <div className="w-full relative">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100 resize-none overflow-y-auto text-left py-2 placeholder-gray-500"
              placeholder="Type a message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              style={{
                overflowY: "hidden",
                minHeight: "40px",
                maxHeight: "160px",
              }}
            />
          </div>

          <div className="w-full flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <UploadDocuments />
              <SummarizeDocuments />
            </div>

            <div className="flex items-center gap-2">
              <EnhanceButton
                getInputText={() => input}
                setInputText={(text) => setInput(text)}
              />
              <button
                onClick={sendMessage}
                className={`p-1 rounded-full transition-colors ${
                  input.trim()
                    ? "bg-black text-white hover:bg-gray-900 cursor-pointer"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={!input.trim() || isLoading}
              >
                <ArrowUp size={18} className="m-1" />
              </button>
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
