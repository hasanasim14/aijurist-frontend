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
import Image from "next/image";
import { Send, Paperclip, ScrollText, Menu } from "lucide-react";
import { useApiContext } from "@/context/APIContext";
import ChatAnchorLinks from "./ChatAnchorLink";

interface ChatSectionProps {
  onChatDataChange?: (hasChatData: boolean) => void;
}

interface ChatMessage {
  user_query?: string | object;
  llm_response?: string | object;
  role?: string;
  content?: string;
}

const ChatSection = ({ onChatDataChange }: ChatSectionProps) => {
  const { selectedChatId, setResetHeading } = useChatContext();
  const { setShouldCallApi } = useApiContext();
  const [pastChat, setPastChat] = useState<ChatMessage[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | number>("");
  const [threadId, setThreadID] = useState(1);
  const [questionId, setQuestionID] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasChatContent, setHasChatContent] = useState(false);

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

  // Fetch past chats when selectedChatId changes
  useEffect(() => {
    setChatId(selectedChatId);
    const fetchPastChats = async () => {
      const token = localStorage.getItem("authToken");
      if (!selectedChatId) {
        setPastChat([]);
        if (onChatDataChange) onChatDataChange(false);
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

        // Process the past chat data to include API responses
        const processedPastChat = data.data.flatMap((chat: any) => {
          return [
            {
              role: "user",
              content: chat.user_query,
            },
            {
              role: "assistant",
              content: chat.llm_response,
            },
          ];
        });

        setPastChat(processedPastChat);

        // Notify parent component about chat data status
        if (onChatDataChange) {
          onChatDataChange(Array.isArray(data.data) && data.data.length > 0);
        }

        // If we have past chat data, we should also get the latest thread_id and question_id
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Check if the API response includes these values
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
        if (onChatDataChange) {
          onChatDataChange(false);
        }
      }
    };

    fetchPastChats();
    // Reset current messages when changing chats
    setCurrentMessages([]);
  }, [selectedChatId, onChatDataChange]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [pastChat, currentMessages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Replace the scrollToMessage function with this improved version
  const scrollToMessage = (index: number) => {
    console.log(`Attempting to scroll to message index: ${index}`);

    // Create the anchor ID
    const anchorId = `query-${index}`;

    // Get the element reference
    const element = messageRefs.current[anchorId];

    console.log(`Looking for element with ID: ${anchorId}`);
    console.log(`Available refs:`, Object.keys(messageRefs.current));

    if (element) {
      console.log(`Found element, scrolling to it`);
      // Scroll to the element
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // Highlight the message briefly
      element.classList.add("bg-yellow-100");
      setTimeout(() => {
        element.classList.remove("bg-yellow-100");
      }, 2000);
    } else {
      console.log(`Element with ID ${anchorId} not found`);

      // Fallback: try to find the element by ID in the DOM
      const domElement = document.getElementById(anchorId);
      if (domElement) {
        console.log(`Found element by DOM ID, scrolling to it`);
        domElement.scrollIntoView({ behavior: "smooth", block: "start" });

        // Highlight the message briefly
        domElement.classList.add("bg-yellow-100");
        setTimeout(() => {
          domElement.classList.remove("bg-yellow-100");
        }, 2000);
      } else {
        console.log(`Element with ID ${anchorId} not found in DOM either`);
      }
    }

    // Close sidebar on mobile after clicking
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

    // Add user message to current messages
    setCurrentMessages((prev) => [
      ...prev,
      { role: "user", content: userQuery },
    ]);

    // Wait for the state update to be reflected
    // await new Promise((resolve) => setTimeout(resolve, 0));

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
          // fcase: ["string"],
          chat_id: selectedChatId || "",
          p_thread_id: threadId,
          p_question_id: questionId,
        }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();

      // Add AI response to current messages
      setCurrentMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.data && data.data.llm_response
              ? data.data.llm_response
              : formatApiResponse(data),
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

        // If this is a new chat and we received a chat_id, update the context
        if (
          data.data.chat_id &&
          (!selectedChatId || selectedChatId !== data.data.chat_id.toString())
        ) {
          setChatId(data.data.chat_id);
        }
      }

      // Run another API based on conditions
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
            // const anotherData = await anotherRes.json();
            if (anotherRes.ok) {
              // const { setShouldCallApi } = useChatContext();
              setShouldCallApi(true);
            }
            // Process another API data
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
      // Focus the input field after sending
      inputRef.current?.focus();
    }
  };

  // Handle input changes and auto-resize textarea
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
      sendMessage();
      // setTimeout();
      setResetHeading(false);
    }
  };

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Replace the renderMessage function with this improved version
  const renderMessage = (message: ChatMessage, index: number) => {
    // Ensure message is defined
    if (!message) {
      console.error("Undefined message at index", index);
      return null;
    }

    // Determine if it's a user message or AI response
    const isUserMessage =
      message.role === "user" || message.user_query !== undefined;

    // Get the content based on message structure
    const content = isUserMessage
      ? message.content || message.user_query
      : message.content || message.llm_response;

    // Format the content for display
    const displayContent =
      typeof content === "object"
        ? JSON.stringify(content)
        : String(content || "");

    // For user messages, calculate the correct index among all user messages
    let userMessageIndex = -1;
    if (isUserMessage) {
      // Count user messages up to this point
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

    // Create anchor ID for user messages
    const anchorId = isUserMessage ? `query-${userMessageIndex}` : "";

    // Debug
    if (isUserMessage) {
      console.log(
        `Creating message with ID: ${anchorId} for index: ${index}, content: ${displayContent.substring(
          0,
          20
        )}`
      );
    }

    return (
      <div
        key={index}
        className="flex flex-col space-y-4 transition-colors duration-300"
        ref={
          isUserMessage
            ? (el) => {
                if (el) {
                  messageRefs.current[anchorId] = el;
                  console.log(`Stored ref for ${anchorId}`);
                }
              }
            : null
        }
        id={anchorId}
      >
        {isUserMessage ? (
          <div className="p-3 my-4 rounded-lg max-w-2xl bg-[#e4e4e5] text-black self-end ml-10 border border-gray-300">
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
            <div className="p-4 rounded-lg max-w-2xl bg-[#f4f4f5] text-black border border-gray-200 whitespace-pre-wrap">
              {displayContent}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Combine past and current messages for the anchor links
  const allMessages = [...pastChat, ...currentMessages];

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative">
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col h-full overflow-hidden relative"
      >
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto pb-20 px-4 md:px-6">
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

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-4 w-full max-w-sm md:max-w-2xl bg-white shadow-lg rounded-3xl px-4 py-2 border flex flex-col">
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
                  <span className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                    <Paperclip size={18} className="text-gray-600" />
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

              <Dialog>
                <DialogTrigger asChild>
                  <span className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                    <ScrollText size={18} className="text-gray-600" />
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
              </Dialog>
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
            onClick={toggleSidebar}
            className="md:hidden fixed top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md"
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 bg-white z-10 transition-transform duration-300 md:hidden ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <button
                onClick={toggleSidebar}
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
          <div className="hidden md:block">
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
