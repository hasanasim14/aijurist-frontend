"use client";

import type React from "react";
import { User } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { BookOpenCheck, FileText, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatContext } from "@/context/ChatContext";

interface CardData {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const { setSelectedChatId } = useChatContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  const cardsData: CardData[] = [
    {
      id: 1,
      title: "General Knowledge",
      description: "Can you evict an orphan?",
      icon: BookOpenCheck,
    },
    {
      id: 2,
      title: "Case Summaries",
      description: "Summarize case 1947 SLD 1, (1947) 15 ITR 502",
      icon: FileText,
    },
    {
      id: 3,
      title: "Legal Procedures",
      description: "How to file a case",
      icon: ClipboardList,
    },
  ];

  const handleCardClick = (description: string) => {
    const event = new CustomEvent("startChatFromCard", {
      detail: { query: description },
    });
    document.dispatchEvent(event);
    setSelectedChatId("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto pt-8 pb-6 px-4">
      <div className="text-center flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-black to-purple-500 text-transparent bg-clip-text">
            Hi there, {user?.firstName || "User"}
          </span>
        </h1>
        <span className="mb-3 text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
          What would you like to know?
        </span>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Use one of the most common prompts below or use your own to begin
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
        {cardsData.map((card) => (
          <Card
            key={card.id}
            className="flex flex-col items-center p-4 shadow-md rounded-xl dark:bg-gray-800 h-full flex-grow cursor-pointer transition-colors duration-200 hover:bg-gray-100"
            onClick={() => handleCardClick(card.description)}
          >
            <card.icon
              size={36}
              className="dark:text-gray-400"
              aria-label={`Icon for ${card.title}`}
            />
            <CardContent className="text-center p-2 w-full">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Header;
