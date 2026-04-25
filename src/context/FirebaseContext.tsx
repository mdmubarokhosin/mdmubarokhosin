"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ref, onValue, set, get, update, push, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import portfolioData from "@/data/portfolio.json";

// Type for the full portfolio data
type PortfolioData = typeof portfolioData;

interface FirebaseContextType {
  data: PortfolioData;
  loading: boolean;
  isAdmin: boolean;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  updateData: (path: string, value: unknown) => Promise<void>;
  pushData: (path: string, value: unknown) => Promise<string | null>;
  removeData: (path: string) => Promise<void>;
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  visitors: number;
  incrementVisitor: () => void;
}

export interface SiteSettings {
  aiChatbotEnabled: boolean;
  aiChatbotApiKey: string;
  aiChatbotBaseUrl: string;
  aiChatbotProvider: string;
  aiChatbotModel: string;
  aiChatbotSystemPrompt: string;
  soundEnabled: boolean;
  easterEggEnabled: boolean;
  liveChatEnabled: boolean;
  colorCustomizerEnabled: boolean;
  visitorCounterEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
  notificationBellEnabled: boolean;
  videoIntroEnabled: boolean;
  videoIntroUrl: string;
  primaryColor: string;
  accentColor: string;
  pwaEnabled: boolean;
  parallaxEnabled: boolean;
  mapEnabled: boolean;
  qrCodeEnabled: boolean;
  emailSubscriptionEnabled: boolean;
  adminPassword: string;
  siteName: string;
  siteDescription: string;
  telegramBotToken: string;
  telegramChatId: string;
}

const defaultSettings: SiteSettings = {
  aiChatbotEnabled: true,
  aiChatbotApiKey: "",
  aiChatbotBaseUrl: "https://openrouter.ai/api/v1",
  aiChatbotProvider: "openrouter",
  aiChatbotModel: "google/gemini-2.5-flash-preview-05-20",
  aiChatbotSystemPrompt: "You are a helpful assistant for MD MUBAROK HOSIN's portfolio website. Answer questions about his skills, projects, and services politely in Bengali or English.",
  soundEnabled: true,
  easterEggEnabled: true,
  liveChatEnabled: true,
  colorCustomizerEnabled: true,
  visitorCounterEnabled: true,
  keyboardShortcutsEnabled: true,
  notificationBellEnabled: true,
  videoIntroEnabled: false,
  videoIntroUrl: "",
  primaryColor: "#006a4e",
  accentColor: "#f42a41",
  pwaEnabled: true,
  parallaxEnabled: true,
  mapEnabled: true,
  qrCodeEnabled: true,
  emailSubscriptionEnabled: true,
  adminPassword: "i don't know",
  siteName: "MD MUBAROK HOSIN",
  siteDescription: "Professional Portfolio",
  telegramBotToken: "8750299211:AAFHRLlId39rhbP9b6vl5wHtQf5kSH5SnFs",
  telegramChatId: "1779607726",
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(portfolioData);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [visitors, setVisitors] = useState(0);

  // Listen to portfolio data from Firebase
  useEffect(() => {
    const dataRef = ref(db, "portfolio");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const firebaseData = snapshot.val();
        // Merge with local JSON defaults for any missing fields
        setData({ ...portfolioData, ...firebaseData });
      } else {
        // First time: push local JSON data to Firebase
        set(ref(db, "portfolio"), portfolioData).catch(console.error);
        setData(portfolioData);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firebase data read error, using local JSON:", error);
      setData(portfolioData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to settings from Firebase
  useEffect(() => {
    const settingsRef = ref(db, "settings");
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings({ ...defaultSettings, ...snapshot.val() });
      } else {
        // First time: push default settings
        set(ref(db, "settings"), defaultSettings).catch(console.error);
      }
    }, () => {
      setSettings(defaultSettings);
    });

    return () => unsubscribe();
  }, []);

  // Visitor counter
  useEffect(() => {
    if (!settings.visitorCounterEnabled) return;
    const visitorRef = ref(db, "stats/visitors");
    const unsubscribe = onValue(visitorRef, (snapshot) => {
      if (snapshot.exists()) {
        setVisitors(snapshot.val());
      }
    });

    // Increment visitor count on first visit per session
    const hasVisited = sessionStorage.getItem("portfolio-visited");
    if (!hasVisited) {
      sessionStorage.setItem("portfolio-visited", "true");
      get(visitorRef).then((snapshot) => {
        const current = snapshot.exists() ? snapshot.val() : 0;
        set(visitorRef, current + 1).catch(console.error);
      });
    }

    return () => unsubscribe();
  }, [settings.visitorCounterEnabled]);

  // Check admin session
  useEffect(() => {
    const adminSession = sessionStorage.getItem("portfolio-admin");
    if (adminSession === "true") {
      setIsAdmin(true);
    }
  }, []);

  const adminLogin = useCallback(async (password: string): Promise<boolean> => {
    // Check against Firebase settings password or default
    const adminRef = ref(db, "settings/adminPassword");
    try {
      const snapshot = await get(adminRef);
      const correctPassword = snapshot.exists() ? snapshot.val() : defaultSettings.adminPassword;
      if (password === correctPassword) {
        setIsAdmin(true);
        sessionStorage.setItem("portfolio-admin", "true");
        return true;
      }
    } catch {
      // Fallback to default
      if (password === defaultSettings.adminPassword) {
        setIsAdmin(true);
        sessionStorage.setItem("portfolio-admin", "true");
        return true;
      }
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem("portfolio-admin");
  }, []);

  const updateData = useCallback(async (path: string, value: unknown) => {
    try {
      const dataRef = ref(db, `portfolio/${path}`);
      await set(dataRef, value);
    } catch (error) {
      console.error("Firebase update error:", error);
      throw error;
    }
  }, []);

  const pushData = useCallback(async (path: string, value: unknown): Promise<string | null> => {
    try {
      const listRef = ref(db, `portfolio/${path}`);
      const newRef = push(listRef);
      await set(newRef, value);
      return newRef.key;
    } catch (error) {
      console.error("Firebase push error:", error);
      throw error;
    }
  }, []);

  const removeData = useCallback(async (path: string) => {
    try {
      const dataRef = ref(db, `portfolio/${path}`);
      await remove(dataRef);
    } catch (error) {
      console.error("Firebase remove error:", error);
      throw error;
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      const settingsRef = ref(db, "settings");
      await update(settingsRef, newSettings);
    } catch (error) {
      console.error("Firebase settings update error:", error);
      throw error;
    }
  }, []);

  const incrementVisitor = useCallback(() => {
    const visitorRef = ref(db, "stats/visitors");
    get(visitorRef).then((snapshot) => {
      const current = snapshot.exists() ? snapshot.val() : 0;
      set(visitorRef, current + 1).catch(console.error);
    });
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        data,
        loading,
        isAdmin,
        adminLogin,
        adminLogout,
        updateData,
        pushData,
        removeData,
        settings,
        updateSettings,
        visitors,
        incrementVisitor,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
