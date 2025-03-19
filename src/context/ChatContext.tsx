"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";

type ChatContextType = {
  selectedChatId: number | string;
  setSelectedChatId: (id: number | string) => void;
  resetPage: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [selectedChatId, setSelectedChatId] = useState<number | string>("");

  // Reset function to clear chat and bring page to its original state
  const resetPage = () => {
    setSelectedChatId("");
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChatId,
        setSelectedChatId,
        resetPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
