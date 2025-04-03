"use client";

import Link from "next/link";
import {
  CircleHelp,
  FileText,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onLogout: () => Promise<void>;
}

export function SidebarFooter({
  isCollapsed,
  isMobile,
  onLogout,
}: SidebarFooterProps) {
  return (
    <UISidebarFooter
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
                href="/help"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <CircleHelp className="w-4 h-4" />
                <span>Help</span>
              </Link>
              <Link
                href="/privacy_policy"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/terms_of_use"
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
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </UISidebarFooter>
  );
}
