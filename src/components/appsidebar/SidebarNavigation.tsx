"use client";

import Link from "next/link";
import { Menu, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  isCollapsed: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  onResetHandle: () => void;
}

export function SidebarNavigation({
  isCollapsed,
  isMobile,
  toggleSidebar,
  onResetHandle,
}: SidebarNavigationProps) {
  return (
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
  );
}
