"use client";

import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import NotificationBar from "@/components/NotificationBar";
import ChatSection from "@/components/chat/ChatSection";

interface ChatData {
  role: string;
  content: string;
}

const ChatUI = () => {
  // const [showHeading, setShowHeading] = useState(true);
  // const [hasChatData, setHasChatData] = useState(false);
  // const { selectedChatId } = useChatContext();

  // const handleChatDataChange = (hasData: boolean) => {
  //   setHasChatData(hasData);
  //   if (hasData) {
  //     setShowHeading(false);
  //   } else if (!selectedChatId) {
  //     setShowHeading(true);
  //   }
  // };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f9fafb]">
      <NotificationBar />

      {/* Chat Container - Full height with proper padding */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-0">
        {/* ChatSection with improved spacing */}
        <ChatSection />
      </div>
    </div>
  );
};

export default ChatUI;
