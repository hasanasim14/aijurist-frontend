import type React from "react";
import { Card, CardContent } from "../ui/card";
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
import { useEffect, useState } from "react";
import { User } from "@/lib/utils";

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

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto pt-8 pb-6 px-4">
      <div className="text-center flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-black to-purple-500 text-transparent bg-clip-text">
            Hi there, {user?.firstName || "User"}
          </span>
        </h1>
        <span className="mb-3 text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
          What would you like to know?
        </span>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Use one of the most common prompts below or use your own to begin
        </p>
      </div>
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

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"> */}
      {/* </div> */}
    </div>
  );
};

export default Header;
