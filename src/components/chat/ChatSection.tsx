// Break into components
"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { formatApiResponse } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, Paperclip, ScrollText, Menu } from "lucide-react";
import { useApiContext } from "@/context/APIContext";
import { CaseRef } from "./CaseRef";
import { useSidebar } from "../ui/sidebar";
import Image from "next/image";
import ChatAnchorLinks from "./ChatAnchorLink";
import Header from "./Header";
import { SummarizeDocuments } from "./SummarizeDocuments";

interface ChatMessage {
  user_query?: string | object;
  llm_response?: string | object;
  role?: string;
  content?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lookup?: any;
}

const ChatSection = () => {
  const { selectedChatId, resetPageTrigger } = useChatContext();
  const { setShouldCallApi } = useApiContext();
  const { state } = useSidebar();
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
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  // Check if there's chat content
  useEffect(() => {
    setHasChatContent(pastChat.length > 0 || currentMessages.length > 0);
  }, [pastChat, currentMessages]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setShowHeading((prevState) => true);
  }, [resetPageTrigger]);

  useEffect(() => {
    setChatId(selectedChatId);
    console.log(chatId);
    const fetchPastChats = async () => {
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
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.data.flatMap((chat: any) => [
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
            setThreadID(
              data.data.length > 0
                ? data.data[data.data.length - 1].thread_id
                : 1
            );
          }
          if (data.data[data.data.length - 1]?.question_id) {
            setQuestionID(
              data.data.length > 0
                ? data.data[data.data.length - 1].question_id
                : 1
            );
          }
        }
      } catch (error) {
        console.error("Error fetching chat", error);
        setPastChat([]);
      }
    };

    fetchPastChats();
    setCurrentMessages([]);

    if (!initialRenderRef.current && selectedChatId) {
      setShowHeading(false);
    }
    initialRenderRef.current = false;
  }, [selectedChatId]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [pastChat, currentMessages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMessage = (index: number) => {
    const anchorId = `query-${index}`;
    const element = messageRefs.current[anchorId];

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const domElement = document.getElementById(anchorId);
      if (domElement) {
        domElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.log(`Element with ID ${anchorId} not found in DOM either`);
      }
    }

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // Handle sending a new message
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);

    setCurrentMessages((prev) => [
      ...prev,
      { role: "user", content: userQuery },
    ]);

    const token = localStorage.getItem("authToken");

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
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();

      setCurrentMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.data && data.data.llm_response
              ? data.data.llm_response
              : formatApiResponse(data),
          lookup: data.data?.lookup,
        },
      ]);

      // Always update thread_id and question_id from the response
      if (data.data) {
        if (data.data.thread_id !== undefined) {
          setThreadID(data.data.thread_id);
        }

        if (data.data.question_id !== undefined) {
          setQuestionID(data.data.question_id);
        }

        if (
          data.data.chat_id &&
          (!selectedChatId || selectedChatId !== data.data.chat_id.toString())
        ) {
          setChatId(data.data.chat_id);
        }
      }

      // Generate heading api
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
            if (anotherRes.ok) {
              setShouldCallApi(true);
            }
          } catch (error) {
            console.error("Error running another API:", error);
          }
        };
        generateHeading();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setCurrentMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize the textarea
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        160
      )}px`;
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setShowHeading((prevState) => false);
      sendMessage();
    }
  };

  const onToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    if (!message) {
      console.error("Undefined message at index", index);
      return null;
    }

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

    let userMessageIndex = -1;
    if (isUserMessage) {
      userMessageIndex = 0;
      for (let i = 0; i < pastChat.length + currentMessages.length; i++) {
        const msg =
          i < pastChat.length
            ? pastChat[i]
            : currentMessages[i - pastChat.length];
        if (msg && (msg.role === "user" || msg.user_query !== undefined)) {
          if (
            i === index ||
            (i >= pastChat.length && i - pastChat.length + index === i)
          ) {
            break;
          }
          userMessageIndex++;
        }
      }
    }

    const anchorId = isUserMessage ? `query-${userMessageIndex}` : "";

    return (
      <div
        key={index}
        className="flex flex-col space-y-2 transition-colors duration-300"
        ref={
          isUserMessage
            ? (el) => {
                if (el) {
                  messageRefs.current[anchorId] = el;
                }
              }
            : null
        }
        id={anchorId}
      >
        {isUserMessage ? (
          <div className="p-3 my-5 rounded-lg max-w-2xl bg-[#e4e4e5] text-black self-end ml-10 border border-gray-300">
            {displayContent}
          </div>
        ) : (
          <div className="flex items-start space-x-2 self-start mr-10">
            {/* White Circle with Logo */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border flex-shrink-0">
              <Image
                src="/logo-small.png"
                width={20}
                height={20}
                alt="Chatbot Logo"
              />
            </div>

            {/* Response Text */}
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
  };

  // Combine past and current messages for the anchor links
  const allMessages = [...pastChat, ...currentMessages];

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative max-w-5xl mx-auto">
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col h-full overflow-hidden relative w-full max-w-4xl mx-auto md:mb-16"
      >
        {showHeading && <Header />}

        {/* Messages Container */}
        <div
          className={`flex-1 overflow-y-auto pb-20 px-4 md:px-6 md:max-w-[95%] ${
            state === "expanded" ? "md:pr-[20%]" : "md:pr-[10%]"
          }`}
        >
          {/* Past Chat Messages */}
          {Array.isArray(pastChat) &&
            pastChat.length > 0 &&
            pastChat.map((chat, index) => renderMessage(chat, index))}

          {/* Current Session Messages */}
          {currentMessages.map((message, index) =>
            renderMessage(message, pastChat.length + index)
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-2 self-start mr-10">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border flex-shrink-0">
                <Image
                  src="/logo-small.png"
                  width={20}
                  height={20}
                  alt="Chatbot Logo"
                />
              </div>
              <div className="p-4 rounded-lg max-w-2xl bg-[#f4f4f5] text-black border border-gray-200">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
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
                overflowY:
                  textareaRef.current && textareaRef.current.scrollHeight > 160
                    ? "auto"
                    : "hidden",
                minHeight: "40px",
                maxHeight: "160px",
              }}
            />
          </div>

          {/* Icons inside the input box */}
          <div className="w-full flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <span className="flex items-center gap-1 px-3 py-2 rounded-2xl border bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                    <Paperclip size={18} className="text-gray-600" />
                    Upload Documents
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload Documents</DialogTitle>
                    <DialogDescription>
                      Add your documents here.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <SummarizeDocuments />

              {/* <Dialog>
                <DialogTrigger asChild>
                  <span className="flex items-center gap-1 px-3 py-2 rounded-2xl border bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                    <ScrollText size={18} className="text-gray-600" />
                    Summarise Documents
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Summary Cases</DialogTitle>
                    <DialogDescription>
                      Choose a case to summarize them.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog> */}
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className={`p-2 rounded-full transition-colors ${
                input.trim()
                  ? "bg-black text-white hover:bg-gray-900 cursor-pointer"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} className="m-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Anchor Links on the right side - Only show when there's chat content */}
      {hasChatContent && (
        <>
          {/* Mobile Toggle Button for Anchor Links */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden fixed top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md"
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 bg-white z-30 transition-transform duration-300 md:hidden ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <button
                onClick={onToggleSidebar}
                className="absolute top-4 left-4 p-2"
                aria-label="Close navigation"
              >
                ✕
              </button>
              <div className="mt-12">
                <ChatAnchorLinks
                  messages={allMessages}
                  onLinkClick={scrollToMessage}
                  maxLinks={15}
                />
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
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
