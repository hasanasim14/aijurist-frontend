"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/context/ChatContext";
import { useApiContext } from "@/context/APIContext";
import toast from "react-hot-toast";
import { MobileTrigger } from "./appsidebar/MobileTrigger";
import { SidebarNavigation } from "./appsidebar/SidebarNavigation";
import { ChatHistorySection } from "./appsidebar/ChatHistorySection";
import { SidebarFooter } from "./appsidebar/SidebarFooter";
import { DeleteChatModal } from "./appsidebar/DeleteChatModal";
import { EditChatModal } from "./appsidebar/EditChatModal";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const router = useRouter();
  const { setSelectedChatId, resetPage } = useChatContext();
  const { shouldCallApi } = useApiContext();

  // State
  const [chatHistory, setChatHistory] = useState<
    Record<string, { chat_id: number; chat_title: string }[]>
  >({});
  const [chatToDelete, setChatToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [chatToEdit, setChatToEdit] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");

  // Handle mobile trigger
  const handleMobileTrigger = () => {
    if (isMobile) {
      setOpenMobile(true);
    }
  };

  // Reset page handler
  const onResetHandle = () => {
    resetPage();
    if (isMobile) toggleSidebar();
  };

  // Logout handler
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/logout_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      });
      toast.success("Logged out Successfully!");
      localStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  // Delete Chat Functionality
  const handleDeleteChat = async () => {
    if (!chatToDelete) return;

    const token = localStorage.getItem("authToken");
    try {
      await fetch(process.env.NEXT_PUBLIC_BASE_URL2 + "/delete_chat_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chat_id: chatToDelete.id }),
      });

      // Update local state to remove the deleted chat
      setChatHistory((prev) => {
        const newHistory = { ...prev };
        Object.keys(newHistory).forEach((section) => {
          newHistory[section] = newHistory[section].filter(
            (chat) => chat.chat_id !== chatToDelete.id
          );
        });
        return newHistory;
      });

      toast.success("Chat deleted successfully!");
      setChatToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete chat";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  // Edit Chat Functionality
  const handleEditChat = async (title?: string) => {
    if (!chatToEdit) return;

    const newTitle = title || newChatTitle;
    if (!newTitle.trim()) return;

    const token = localStorage.getItem("authToken");
    try {
      await fetch(process.env.NEXT_PUBLIC_BASE_URL2 + "/rename_chat_title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatToEdit.id,
          renamed_title: newTitle.trim(),
        }),
      });

      // Update local state with the new chat title
      setChatHistory((prev) => {
        const newHistory = { ...prev };
        Object.keys(newHistory).forEach((section) => {
          newHistory[section] = newHistory[section].map((chat) =>
            chat.chat_id === chatToEdit.id
              ? { ...chat, chat_title: newTitle.trim() }
              : chat
          );
        });
        return newHistory;
      });

      toast.success("Chat renamed successfully!");
      setChatToEdit(null);
      setNewChatTitle("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to rename chat";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  // Fetch chat history
  useEffect(() => {
    const fetchChatTitles = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL2 + "/get_chat_titles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ chat_id: "all", typeBin: "History" }),
          }
        );

        const data = await res.json();
        setChatHistory(data?.data);
      } catch (error) {
        console.error("Error fetching chat titles:", error);
      }
    };

    fetchChatTitles();
  }, [shouldCallApi]);

  // Set initial edit title
  useEffect(() => {
    if (chatToEdit) {
      setNewChatTitle(chatToEdit.title);
    }
  }, [chatToEdit]);

  return (
    <>
      {/* Mobile trigger button */}
      <MobileTrigger isMobile={isMobile} onTrigger={handleMobileTrigger} />

      <Sidebar collapsible="icon" {...props}>
        <SidebarContent className={cn(isMobile ? "p-2" : "p-3")}>
          {/* Main Navigation */}
          <SidebarNavigation
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
            onResetHandle={onResetHandle}
          />

          <div className="border-t border-dotted border-gray-300 dark:border-gray-600" />

          {/* Chat History */}
          <ChatHistorySection
            chatHistory={chatHistory}
            isMobile={isMobile}
            isCollapsed={isCollapsed}
            onSelectChat={(chatId) => {
              setSelectedChatId(chatId);
              if (isMobile) toggleSidebar();
            }}
            onEditChat={(chat) => {
              setChatToEdit(chat);
              if (isMobile) toggleSidebar();
            }}
            onDeleteChat={(chat) => {
              setChatToDelete(chat);
              if (isMobile) toggleSidebar();
            }}
            toggleSidebar={toggleSidebar}
          />
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onLogout={handleLogout}
        />

        <SidebarRail />
      </Sidebar>

      {/* Modals */}
      <DeleteChatModal
        chat={chatToDelete}
        onDelete={handleDeleteChat}
        onCancel={() => setChatToDelete(null)}
      />

      <EditChatModal
        chat={chatToEdit}
        onSave={(newTitle) => handleEditChat(newTitle)}
        onCancel={() => setChatToEdit(null)}
        defaultTitle={chatToEdit?.title || ""}
      />
    </>
  );
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-4 pt-12">{children}</div>
      </div>
    </SidebarProvider>
  );
}
