"use client";

import { useState } from "react";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ChatHistoryItemProps {
  chatId: number;
  chatTitle: string;
  isMobile: boolean;
  onSelect: (chatId: number) => void;
  onEdit: (chat: { id: number; title: string }) => void;
  onDelete: (chat: { id: number; title: string }) => void;
  setOpenMobile: (open: boolean) => void;
}

export function ChatHistoryItem({
  chatId,
  chatTitle,
  isMobile,
  onSelect,
  onEdit,
  onDelete,
  setOpenMobile,
}: ChatHistoryItemProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSelect = () => {
    onSelect(chatId);
  };

  const handleEdit = () => {
    setIsPopoverOpen(false);
    onEdit({ id: chatId, title: chatTitle });
  };

  const handleDelete = () => {
    setIsPopoverOpen(false);
    onDelete({ id: chatId, title: chatTitle });
  };

  return (
    <SidebarMenuItem className="flex justify-between items-center">
      {/* Chat Title */}
      <SidebarMenuButton
        asChild
        tooltip={chatTitle}
        className={cn("flex-1 cursor-pointer", isMobile ? "py-1.5" : "py-2")}
        onClick={handleSelect}
      >
        <div className="truncate">{chatTitle}</div>
      </SidebarMenuButton>

      {/* Popover Menu for Edit & Delete */}
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => setIsPopoverOpen(open)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" side="right" className="w-32 p-1">
          <button
            className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" /> Rename
          </button>
          <button
            className="flex text-red-500 items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2 text-red-500" /> Delete
          </button>
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}
