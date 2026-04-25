"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { useFirebase } from "@/context/FirebaseContext";
import { useLanguage } from "@/context/LanguageContext";

type Skill = (typeof portfolioData.skills)[number];
type Tool = (typeof portfolioData.additionalTools)[number];

function SkillBar({ skill, index, isBn }: { skill: Skill; index: number; isBn: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${skill.color}18`, color: skill.color }}
          >
            <i className={`bi ${skill.icon}`} />
          </span>
          <span className="font-semibold text-sm">{skill.name}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{skill.level}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: index * 0.06 + 0.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
        />
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const { data, loading } = useFirebase();
  const { t, isBn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

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

  const filteredSkills = activeCategory === "all"
    ? data.skills
    : data.skills.filter((s) => s.category === activeCategory);

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
            <i className="bi bi-code-slash mr-1.5 text-[10px]" /> {t("skills.mySkills")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t("skills.skillsTitle")}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{t("skills.skillsDesc")}</p>
          <div className="section-divider w-24 mx-auto mt-5 rounded-full" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {data.skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              <i className={`bi ${cat.icon}`} /> {isBn ? cat.labelBn : cat.label}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} isBn={isBn} />
          ))}
        </div>

        {/* Additional Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground mb-5 text-sm font-medium">
            <i className="bi bi-tools mr-1.5" /> {t("skills.alsoExperiencedWith")}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {data.additionalTools.map((tool: Tool) => (
              <span
                key={tool.name}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all cursor-default"
              >
                <i className={`bi ${tool.icon} text-primary/70`} /> {tool.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Skill Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 grid sm:grid-cols-3 gap-5"
        >
          {[
            { icon: "bi-display", title: isBn ? "ফ্রন্টএন্ড" : "Frontend", count: data.skills.filter(s => s.category === "frontend").length, color: "#006a4e", desc: t("skills.frontendDesc") },
            { icon: "bi-hdd-network", title: isBn ? "ব্যাকএন্ড" : "Backend", count: data.skills.filter(s => s.category === "backend").length, color: "#f42a41", desc: t("skills.backendDesc") },
            { icon: "bi-tools", title: isBn ? "টুলস" : "Tools", count: data.skills.filter(s => s.category === "tools").length, color: "#00875a", desc: t("skills.toolsDesc") },
          ].map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                <i className={`bi ${cat.icon}`} />
              </div>
              <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
              <p className="text-3xl font-extrabold text-primary mb-2">{cat.count}+</p>
              <p className="text-muted-foreground text-xs">{cat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
