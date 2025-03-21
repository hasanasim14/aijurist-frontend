"use client";

import type React from "react";

import { useRef, useEffect } from "react";
import { Send, Paperclip, ScrollText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  sendMessage: () => void;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleKeyDown,
  sendMessage,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 px-4">
      <div className="w-full max-w-sm md:max-w-2xl bg-white shadow-lg rounded-3xl px-4 py-2 border">
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

            <Dialog>
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
  );
}
