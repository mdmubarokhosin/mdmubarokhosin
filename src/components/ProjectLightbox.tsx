"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  liveUrl: string;
  codeUrl: string;
  isBn: boolean;
  t: (key: string) => string;
}

export default function ProjectLightbox({
  isOpen,
  onClose,
  title,
  description,
  icon,
  color,
  tags,
  liveUrl,
  codeUrl,
  isBn,
  t,
}: LightboxProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-card border border-border rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <i className="bi bi-x-lg text-sm" />
            </button>

            {/* Project visual */}
            <div
              className="w-full h-48 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${color}15, ${color}08, ${color}20)`,
              }}
            >
              <i className={`bi ${icon} text-6xl`} style={{ color, opacity: 0.6 }} />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 40%, ${color} 0%, transparent 60%), radial-gradient(circle at 70% 60%, ${color} 0%, transparent 50%)`,
                }}
              />
            </div>

            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <a
                href={liveUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <i className="bi bi-box-arrow-up-right" /> {t("projects.liveDemo")}
              </a>
              <a
                href={codeUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors"
              >
                <i className="bi bi-github" /> {t("projects.sourceCode")}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
