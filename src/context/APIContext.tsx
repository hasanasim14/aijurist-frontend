"use client";

import { createContext, useState, useContext } from "react";
import type React from "react";

type ApiContextType = {
  shouldCallApi: boolean;
  setShouldCallApi: (shouldCall: boolean) => void;
  resetApiFlag: () => void;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

type ApiProviderProps = {
  children: React.ReactNode;
};

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [shouldCallApi, setShouldCallApi] = useState<boolean>(false);

  const resetApiFlag = () => {
    setShouldCallApi(false);
  };

  return (
    <ApiContext.Provider
      value={{
        shouldCallApi,
        setShouldCallApi,
        resetApiFlag,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
