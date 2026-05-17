"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { data, loading } = useFirebase();
  const { t, isBn } = useLanguage();
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="bi bi-arrow-repeat animate-spin text-3xl text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setFormStatus("sending");
    setErrorMsg("");

    const formData = new FormData(formRef.current);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      budget: formData.get("budget") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus("sent");
        formRef.current.reset();
        setTimeout(() => setFormStatus("idle"), 4000);
      } else {
        setFormStatus("error");
        setErrorMsg(result.error || "Something went wrong. Please try again.");
        setTimeout(() => {
          setFormStatus("idle");
          setErrorMsg("");
        }, 5000);
      }
    } catch {
      setFormStatus("error");
      setErrorMsg(t("contact.networkError"));
      setTimeout(() => {
        setFormStatus("idle");
        setErrorMsg("");
      }, 5000);
    }
  };

  const getContactTitle = (item: { title: string; titleBn: string }) => isBn ? item.titleBn : item.title;
  const getContactValue = (item: { value: string; valueEn?: string }) => {
    if (isBn) return item.value;
    return item.valueEn || item.value;
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
            <i className="bi bi-envelope-fill mr-1.5 text-[10px]" /> {t("contact.contact")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t("contact.getInTouch")}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{t("contact.contactDesc")}</p>
          <div className="section-divider w-24 mx-auto mt-5 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {data.contactInfo.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl flex-shrink-0">
                  <i className={`bi ${item.icon}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{getContactTitle(item)}</h4>
                  {item.link ? (
                    <a href={item.link} className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">{item.value}</a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{getContactValue(item)}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Telegram direct contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <i className="bi bi-telegram text-2xl text-blue-500" />
                <h4 className="font-semibold text-sm">{t("contact.quickTelegram")}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t("contact.telegramDesc")}</p>
              <a
                href="https://t.me/mdmubarok"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
              >
                <i className="bi bi-telegram" /> {t("contact.messageOnTelegram")}
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="pt-2"
            >
              <p className="text-sm font-semibold mb-3">
                <i className="bi bi-people-fill mr-1.5 text-primary" /> {t("contact.followMe")}
              </p>
              <div className="flex gap-2.5">
                {data.socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-1"
                    aria-label={s.name}
                  >
                    <i className={`bi ${s.icon} text-lg`} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form ref={formRef} onSubmit={handleFormSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <i className="bi bi-send text-primary" /> {t("contact.sendMeAMessage")}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                <i className="bi bi-info-circle mr-1" /> {t("contact.formInfo")}
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    <i className="bi bi-person mr-1.5 text-primary/60" /> {t("contact.yourName")}
                  </label>
                  <input type="text" id="name" name="name" required placeholder={t("contact.namePlaceholder")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    <i className="bi bi-envelope mr-1.5 text-primary/60" /> {t("contact.yourEmail")}
                  </label>
                  <input type="email" id="email" name="email" required placeholder={t("contact.emailPlaceholder")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  <i className="bi bi-chat-left-text mr-1.5 text-primary/60" /> {t("contact.subject")}
                </label>
                <input type="text" id="subject" name="subject" required placeholder={t("contact.subjectPlaceholder")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50" />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-2">
                  <i className="bi bi-currency-dollar mr-1.5 text-primary/60" /> {t("contact.budgetRange")}
                </label>
                <select id="budget" name="budget" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-muted-foreground">
                  <option value="">{t("contact.selectBudget")}</option>
                  <option value="Under $500">{t("contact.under500")}</option>
                  <option value="$500 - $2,000">{t("contact.500to2000")}</option>
                  <option value="$2,000 - $5,000">{t("contact.2000to5000")}</option>
                  <option value="$5,000+">{t("contact.above5000")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  <i className="bi bi-pencil-square mr-1.5 text-primary/60" /> {t("contact.message")}
                </label>
                <textarea id="message" name="message" required rows={5} placeholder={t("contact.messagePlaceholder")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50" />
              </div>

              {/* Status messages */}
              {formStatus === "sent" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  <i className="bi bi-check-circle-fill" /> {t("contact.success")}
                </motion.div>
              )}
              {formStatus === "error" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <i className="bi bi-exclamation-triangle-fill" /> {errorMsg}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
              >
                {formStatus === "sending" ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><i className="bi bi-arrow-repeat" /></motion.div> {t("contact.sending")}</>
                ) : (
                  <><i className="bi bi-send-fill" /> {t("contact.sendMessage")}</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
