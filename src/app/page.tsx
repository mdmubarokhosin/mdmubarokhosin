"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useFirebase } from "@/context/FirebaseContext";

import HomePage from "@/components/pages/HomePage";
import AboutPage from "@/components/pages/AboutPage";
import SkillsPage from "@/components/pages/SkillsPage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import ExperiencePage from "@/components/pages/ExperiencePage";
import ContactPage from "@/components/pages/ContactPage";

import ScrollProgressBar from "@/components/ScrollProgressBar";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import { AIChatbotWidget } from "@/components/features";

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/* ─── Page Renderer ─── */
function PageContent({ page, onNavigate }: { page: string; onNavigate: (p: string) => void }) {
  switch (page) {
    case "home": return <HomePage onNavigate={onNavigate} />;
    case "about": return <AboutPage onNavigate={onNavigate} />;
    case "skills": return <SkillsPage />;
    case "projects": return <ProjectsPage />;
    case "experience": return <ExperiencePage />;
    case "contact": return <ContactPage />;
    default: return <HomePage onNavigate={onNavigate} />;
  }
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function Home() {
  const { t, lang, toggleLanguage, isBn } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { data, settings } = useFirebase();

  // Sync with URL hash on initial load
  const [initialPage] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (hash && data.pages.some((p) => p.id === hash)) return hash;
    }
    return "home";
  });
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // After preloader finishes
  useEffect(() => {
    const timer = setTimeout(() => setPreloaderDone(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Scroll listener for navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.location.hash = page;
  };

  const getPageLabel = (page: { id: string; label: string; labelBn: string }) => {
    return isBn ? page.labelBn : page.label;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Preloader */}
      <Preloader />

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: preloaderDone ? 0 : 2.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl shadow-lg border-b border-border"
            : "bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => navigateTo("home")}
              className="flex items-center gap-2.5 group"
            >
              <div className="min-w-10 h-10 px-2 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform shadow-lg shadow-primary/20 whitespace-nowrap">
                <span className={(data.personal.initials || "").length > 2 ? "text-xs" : (data.personal.initials || "").length > 1 ? "text-base" : "text-lg"}>{data.personal.initials}</span>
              </div>
              <span className="font-extrabold text-lg hidden sm:inline tracking-tight">
                {data.personal.firstName}<span className="text-primary">.</span>
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {data.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => navigateTo(page.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <i className={`bi ${page.icon}`} /> {getPageLabel(page)}
                </button>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="ml-1 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                title={t("theme.toggleTheme")}
              >
                <i className={`bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"} text-lg text-amber-500`} />
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              >
                <i className="bi bi-translate text-primary" />
                <span className="text-xs">{lang === "en" ? "বাংলা" : "EN"}</span>
              </button>
            </div>

            {/* Mobile toggle + theme + lang */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                title={t("theme.toggleTheme")}
              >
                <i className={`bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"} text-base text-amber-500`} />
              </button>
              <button
                onClick={toggleLanguage}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              >
                <i className="bi bi-translate text-base text-primary" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                <i className={`bi ${mobileMenuOpen ? "bi-x-lg" : "bi-list"} text-2xl`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {data.pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => navigateTo(page.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                      currentPage === page.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <i className={`bi ${page.icon} text-lg`} /> {getPageLabel(page)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══ PAGE CONTENT ═══ */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <PageContent page={currentPage} onNavigate={navigateTo} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative overflow-hidden bg-gradient-to-b from-card via-card to-primary/5 border-t border-border">
        {/* Decorative top wave line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Decorative background circles */}
        <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Top CTA / Brand Banner ─── */}
          <div className="py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/50">
            <div className="flex items-center gap-3.5">
              <div className="min-w-12 h-12 px-2.5 rounded-2xl bg-gradient-to-br from-primary to-bd-green-light text-primary-foreground flex items-center justify-center font-extrabold shadow-lg shadow-primary/20 whitespace-nowrap">
                <span className={(data.personal.initials || "").length > 2 ? "text-sm" : (data.personal.initials || "").length > 1 ? "text-lg" : "text-xl"}>{data.personal.initials}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-lg md:text-xl">
                  {data.personal.name}
                </h3>
                <p className="text-sm text-muted-foreground">{isBn ? data.personal.titleBn : data.personal.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {data.socialLinks.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5"
                  aria-label={s.name}>
                  <i className={`bi ${s.icon} text-base`} />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Main Footer Grid ─── */}
          <div className="py-8 md:py-10 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
            {/* About / Brand - spans 4 cols */}
            <div className="col-span-2 md:col-span-4">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <i className="bi bi-info-circle text-primary text-xs" />
                </span>
                {isBn ? "সম্পর্কে" : "About"}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {isBn ? data.personal.bio.shortBn : data.personal.bio.short}
              </p>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-primary">
                  {isBn ? "বর্তমানে কাজের জন্য উপলব্ধ" : "Currently Available for Work"}
                </span>
              </div>
            </div>

            {/* Quick Links - spans 2 cols */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <i className="bi bi-compass text-primary text-xs" />
                </span>
                {t("footer.pages")}
              </h4>
              <ul className="space-y-2.5">
                {data.pages.map((page) => (
                  <li key={page.id}>
                    <button
                      onClick={() => navigateTo(page.id)}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <i className={`bi ${page.icon} text-xs opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all`} />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{getPageLabel(page)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services - spans 3 cols */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <i className="bi bi-lightning text-primary text-xs" />
                </span>
                {t("footer.services")}
              </h4>
              <ul className="space-y-2.5">
                {data.services.map((s) => (
                  <li key={s.title} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0">
                      <i className={`bi ${s.icon} text-xs text-primary/70`} />
                    </span>
                    <span>{isBn ? s.titleBn : s.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact - spans 3 cols */}
            <div className="col-span-2 md:col-span-3">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <i className="bi bi-chat-dots text-primary text-xs" />
                </span>
                {t("footer.contact")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${data.personal.email}`} className="group flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/15 group-hover:border-primary/20 transition-colors">
                      <i className="bi bi-envelope text-xs text-primary/70 group-hover:text-primary transition-colors" />
                    </span>
                    <span className="break-all group-hover:underline underline-offset-2">{data.personal.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="bi bi-geo-alt text-xs text-primary/70" />
                  </span>
                  <span>{data.personal.location}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="bi bi-clock text-xs text-primary/70" />
                  </span>
                  <span>{isBn ? t("footer.workingHours") : "Sat-Thu, 10AM-7PM"}</span>
                </li>
                {data.personal.phone && (
                  <li>
                    <a href={`tel:${data.personal.phone}`} className="group flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/15 group-hover:border-primary/20 transition-colors">
                        <i className="bi bi-telephone text-xs text-primary/70 group-hover:text-primary transition-colors" />
                      </span>
                      <span className="group-hover:underline underline-offset-2">{data.personal.phone}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="py-5 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              &copy; {new Date().getFullYear()} {data.personal.name}. {t("footer.allRightsReserved")}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                {t("footer.craftedin")}
                <i className="bi bi-heart-fill text-accent text-[10px] animate-pulse" />
                {t("footer.in")}
                <span className="font-semibold text-primary">{isBn ? "বাংলাদেশ" : "Bangladesh"}</span>
              </p>
              <span className="hidden sm:inline text-border">|</span>
              <button onClick={() => navigateTo("home")} className="hidden sm:inline-flex items-center gap-1 hover:text-primary transition-colors">
                <i className="bi bi-arrow-up-circle text-sm" /> {isBn ? "শীর্ষে যান" : "Back to Top"}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />

      {/* AI Chatbot Widget */}
      {settings.aiChatbotEnabled && <AIChatbotWidget />}
    </div>
  );
}
