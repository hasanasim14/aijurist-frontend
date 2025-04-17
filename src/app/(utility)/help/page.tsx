"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import Footer from "@/components/utility/Footer";

// Menu items now point to section IDs
const items = [
  {
    title: "Home",
    url: "#home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
  },
];

export default function Help() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: "smooth" });
      });
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar className="flex-shrink-0 w-64">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-8">
          <section id="home" className="min-h-screen py-20">
            <h1 className="text-5xl font-bold mb-6">Home Section</h1>
            <p className="text-lg">This is the home section content...</p>
          </section>

          <section id="inbox" className="min-h-screen py-20">
            <h1 className="text-5xl font-bold mb-6">Inbox Section</h1>
            <p className="text-lg">This is the inbox section content...</p>
          </section>

          <section id="calendar" className="min-h-screen py-20">
            <h1 className="text-5xl font-bold mb-6">Calendar Section</h1>
            <p className="text-lg">This is the calendar section content...</p>
          </section>

          <section id="search" className="min-h-screen py-20">
            <h1 className="text-5xl font-bold mb-6">Search Section</h1>
            <p className="text-lg">This is the search section content...</p>
          </section>

          <section id="settings" className="min-h-screen py-20">
            <h1 className="text-5xl font-bold mb-6">Settings Section</h1>
            <p className="text-lg">This is the settings section content...</p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
