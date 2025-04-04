"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationBar from "@/components/NotificationBar";
import ChatSection from "@/components/chat/ChatSection";

export default function ChatUI() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f9fafb]">
      <NotificationBar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-0">
        <ChatSection />
      </div>
    </div>
  );
}
