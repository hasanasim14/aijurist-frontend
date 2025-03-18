"use client";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Send,
  Globe,
  Lightbulb,
  Paperclip,
  ScrollText,
  BookOpen,
  MessageCircle,
  Code,
  FileText,
  Layers,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBar from "@/components/NotificationBar";
import ChatSection from "@/components/chat/ChatSection";
import { Card, CardContent } from "@/components/ui/card";
import { useChatContext } from "@/context/ChatContext";
import type { User } from "@/lib/utils";
import Image from "next/image";

const icons = [
  Globe,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Code,
  FileText,
  Layers,
  Pencil,
];

interface ChatMessage {
  role: string;
  text: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showHeading, setShowHeading] = useState(true);
  const [hasChatData, setHasChatData] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { selectedChatId, resetPage, setSelectedChatId } = useChatContext();

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  // Reset heading visibility when chat ID changes
  useEffect(() => {
    if (!selectedChatId) {
      // setShowHeading(true);
      setHasChatData(false);
    }
  }, [selectedChatId]);

  const handleChatDataChange = (hasData: boolean) => {
    setHasChatData(hasData);
    if (hasData) {
      setShowHeading(false);
    } else if (!selectedChatId) {
      // Fix this
      // setShowHeading(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  // Add a function to handle complete page reset
  const handleResetPage = () => {
    // Reset all local state
    setMessages([]);
    setInput("");
    // setShowHeading(true);
    setHasChatData(false);

    //plaintext
    // Call the context's resetPage to reset the selectedChatId
    resetPage();
  };

  // v1-chat api call
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    //plaintext
    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);

    // if (showHeading) setShowHeading(false);
    setShowHeading(false);

    // Add user message to UI immediately
    const userMessage = { role: "user", text: userQuery };
    setMessages((prev) => [...prev, userMessage]);

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("https://devlegal.ai-iscp.com/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          SearchQuery: userQuery,
          fcase: ["string"],
          chat_id: selectedChatId || "",
          p_thread_id: 0,
          p_question_id: 0,
        }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();

      // If this is a new chat and we received a chat_id, update the context
      if (!selectedChatId && data.chat_id) {
        setSelectedChatId(data.chat_id);
      }

      // Add AI response to messages
      const aiResponse = {
        role: "ai",
        text: data.response || "I'm sorry, I couldn't process your request.",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorResponse = {
        role: "ai",
        text: "Sorry, there was an error processing your request. Please try again.",
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggested prompts
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const suggestedPrompts = [
    "What are the key elements of a contract?",
    "Explain the difference between civil and criminal law",
    "What is a legal precedent?",
    "How do I file a small claims case?",
  ];

  return (
    <>
      <div className="relative h-screen flex flex-col items-center bg-[#f9fafb]">
        <NotificationBar />
        {showHeading && (
          <div className="mt-8 mb-8 text-center w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-purple-500 text-transparent bg-clip-text">
              Hi there, {user?.firstName || "User"}
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
              What would you like to know?
            </span>
            <p className="text-gray-500 mt-4 mb-6">
              Use one of the most common prompts below or use your own to begin
            </p>

            {/* plaintext */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-5xl mx-auto">
              {suggestedPrompts.map((prompt, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <Card
                    key={index}
                    className="flex flex-col items-center p-3 sm:p-5 shadow-md rounded-xl bg-white dark:bg-gray-800 h-full cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    <Icon
                      size={32}
                      className="text-gray-600 dark:text-gray-400 mb-2"
                    />
                    <CardContent className="text-center p-1 sm:p-4 w-full">
                      <p className="text-xs sm:text-sm text-gray-700">
                        {prompt}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className={`w-full max-w-[70%] flex-1 overflow-y-auto p-6 pb-24 dark:bg-gray-900 ${
            hasChatData ? "pt-16" : ""
          }`}
        >
          {/* Chat Section for past chats */}
          <ChatSection onChatDataChange={handleChatDataChange} />

          {/* Current session messages */}
          {messages.length > 0 && (
            <div className="flex flex-col space-y-4 mt-4">
              {messages.map((message, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  {message.role === "user" ? (
                    <div className="p-4 my-4 rounded-lg max-w-2xl bg-[#e4e4e5] text-black self-end ml-10 border border-gray-300">
                      {message.text}
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
                      <div className="p-4 rounded-lg max-w-2xl bg-[#f4f4f5] text-black border border-gray-200">
                        {message.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
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
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-4 w-full max-w-sm md:max-w-2xl bg-white shadow-lg rounded-3xl px-4 py-2 border flex flex-col items-center">
          <div className="w-full relative">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100 resize-none overflow-y-auto text-left py-2 placeholder-gray-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
              style={{
                overflowY:
                  textareaRef.current && textareaRef.current.scrollHeight > 160
                    ? "auto"
                    : "hidden",
                minHeight: "40px",
                maxHeight: "160px",
              }}
              disabled={isLoading}
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
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-full transition-colors ${
                input.trim() && !isLoading
                  ? "bg-black text-white hover:bg-gray-900 cursor-pointer"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} className="m-1" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
