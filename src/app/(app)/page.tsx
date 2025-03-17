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
import { User } from "@/lib/utils";

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

export default function ChatUI() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [showHeading, setShowHeading] = useState(true);
  const [hasChatData, setHasChatData] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { selectedChatId } = useChatContext();

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
      setShowHeading(true);
      setHasChatData(false);
    }
  }, [selectedChatId]);

  const handleChatDataChange = (hasData: boolean) => {
    setHasChatData(hasData);
    if (hasData) {
      setShowHeading(false);
    } else if (!selectedChatId) {
      setShowHeading(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (showHeading) setShowHeading(false);

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiResponse = { role: "ai", text: "This is an AI response." };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <>
      <div className="relative h-screen flex flex-col items-center bg-[#f9fafb]">
        <NotificationBar />
        {showHeading && !hasChatData && (
          <div className="mt-16 mb-8 text-center w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-purple-500 text-transparent bg-clip-text">
              Hi there, {user?.firstName}
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
              What would like to know?
            </span>
            <p className="text-gray-500 mt-4 mb-6">
              Use one of the most common prompts below or use your own to begin
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <Card
                    key={item}
                    className="flex flex-col items-center p-3 sm:p-6 shadow-md rounded-xl bg-white dark:bg-gray-800 h-full"
                  >
                    <Icon
                      size={32}
                      className="text-gray-600 dark:text-gray-400 mb-2"
                    />
                    <CardContent className="text-center p-1 sm:p-4 w-full">
                      <h3 className="text-lg sm:text-lg font-semibold">
                        Card {item}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        This is a sample text for card {item}.
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
          {/* Chat Section */}
          <ChatSection onChatDataChange={handleChatDataChange} />
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
    </>
  );
}
