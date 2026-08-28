"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useFirebase } from "@/context/FirebaseContext";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedCounter from "@/components/AnimatedCounter";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { data } = useFirebase();
  const { t, isBn } = useLanguage();
  const [typedText, setTypedText] = useState("");
  const fullText = isBn ? data.personal.titleBn : data.personal.title;

  useEffect(() => {
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [fullText]);

  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 3);

  const processSteps = [
    { step: "01", icon: "bi-chat-left-quote", title: t("home.discovery"), desc: t("home.discoveryDesc"), color: "#006a4e" },
    { step: "02", icon: "bi-vector-pen", title: t("home.design"), desc: t("home.designDesc"), color: "#00875a" },
    { step: "03", icon: "bi-code-slash", title: t("home.development"), desc: t("home.developmentDesc"), color: "#f42a41" },
    { step: "04", icon: "bi-rocket-takeoff", title: t("home.launch"), desc: t("home.launchDesc"), color: "#3776ab" },
  ];

  // FAQ toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-0 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {isBn ? data.personal.availabilityBn : data.personal.availability}
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-5">
                {t("hero.greeting")} <br className="hidden sm:block" />
                <span className="gradient-text">{data.personal.name}</span>
              </h1>

              <div className="h-8 md:h-10 mb-6">
                <p className="text-sm md:text-base text-muted-foreground font-mono">
                  {typedText}<span className="inline-block w-0.5 h-5 md:h-6 bg-primary ml-1 animate-pulse" />
                </p>
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                {isBn ? data.personal.bio.shortBn : data.personal.bio.short}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => onNavigate("projects")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
                >
                  <i className="bi bi-folder2-open" /> {t("hero.viewWork")}
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-0.5"
                >
                  <i className="bi bi-chat-dots" /> {t("hero.letsTalk")}
                </button>
                <a
                  href={data.personal.resumeUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all hover:-translate-y-0.5"
                >
                  <i className="bi bi-download" /> {t("hero.downloadResume")}
                </a>
              </div>

              <div className="flex gap-2.5 justify-center lg:justify-start">
                {data.socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all hover:-translate-y-1"
                    aria-label={s.name}
                  >
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/15 animate-spin-slow" />
                <div className="absolute -inset-8 rounded-full border border-dashed border-primary/8" style={{ animationDirection: "reverse", animationDuration: "30s", animation: "spin-slow 30s linear infinite reverse" }} />
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-110" />
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[360px] xl:h-[360px] rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/20 animate-float">
                  <img src={data.personal.profileImage} alt={data.personal.name} className="w-full h-full object-cover object-top" />
                </div>
                {data.stats.slice(0, 2).map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    animate={{ y: [0, i === 0 ? -8 : 8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    className={`absolute bg-card border border-border rounded-xl px-3 py-2 shadow-lg ${i === 0 ? "-right-2 top-6" : "-left-2 bottom-10"}`}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <i className={`bi ${stat.icon} text-primary`} />
                      <span>{stat.value}{stat.suffix} {isBn ? stat.labelBn : stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button onClick={() => document.getElementById("home-stats")?.scrollIntoView({ behavior: "smooth" })} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-[10px] font-medium uppercase tracking-widest">{t("hero.scroll")}</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <i className="bi bi-chevron-double-down text-lg" />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* ═══ STATS BAR with Animated Counters ═══ */}
      <section id="home-stats" className="bg-primary text-primary-foreground py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {data.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <i className={`bi ${stat.icon} text-2xl md:text-3xl opacity-80 mb-2 block`} />
                <p className="text-2xl md:text-3xl font-extrabold">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs md:text-sm opacity-80 font-medium">{isBn ? stat.labelBn : stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-tools mr-1.5 text-[10px]" /> {t("home.whatIDo")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t("home.myServices")}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("home.servicesDesc")}</p>
            <div className="section-divider w-20 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {data.services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group card-glow bg-card border border-border rounded-2xl p-6 md:p-7 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${service.color}15`, color: service.color }}
                >
                  <i className={`bi ${service.icon}`} />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-2 group-hover:text-primary transition-colors">{isBn ? service.titleBn : service.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{isBn ? service.descriptionBn : service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-star-fill mr-1.5 text-[10px]" /> {t("home.featuredWork")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t("home.recentProjects")}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("home.projectsDesc")}</p>
            <div className="section-divider w-20 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group card-glow bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                {/* Color bar */}
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}66)` }} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: project.color }}
                    >
                      <i className={`bi ${project.icon}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{isBn ? project.titleBn : project.title}</h3>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                        <i className="bi bi-star-fill text-[7px]" /> {t("home.featured")}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">{isBn ? project.descriptionBn : project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-primary/8 text-primary border border-primary/15">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-border/60">
                    <a href={project.liveUrl} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                      <i className="bi bi-box-arrow-up-right" /> {t("home.demo")}
                    </a>
                    <a href={project.codeUrl} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-muted">
                      <i className="bi bi-github" /> {t("home.code")}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-0.5"
            >
              <i className="bi bi-arrow-right" /> {t("home.viewAllProjects")}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ PROCESS / HOW I WORK ═══ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-diagram-3 mr-1.5 text-[10px]" /> {t("home.myProcess")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t("home.howIWork")}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("home.howIWorkDesc")}</p>
            <div className="section-divider w-20 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative bg-card border border-border rounded-2xl p-6 md:p-7 text-center hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <span className="absolute top-4 right-4 text-4xl font-extrabold text-muted/30 group-hover:text-primary/10 transition-colors">{item.step}</span>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <i className={`bi ${item.icon}`} />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK MARQUEE ═══ */}
      <section className="py-12 md:py-16 bg-muted/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
            <i className="bi bi-code mr-1.5 text-[10px]" /> Tech Stack
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold">
            <span className="gradient-text">{isBn ? "আমার প্রিয় প্রযুক্তি" : "Technologies I Love"}</span>
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent z-10" />
          <div className="flex gap-4 animate-marquee">
            {[...data.skills, ...data.additionalTools].map((skill, i) => (
              <div
                key={`${skill.name}-${i}`}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <i className={`bi ${skill.icon} text-primary/70`} />
                <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
              </div>
            ))}
            {[...data.skills, ...data.additionalTools].map((skill, i) => (
              <div
                key={`dup-${skill.name}-${i}`}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <i className={`bi ${skill.icon} text-primary/70`} />
                <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATES / ACHIEVEMENTS ═══ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-patch-check mr-1.5 text-[10px]" /> {t("certificates.certificates")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t("certificates.certifications")}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("certificates.certDesc")}</p>
            <div className="section-divider w-20 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.certificates.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cert.color}15`, color: cert.color }}
                  >
                    <i className={`bi ${cert.icon}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{isBn ? cert.titleBn : cert.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      <i className="bi bi-building mr-1" /> {isBn ? cert.issuerBn : cert.issuer}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        <i className="bi bi-calendar3 mr-1" /> {cert.date}
                      </span>
                      <a href={cert.url} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1">
                        <i className="bi bi-box-arrow-up-right text-[9px]" /> {t("certificates.viewCertificate")}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS CAROUSEL ═══ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-chat-quote mr-1.5 text-[10px]" /> {t("home.testimonials")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t("home.clientReviews")}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("home.clientReviewsDesc")}</p>
            <div className="section-divider w-20 mx-auto mt-4 rounded-full" />
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-question-circle mr-1.5 text-[10px]" /> {t("faq.faq")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t("faq.frequentlyAsked")}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("faq.faqDesc")}</p>
            <div className="section-divider w-20 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="space-y-3">
            {data.faq.map((item, i) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-sm">{isBn ? item.questionBn : item.question}</span>
                  <motion.i
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="bi bi-chevron-down text-primary flex-shrink-0"
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                        {isBn ? item.answerBn : item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE ME ═══ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <i className="bi bi-patch-check mr-1.5 text-[10px]" /> {isBn ? "কেন আমাকে বেছে নেবেন" : "Why Choose Me"}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{isBn ? "আমার পার্থক্য" : "What Sets Me Apart"}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "bi-lightning-charge-fill", title: isBn ? "দ্রুত ডেলিভারি" : "Fast Delivery", desc: isBn ? "সময়মতো ডেলিভারি নিশ্চিত করি কোয়ালিটি কম্প্রোমাইজ না করে।" : "I ensure on-time delivery without compromising on quality or performance.", color: "#006a4e" },
              { icon: "bi-shield-check", title: isBn ? "ক্লিন কোড" : "Clean Code", desc: isBn ? "রক্ষণাবেক্ষণযোগ্য, স্কেলযোগ্য এবং শিল্পের সর্বোত্তম অনুশীলন অনুসরণকারী কোড।" : "Maintainable, scalable code following industry best practices and standards.", color: "#f42a41" },
              { icon: "bi-headset", title: isBn ? "২৪/৭ সাপোর্ট" : "24/7 Support", desc: isBn ? "প্রজেক্ট ডেলিভারির পরেও চলমান সহায়তা এবং যোগাযোগ।" : "Ongoing support and communication even after project delivery.", color: "#00875a" },
              { icon: "bi-phone", title: isBn ? "রেসপন্সিভ ডিজাইন" : "Responsive Design", desc: isBn ? "সব ডিভাইসে নিখুঁতভাবে কাজ করে এমন ওয়েবসাইট।" : "Websites that work flawlessly on all devices and screen sizes.", color: "#3776ab" },
              { icon: "bi-graph-up-arrow", title: isBn ? "এসইও অপটিমাইজড" : "SEO Optimized", desc: isBn ? "সার্চ ইঞ্জিনে উচ্চ র‍্যাঙ্কিংয়ের জন্য অপটিমাইজড কোড।" : "Code optimized for high search engine rankings and visibility.", color: "#a259ff" },
              { icon: "bi-lock-fill", title: isBn ? "সুরক্ষিত" : "Secure", desc: isBn ? "আধুনিক নিরাপত্তা অনুশীলন এবং ডেটা সুরক্ষা।" : "Modern security practices and data protection built into every project.", color: "#06b6d4" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <i className={`bi ${item.icon}`} />
                </div>
                <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-primary rounded-3xl p-8 md:p-14 text-center text-primary-foreground overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <i className="bi bi-rocket-takeoff text-4xl md:text-5xl mb-4 block opacity-80" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4">{t("home.readyToStart")}</h2>
              <p className="text-sm md:text-base opacity-80 max-w-xl mx-auto mb-8 leading-relaxed">
                {t("home.ctaDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition-all shadow-lg hover:-translate-y-0.5"
                >
                  <i className="bi bi-envelope-fill" /> {t("home.getInTouch")}
                </button>
                <a
                  href={`mailto:${data.personal.email}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  <i className="bi bi-send" /> {t("home.emailMeDirectly")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
