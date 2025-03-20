"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";

type ChatContextType = {
  selectedChatId: number | string;
  setSelectedChatId: (id: number | string) => void;
  resetPage: () => void;
  resetHeading: boolean;
  setResetHeading: (reset: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [selectedChatId, setSelectedChatId] = useState<number | string>("");
  const [resetHeading, setResetHeading] = useState(true);

  const resetPage = () => {
    setSelectedChatId("");
    setResetHeading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChatId,
        setSelectedChatId,
        resetPage,
        resetHeading,
        setResetHeading,
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
