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
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { baseURL, cn } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    state,
    isMobile,
    // , openMobile,
    setOpenMobile,
  } = useSidebar();
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

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await fetch(baseURL + "/logout_user", {
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

  useEffect(() => {
    const fetchChatTitles = async () => {
      const token = localStorage.getItem("authToken");
      console.log("token", token);
      try {
        const res = await fetch(
          "https://devlegal.ai-iscp.com/get_chat_titles",
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

        console.log("response =>", data.data);
      } catch (error) {
        console.error("Error fetching chat titles:", error);
      }
    };

    fetchChatTitles();
  }, []);

  console.log("chat hisrot", chatHistory);

  return (
    <>
      {/* Mobile trigger button that's always visible on small screens */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
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
                      ? "flex flex-col gap-2"
                      : "flex flex-row items-center gap-2"
                  )}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Toggle Sidebar">
                      <span className="flex items-center">
                        <SidebarTrigger
                          className={cn(
                            "h-auto w-auto",
                            isCollapsed ? "mx-auto" : "mr-2"
                          )}
                        />
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="New Chat">
                      <a href="#" className="flex items-center">
                        <MessageSquarePlus
                          className={cn(
                            "shrink-0",
                            isCollapsed ? "w-5 h-5 mx-auto" : "w-5 h-5 mr-2"
                          )}
                        />
                        <span className={cn(isCollapsed ? "sr-only" : "block")}>
                          New Chat
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

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
                      .filter(([, chats]) => chats.length > 0) // Filter out empty sections
                      .map(([section, chats]) => (
                        <div key={section}>
                          {/* Section Header */}
                          <div className="sticky top-0 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 z-10">
                            {section}
                          </div>

                          {/* Chat Items */}
                          {chats.map((chat) => (
                            <SidebarMenuItem
                              key={chat.chat_id}
                              className="flex justify-between items-center"
                            >
                              {/* Chat Title */}
                              <SidebarMenuButton
                                asChild
                                tooltip={chat.chat_title}
                                className={cn(
                                  "flex-1",
                                  isMobile ? "py-1.5" : "py-2"
                                )}
                              >
                                <div className="truncate">
                                  {chat.chat_title}
                                </div>
                              </SidebarMenuButton>

                              {/* Popover Menu for Edit & Delete */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-800"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="end"
                                  side="right"
                                  className="w-32 p-1"
                                >
                                  <button className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                    <Edit className="h-4 w-4 mr-2" /> Rename
                                  </button>
                                  <button className="flex text-red-500 items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
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
        <SidebarFooter className={cn("p-4", isMobile ? "p-2" : "p-4")}>
          {/* Dotted Line Separator */}
          <div className="border-t border-dotted border-gray-300 dark:border-gray-600 my-4" />

          {/* Footer buttons container - row when expanded, column when collapsed */}
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
                    "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center",
                    isCollapsed
                      ? "justify-center p-2.5 h-10 w-full"
                      : "justify-start p-2.5 h-10 flex-1",
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
                  {/* Help */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <CircleHelp className="w-4 h-4" />
                    <span>Help</span>
                  </Link>
                  {/* Privacy Policy */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </Link>
                  {/* Terms of use */}
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
                    "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center",
                    isCollapsed
                      ? "justify-center p-2.5 h-10 w-full"
                      : "justify-start p-2.5 h-10 flex-1",
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
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
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
    </>
  );
}

// Add this at the end of the file
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
