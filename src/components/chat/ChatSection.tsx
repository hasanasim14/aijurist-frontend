"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useChatContext } from "@/context/ChatContext";

interface ChatSectionProps {
  onChatDataChange?: (hasChatData: boolean) => void;
}

const ChatSection = ({ onChatDataChange }: ChatSectionProps) => {
  const { selectedChatId } = useChatContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pastChat, setPastChat] = useState<any[]>([]);

  useEffect(() => {
    console.log("the context api is", selectedChatId);
    const pastChats = async () => {
      const token = localStorage.getItem("authToken");
      // const chat_id = 1;
      try {
        const res = await fetch("https://devlegal.ai-iscp.com/pastchat_t5", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chat_id: selectedChatId }),
        });
        const data = await res.json();
        console.log("Chat data=>", data.data);
        setPastChat(data.data || []);

        // Notify parent component about chat data status
        if (onChatDataChange) {
          onChatDataChange(Array.isArray(data.data) && data.data.length > 0);
        }
      } catch (error) {
        console.error("Error fetching chat", error);
        setPastChat([]);
        if (onChatDataChange) {
          onChatDataChange(false);
        }
      }
    };

    if (selectedChatId) {
      pastChats();
    } else {
      setPastChat([]);
      if (onChatDataChange) {
        onChatDataChange(false);
      }
    }
  }, [selectedChatId, onChatDataChange]);

  console.log("the context api is", selectedChatId);

  return (
    <>
      {Array.isArray(pastChat) && pastChat.length > 0 ? (
        pastChat.map((chat, index) => (
          <div key={index} className="flex flex-col space-y-4">
            {/* User query */}
            <div className="p-4 my-4 rounded-lg max-w-2xl bg-[#e4e4e5] text-black self-end ml-10 border border-gray-300">
              {typeof chat?.user_query === "object"
                ? Object.values(chat?.user_query)[0]
                : chat?.user_query}
            </div>

            {/* Chatbot response */}
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
                {typeof chat.llm_response === "object"
                  ? Object.values(chat?.llm_response)[0]
                  : chat?.llm_response}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500"> </p>
      )}
    </>
  );
};

export default ChatSection;
