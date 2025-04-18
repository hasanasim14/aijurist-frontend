"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ChatHistoryItem } from "./ChatHistoryItem";
import { cn } from "@/lib/utils";

interface ChatHistorySectionProps {
  chatHistory: Record<string, { chat_id: number; chat_title: string }[]>;
  isMobile: boolean;
  isCollapsed: boolean;
  onSelectChat: (chatId: number) => void;
  onEditChat: (chat: { id: number; title: string }) => void;
  onDeleteChat: (chat: { id: number; title: string }) => void;
  setOpenMobile: (open: boolean) => void;
}

export function ChatHistorySection({
  chatHistory,
  isMobile,
  isCollapsed,
  onSelectChat,
  onEditChat,
  onDeleteChat,
  setOpenMobile,
}: ChatHistorySectionProps) {
  if (isCollapsed && !isMobile) return null;

  // Check for chats
  const hasChats =
    chatHistory &&
    Object.values(chatHistory).some(
      (chats) => Array.isArray(chats) && chats.length > 0
    );

  return (
    <SidebarGroup>
      <SidebarGroupContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          Chat History
        </div>
        {hasChats ? (
          <SidebarMenu className={cn(isMobile ? "space-y-1" : "space-y-2")}>
            {Object.entries(chatHistory)
              .filter(([, chats]) => Array.isArray(chats) && chats.length > 0)
              .map(([section, chats]) => (
                <div key={section}>
                  <div className="sticky top-0 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 z-10">
                    {section}
                  </div>
                  {Array.isArray(chats) &&
                    chats.map((chat) => (
                      <ChatHistoryItem
                        key={chat.chat_id}
                        chatId={chat.chat_id}
                        chatTitle={chat.chat_title}
                        isMobile={isMobile}
                        onSelect={onSelectChat}
                        onEdit={onEditChat}
                        onDelete={onDeleteChat}
                        setOpenMobile={setOpenMobile}
                      />
                    ))}
                </div>
              ))}
          </SidebarMenu>
        ) : null}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
