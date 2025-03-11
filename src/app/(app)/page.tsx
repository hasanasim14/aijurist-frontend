"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { useState, useRef, useEffect } from "react";

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="relative h-screen flex flex-col items-center justify-center px-4">
      {showHeading && (
        <div className="absolute top-12 text-center w-full px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Hi there, User</h1>
          <h1 className="text-3xl md:text-4xl font-bold">
            What would you like to know?
          </h1>
          <p className="text-gray-500 mt-4">
            Use one of the most common prompts below or use your own to begin
          </p>

          {/* Responsive Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {[1, 2, 3, 4].map((item, index) => {
              const Icon = icons[index % icons.length]; // Assigning icons dynamically
              return (
                <Card
                  key={item}
                  className="flex flex-col items-center p-6 shadow-md rounded-xl bg-white dark:bg-gray-800"
                >
                  <Icon
                    size={32}
                    className="text-gray-600 dark:text-gray-400 mb-2"
                  />
                  <CardContent className="text-center">
                    <h3 className="text-lg font-semibold">Card {item}</h3>
                    <p className="text-gray-500 text-sm">
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
        className="w-full max-w-2xl flex-1 overflow-y-auto px-4 py-16 mt-20 mb-24 dark:bg-gray-900"
        style={{ height: "65vh" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-lg max-w-xs md:max-w-sm ${
              msg.role === "user"
                ? "bg-gray-200 text-black self-end ml-auto"
                : "bg-[#65C466] text-white self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
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
                ? "bg-black text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} className="m-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
