"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";

export default function AdminLogin() {
  const { adminLogin } = useFirebase();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    const success = await adminLogin(password);
    if (!success) {
      setError("Invalid password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <ParticleBg />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl relative"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 shadow-lg shadow-primary/20">
            <i className="bi bi-shield-lock-fill" />
          </div>
          <h1 className="text-2xl font-extrabold mb-1">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Enter password to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <i className="bi bi-key mr-1.5 text-primary/60" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              autoFocus
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <i className="bi bi-exclamation-triangle-fill" /> {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <><i className="bi bi-arrow-repeat animate-spin" /> Authenticating...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right" /> Login</>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          <i className="bi bi-info-circle mr-1" /> Default password: I Don't Know!
        </p>
      </motion.div>
    </div>
  );
}

function ParticleBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
}
