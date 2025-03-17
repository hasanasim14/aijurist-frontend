"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useChatContext } from "@/context/ChatContext";

const ChatSection = () => {
  const { selectedChatId } = useChatContext();
  const [pastChat, setPastChat] = useState<any[]>();

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
        setPastChat(data.data);
      } catch (error) {
        console.error("Error fetching chat", error);
      }
    };

    pastChats();
  }, [selectedChatId]);

  console.log("the context api is", selectedChatId);

  return (
    <>
      {Array.isArray(pastChat) && pastChat.length > 0 ? (
        pastChat.map((chat, index) => (
          <div key={index} className="flex flex-col space-y-2">
            {/* User query */}
            <div className="p-4 my-2 rounded-lg max-w-2xl bg-[#e0e0e0] text-black self-end ml-10">
              {typeof chat?.user_query === "object"
                ? Object.values(chat?.user_query)[0]
                : chat?.user_query}
            </div>

            {/* Chatbot response */}
            <div className="flex items-start space-x-2 self-start mr-10">
              {/* White Circle with Logo */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border">
                <Image
                  src="/logo-small.png"
                  width={20}
                  height={20}
                  alt="Chatbot Logo"
                />
              </div>

              {/* Response Text */}
              <div className="p-4 rounded-lg max-w-2xl bg-[#D8D8D8] text-black">
                {typeof chat.llm_response === "object"
                  ? Object.values(chat?.llm_response)[0]
                  : chat?.llm_response}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No past chats found.</p>
      )}
    </>
  );
};

export default ChatSection;
