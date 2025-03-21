"use client";

import { useState, useEffect } from "react";
import { useChatContext } from "@/context/ChatContext";
import { User } from "@/lib/utils";
import {
  Globe,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Code,
  FileText,
  Layers,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import NotificationBar from "@/components/NotificationBar";
import ChatSection from "@/components/chat/ChatSection";

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
  const [showHeading, setShowHeading] = useState(true);
  const [hasChatData, setHasChatData] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { selectedChatId, resetHeading } = useChatContext();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Redirect to login if no auth token
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!selectedChatId) {
      setHasChatData(false);
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  const handleChatDataChange = (hasData: boolean) => {
    setHasChatData(hasData);
    if (hasData) {
      setShowHeading(false);
    } else if (!selectedChatId) {
      setShowHeading(true);
    }
  };

  return (
    <div className="relative h-screen flex flex-col items-center bg-[#f9fafb]">
      <NotificationBar />

      {/* Chat Messages Container */}
      <div
        className={`w-full max-w-[100%] flex-1 overflow-y-auto p-6 pb-24 ${
          hasChatData ? "pt-16" : ""
        }`}
      >
        {/* Single ChatSection that handles both past and current messages */}
        <ChatSection onChatDataChange={handleChatDataChange} />
      </div>
    </div>
  );
}
