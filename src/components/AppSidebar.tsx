// "use client";

// import type * as React from "react";
// import {
//   MessageSquarePlus,
//   User,
//   UserRound,
//   LogOut,
//   Settings,
//   CircleHelp,
//   ShieldCheck,
//   FileText,
//   MoreVertical,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarRail,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { cn, sampleHistory } from "@/lib/utils";

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { state } = useSidebar();
//   const isCollapsed = state === "collapsed";

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarContent>
//         {/* Main Navigation */}
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <div
//                 className={cn(
//                   "transition-all duration-200",
//                   isCollapsed
//                     ? "flex flex-col gap-2"
//                     : "flex flex-row items-center gap-2"
//                 )}
//               >
//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild tooltip="Toggle Sidebar">
//                     <span className="flex items-center">
//                       <SidebarTrigger
//                         className={cn(
//                           "h-auto w-auto",
//                           isCollapsed ? "mx-auto" : "mr-2"
//                         )}
//                       />
//                     </span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>

//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild tooltip="New Chat">
//                     <a href="#" className="flex items-center">
//                       <MessageSquarePlus
//                         className={cn(
//                           "shrink-0",
//                           isCollapsed ? "w-5 h-5 mx-auto" : "w-5 h-5 mr-2"
//                         )}
//                       />
//                       <span className={cn(isCollapsed ? "sr-only" : "block")}>
//                         New Chat
//                       </span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               </div>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* chat history */}
//         {!isCollapsed && (
//           <SidebarGroup>
//             <SidebarGroupContent>
//               <div className="px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
//                 Chat History
//               </div>
//               <SidebarMenu>
//                 {sampleHistory.map((chat) => (
//                   <SidebarMenuItem
//                     key={chat.id}
//                     className="flex justify-between items-center"
//                   >
//                     <SidebarMenuButton
//                       asChild
//                       tooltip={chat.title}
//                       className="flex-1"
//                     >
//                       <div className="truncate">{chat.title}</div>
//                     </SidebarMenuButton>

//                     {/* Popover Menu for Edit & Delete */}
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-800"
//                         >
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent
//                         align="end"
//                         side="right"
//                         className="w-32 p-1"
//                       >
//                         <button className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
//                           <Edit className="h-4 w-4 mr-2" /> Edit
//                         </button>
//                         <button className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
//                           <Trash2 className="h-4 w-4 mr-2 text-red-500" />{" "}
//                           Delete
//                         </button>
//                       </PopoverContent>
//                     </Popover>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}
//       </SidebarContent>

//       {/* Sidebar Footer with Popover */}
//       <SidebarFooter className="p-4">
//         {/* Dotted Line Separator */}
//         <div className="border-t border-dotted border-gray-300 dark:border-gray-600 my-4" />

//         {/* Footer buttons container - row when expanded, column when collapsed */}
//         <div
//           className={cn(
//             "flex gap-3 transition-all duration-200",
//             isCollapsed ? "flex-col" : "flex-row"
//           )}
//         >
//           {/* Settings Button */}
//           <Popover>
//             {/* <PopoverContent asChild> */}
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className={cn(
//                   "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center",
//                   isCollapsed
//                     ? "justify-center p-2.5 h-10 w-full"
//                     : "justify-start p-2.5 h-10 flex-1"
//                 )}
//                 onClick={() => console.log("Settings clicked")}
//               >
//                 <Settings className="w-5 h-5 shrink-0" />
//                 <span
//                   className={cn(
//                     "ml-2 text-sm font-medium",
//                     isCollapsed ? "sr-only" : "block"
//                   )}
//                 >
//                   Settings
//                 </span>
//               </Button>
//               {/* </PopoverContent> */}
//             </PopoverTrigger>
//             <PopoverContent align="end" side="right" className="w-50 p-0">
//               <div className="flex flex-col p-2">
//                 {/* Help */}
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
//                 >
//                   <CircleHelp className="w-4 h-4" />
//                   <span>Help</span>
//                 </Link>
//                 {/* Privacy Policy */}
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
//                 >
//                   <ShieldCheck className="w-4 h-4" />
//                   <span>Privacy Policy</span>
//                 </Link>
//                 {/* Terms of use */}
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
//                 >
//                   <FileText className="w-4 h-4" />
//                   <span>Terms of Use</span>
//                 </Link>
//               </div>
//             </PopoverContent>
//           </Popover>

//           {/* Account Button */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className={cn(
//                   "rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center",
//                   isCollapsed
//                     ? "justify-center p-2.5 h-10 w-full"
//                     : "justify-start p-2.5 h-10 flex-1"
//                 )}
//               >
//                 <UserRound className="w-5 h-5 shrink-0" />
//                 <span
//                   className={cn(
//                     "ml-2 text-sm font-medium",
//                     isCollapsed ? "sr-only" : "block"
//                   )}
//                 >
//                   Account
//                 </span>
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent align="end" side="right" className="w-50 p-0">
//               <div className="flex flex-col p-2">
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
//                 >
//                   <User className="w-4 h-4" />
//                   <span>Profile</span>
//                 </Link>

//                 <button
//                   className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
//                   onClick={() => console.log("Logout clicked")}
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </SidebarFooter>

//       <SidebarRail />
//     </Sidebar>
//   );
// }

// function SidebarMenuButton({
//   children,
//   className,
//   asChild,
//   tooltip,
//   ...props
// }: React.ComponentProps<typeof Button> & {
//   asChild?: boolean;
//   tooltip?: string;
// }) {
//   if (asChild) {
//     return (
//       <span className={cn("w-full", className)} {...props}>
//         {children}
//       </span>
//     );
//   }

//   return (
//     <Button
//       variant="ghost"
//       className={cn("w-full justify-start", className)}
//       {...props}
//     >
//       {children}
//     </Button>
//   );
// }
"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";

import type * as React from "react";
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
import Link from "next/link";
import { cn, sampleHistory } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Create a mobile trigger that will open the sidebar sheet on mobile
  const handleMobileTrigger = () => {
    if (isMobile) {
      setOpenMobile(true);
    }
  };

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
          <MessageSquarePlus className="h-5 w-5" />
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
              <SidebarGroupContent>
                <div className="px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Chat History
                </div>
                <SidebarMenu
                  className={cn(isMobile ? "space-y-1" : "space-y-2")}
                >
                  {sampleHistory.map((chat) => (
                    <SidebarMenuItem
                      key={chat.id}
                      className="flex justify-between items-center"
                    >
                      <SidebarMenuButton
                        asChild
                        tooltip={chat.title}
                        className={cn("flex-1", isMobile ? "py-1.5" : "py-2")}
                      >
                        <div className="truncate">{chat.title}</div>
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
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </button>
                          <button className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />{" "}
                            Delete
                          </button>
                        </PopoverContent>
                      </Popover>
                    </SidebarMenuItem>
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
                    onClick={() => console.log("Logout clicked")}
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
        <div className="flex-1 p-4">{children}</div>
      </div>
    </SidebarProvider>
  );
}
