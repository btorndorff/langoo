"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "Japanese" | "Vietnamese";

const UserSettingsContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  username: string;
}>({
  language: "Japanese",
  setLanguage: () => {},
  username: "Ben",
});

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("Japanese");
  const username = "Ben";

  return (
    <UserSettingsContext.Provider
      value={{
        language,
        setLanguage,
        username,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  return useContext(UserSettingsContext);
}
