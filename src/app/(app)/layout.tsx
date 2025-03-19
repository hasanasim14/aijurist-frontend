import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ApiProvider } from "@/context/APIContext";
import { ChatProvider } from "@/context/ChatContext";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <ApiProvider>
        <SidebarProvider>
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </SidebarProvider>
      </ApiProvider>
    </ChatProvider>
  );
}
