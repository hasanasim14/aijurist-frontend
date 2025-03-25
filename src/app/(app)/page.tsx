"use client";

import NotificationBar from "@/components/NotificationBar";
import ChatSection from "@/components/chat/ChatSection";

const ChatUI = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#f9fafb]">
      <NotificationBar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-0">
        <ChatSection />
      </div>
    </div>
  );
};

export default ChatUI;
