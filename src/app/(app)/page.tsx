// "use client";

// import { useState, useEffect } from "react";
// import { useChatContext } from "@/context/ChatContext";
// import type { User } from "@/lib/utils";
// import NotificationBar from "@/components/NotificationBar";
// import ChatSection from "@/components/chat/ChatSection";

// export default function ChatUI() {
//   const [showHeading, setShowHeading] = useState(true);
//   const [hasChatData, setHasChatData] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const { selectedChatId } = useChatContext();

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       window.location.href = "/login";
//     }
//   }, []);

//   useEffect(() => {
//     if (!selectedChatId) {
//       setHasChatData(false);
//     }
//   }, [selectedChatId]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const userData = sessionStorage.getItem("user");
//       setUser(userData ? JSON.parse(userData) : null);
//     }
//   }, []);

//   const handleChatDataChange = (hasData: boolean) => {
//     setHasChatData(hasData);
//     if (hasData) {
//       setShowHeading(false);
//     } else if (!selectedChatId) {
//       setShowHeading(true);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col bg-[#f9fafb]">
//       <NotificationBar />

//       {/* Chat Container - Full height with proper padding */}
//       <div className="flex-1 w-full max-w-7xl mx-auto">
//         {/* ChatSection with improved spacing */}
//         <ChatSection onChatDataChange={handleChatDataChange} />
//       </div>
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState, useCallback } from "react";
// import ChatSection from "@/components/ChatSection";
import NotificationBar from "@/components/NotificationBar";
import ChatSection from "@/components/chat/ChatSection";
import { useChatContext } from "@/context/ChatContext";

interface ChatData {
  role: string;
  content: string;
}

const ChatUI: React.FC = () => {
  const [chatData, setChatData] = useState<ChatData[]>([]);

  // export default function ChatUI() {
  const [showHeading, setShowHeading] = useState(true);
  const [hasChatData, setHasChatData] = useState(false);
  // const [user, setUser] = useState<User | null>(null);
  const { selectedChatId } = useChatContext();

  const handleChatDataChange = (hasData: boolean) => {
    setHasChatData(hasData);
    if (hasData) {
      setShowHeading(false);
    } else if (!selectedChatId) {
      setShowHeading(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f9fafb]">
      <NotificationBar />

      {/* Chat Container - Full height with proper padding */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-0">
        {/* ChatSection with improved spacing */}
        <ChatSection onChatDataChange={handleChatDataChange} />
      </div>
    </div>
  );
};

export default ChatUI;
