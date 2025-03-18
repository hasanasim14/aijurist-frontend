// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

// type ChatContextType = {
//   selectedChatId: number | null;
//   setSelectedChatId: (id: number | null) => void;
// };

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export function ChatProvider({ children }: { children: ReactNode }) {
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

//   return (
//     <ChatContext.Provider value={{ selectedChatId, setSelectedChatId }}>
//       {children}
//     </ChatContext.Provider>
//   );
// }

// export function useChatContext() {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error("useChatContext must be used within a ChatProvider");
//   }
//   return context;
// }

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  selectedChatId: number | string;
  setSelectedChatId: (id: number | string) => void;
  resetPage: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedChatId, setSelectedChatId] = useState<number | string>("");

  // Reset function to clear chat and bring page to its original state
  const resetPage = () => {
    setSelectedChatId("");
    // Add other states if needed to reset the page fully
  };

  return (
    <ChatContext.Provider
      value={{ selectedChatId, setSelectedChatId, resetPage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
