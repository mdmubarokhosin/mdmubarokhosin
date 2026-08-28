"use client";

import { useFirebase } from "@/context/FirebaseContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminPanel from "@/components/admin/AdminPanel";
import { FirebaseProvider } from "@/context/FirebaseContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

function AdminContent() {
  const { isAdmin } = useFirebase();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminPanel />;
}

export default function AdminPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FirebaseProvider>
          <AdminContent />
        </FirebaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
