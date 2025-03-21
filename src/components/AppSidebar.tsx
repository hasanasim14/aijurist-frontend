"use client";

import type * as React from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  MessageSquarePlus,
  User,
  UserRound,
  LogOut,
  Settings,
  CircleHelp,
  ShieldCheck,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Menu,
  AlertTriangle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/context/ChatContext";
import { useApiContext } from "@/context/APIContext";
import Link from "next/link";
import toast from "react-hot-toast";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Create a mobile trigger that will open the sidebar sheet on mobile
  const handleMobileTrigger = () => {
    if (isMobile) {
      setOpenMobile(true);
    }
  };

  const router = useRouter();
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
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const { setSelectedChatId, resetPage, setResetHeading } = useChatContext();
  const { shouldCallApi } = useApiContext();

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
  const handleEditChat = async () => {
    if (!chatToEdit || !newChatTitle.trim()) return;

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
          renamed_title: newChatTitle.trim(),
        }),
      });

      // Update local state with the new chat title
      setChatHistory((prev) => {
        const newHistory = { ...prev };
        Object.keys(newHistory).forEach((section) => {
          newHistory[section] = newHistory[section].map((chat) =>
            chat.chat_id === chatToEdit.id
              ? { ...chat, chat_title: newChatTitle.trim() }
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

  // Get Past titles
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
            body: JSON.stringify({ chat_id: "all" }),
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

  // Set the new chat title when a chat is selected for editing - with memoization
  useEffect(() => {
    if (chatToEdit) {
      setNewChatTitle(chatToEdit.title);
    }
  }, [chatToEdit?.id]); // Only depend on the ID, not the entire object

  const onResetHandle = () => {
    resetPage();
    setResetHeading(true);
    if (isMobile) toggleSidebar();
  };

  return (
    <>
      {/* Mobile trigger button that's always visible on small screens */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-8 left-4 z-50 md:hidden rounded-2xl"
          onClick={handleMobileTrigger}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Menu</span>
        </Button>
      )}

      <Sidebar collapsible="icon" {...props}>
        <SidebarContent className={cn(isMobile ? "p-2" : "p-3")}>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <div
                  className={cn(
                    "transition-all duration-200",
                    isCollapsed
                      ? "flex flex-col gap-3"
                      : "flex flex-row items-center gap-3"
                  )}
                >
                  <SidebarMenuItem>
                    <Button
                      variant="outline"
                      className={cn(
                        "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center cursor-pointer",
                        "active:scale-95 active:bg-gray-200 dark:active:bg-gray-800",
                        isCollapsed
                          ? "justify-center p-2.5 h-10 w-full"
                          : "justify-center p-2.5 h-10 flex-1",
                        isMobile && !isCollapsed ? "text-xs p-2 h-9" : "text-xs"
                      )}
                      onClick={toggleSidebar}
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Button
                      variant="outline"
                      className={cn(
                        "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center",
                        isCollapsed
                          ? "justify-center p-2.5 h-10 w-full"
                          : "justify-start p-2.5 h-10 flex-1",
                        isMobile && !isCollapsed ? "text-xs p-2 h-9" : ""
                      )}
                      onClick={onResetHandle}
                      asChild
                    >
                      <Link href="/">
                        <MessageSquarePlus className="w-5 h-5 shrink-0" />
                        <span
                          className={cn(
                            "ml-2 text-sm font-medium",
                            isCollapsed ? "sr-only" : "block"
                          )}
                        >
                          New Chat
                        </span>
                      </Link>
                    </Button>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="border-t border-dotted border-gray-300 dark:border-gray-600 my-1" />

          {/* chat history */}
          {(!isCollapsed || isMobile) && (
            <SidebarGroup>
              <SidebarGroupContent className="max-h-[calc(100vh-220px)] overflow-y-auto">
                <div className="px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Chat History
                </div>
                <SidebarMenu
                  className={cn(isMobile ? "space-y-1" : "space-y-2")}
                >
                  {chatHistory &&
                    Object.entries(chatHistory)
                      .filter(([, chats]) => chats.length > 0)
                      .map(([section, chats]) => (
                        <div key={section}>
                          {/* Section Header */}
                          <div className="sticky top-0 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 z-10">
                            {section}
                          </div>

                          {/* Chat Items */}
                          {chats.length >= 1 &&
                            chats.map((chat) => (
                              <SidebarMenuItem
                                key={chat.chat_id}
                                className="flex justify-between items-center"
                              >
                                {/* Chat Title */}
                                <SidebarMenuButton
                                  asChild
                                  tooltip={chat.chat_title}
                                  className={cn(
                                    "flex-1 cursor-pointer",
                                    isMobile ? "py-1.5" : "py-2"
                                  )}
                                  onClick={() => {
                                    setSelectedChatId(chat?.chat_id);
                                    if (isMobile) toggleSidebar();
                                  }}
                                >
                                  <div className="truncate">
                                    {chat.chat_title}
                                  </div>
                                </SidebarMenuButton>

                                {/* Popover Menu for Edit & Delete */}
                                <Popover
                                  open={openPopoverId === chat.chat_id}
                                  onOpenChange={(open) => {
                                    setOpenPopoverId(
                                      open ? chat.chat_id : null
                                    );
                                  }}
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
                                  <PopoverContent
                                    align="end"
                                    side="right"
                                    className="w-32 p-1"
                                  >
                                    <button
                                      className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                                      onClick={() => {
                                        setChatToEdit({
                                          id: chat.chat_id,
                                          title: chat.chat_title,
                                        });
                                        setOpenPopoverId(null);
                                        if (isMobile) toggleSidebar();
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" /> Rename
                                    </button>
                                    <button
                                      className="flex text-red-500 items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                                      onClick={() => {
                                        setChatToDelete({
                                          id: chat.chat_id,
                                          title: chat.chat_title,
                                        });
                                        setOpenPopoverId(null);
                                        if (isMobile) toggleSidebar();
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />{" "}
                                      Delete
                                    </button>
                                  </PopoverContent>
                                </Popover>
                              </SidebarMenuItem>
                            ))}
                        </div>
                      ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Sidebar Footer with Popover */}
        <SidebarFooter
          className={cn("px-4 pb-4", isMobile ? "px-2 pb-2" : "px-4 pb-4")}
        >
          {/* Dotted Line Separator */}
          <div className="border-t border-dotted border-gray-300 dark:border-gray-600 my-2" />

          <div
            className={cn(
              "flex gap-3 transition-all duration-200",
              isCollapsed ? "flex-col" : "flex-row",
              isMobile && !isCollapsed ? "flex-col gap-2" : ""
            )}
          >
            {/* Settings Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center cursor-pointer",
                    isCollapsed
                      ? "justify-center p-2.5 h-10 w-full"
                      : "justify-center p-2.5 h-10 flex-1",
                    isMobile && !isCollapsed ? "text-xs p-2 h-9" : ""
                  )}
                  onClick={() => console.log("Settings clicked")}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      isCollapsed ? "sr-only" : "block"
                    )}
                  >
                    Settings
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align={isMobile ? "center" : "end"}
                side={isMobile ? "bottom" : "right"}
                className="w-50 p-0"
              >
                <div className="flex flex-col p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <CircleHelp className="w-4 h-4" />
                    <span>Help</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Terms of Use</span>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            {/* Account Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center cursor-pointer",
                    isCollapsed
                      ? "justify-center p-2.5 h-10 w-full"
                      : "justify-center p-2.5 h-10 flex-1",
                    isMobile && !isCollapsed ? "text-xs p-2 h-9" : ""
                  )}
                >
                  <UserRound className="w-5 h-5 shrink-0" />
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      isCollapsed ? "sr-only" : "block"
                    )}
                  >
                    Account
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align={isMobile ? "center" : "end"}
                side={isMobile ? "bottom" : "right"}
                className="w-50 p-0"
              >
                <div className="flex flex-col p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>

                  <button
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium mt-4 text-center">
                Are you sure?
              </h3>
            </div>

            {/* Description */}
            <p className="mb-6 text-center">
              Are you sure you want to delete the chat &quot;
              <br />
              <span className="font-bold">{chatToDelete.title} ?&quot;</span>
              <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex flex-col space-y-2">
              <Button
                variant="destructive"
                onClick={handleDeleteChat}
                className="cursor-pointer"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setChatToDelete(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Chat Modal */}
      {chatToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Rename Chat</h3>
            <div className="mb-6">
              <label
                htmlFor="chat-title"
                className="block text-sm font-medium mb-2"
              >
                New Title
              </label>
              <Input
                id="chat-title"
                defaultValue={chatToEdit.title}
                onChange={(e) => {
                  // Use direct DOM value instead of state for rendering
                  setNewChatTitle(e.target.value);
                }}
                placeholder="Enter new chat title"
                className="w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleEditChat();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setChatToEdit(null)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleEditChat}
                disabled={!newChatTitle.trim()}
                className="cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
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
