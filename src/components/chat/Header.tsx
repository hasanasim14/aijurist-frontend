"use client";

import { useState, useEffect } from "react";

import { User } from "@/lib/utils";
import {
  Globe,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Code,
  FileText,
  Layers,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const icons = [
  Globe,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Code,
  FileText,
  Layers,
  Pencil,
];

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  return (
    <div className="relative h-screen flex flex-col items-center bg-[#f9fafb]">
      <div className="mt-8 mb-8 text-center w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-purple-500 text-transparent bg-clip-text">
          Hi there, {user?.firstName || "User"}
        </span>
        <br />
        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
          What would you like to know?
        </span>
        <p className="text-gray-500 mt-4 mb-6">
          Use one of the most common prompts below or use your own to begin
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card
                key={item}
                className="flex flex-col items-center p-4 shadow-md rounded-xl bg-white dark:bg-gray-800 h-full flex-grow"
              >
                <Icon
                  size={36}
                  className="text-gray-600 dark:text-gray-400 mb-3"
                  aria-label={`Icon for Card ${item}`}
                />
                <CardContent className="text-center p-2 w-full">
                  <h3 className="text-lg font-semibold">Card {item}</h3>
                  <p className="text-sm text-gray-500">
                    This is a sample text for card {item}.
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
