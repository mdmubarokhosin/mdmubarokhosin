"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { useFirebase } from "@/context/FirebaseContext";
import { useLanguage } from "@/context/LanguageContext";

function TimelineItem({ exp, index, total, isBn, t }: { exp: (typeof portfolioData.experiences)[number]; index: number; total: number; isBn: boolean; t: (key: string) => string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const isLast = index === total - 1;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative flex gap-5 md:gap-8"
    >
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg md:text-xl z-10 shadow-lg shadow-primary/20 flex-shrink-0">
          <i className={`bi ${exp.icon}`} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2 min-h-[40px]" />}
      </div>

      {/* Content */}
      <div className={`bg-card border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex-1 ${isLast ? "mb-0" : "mb-6 md:mb-8"}`}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">{isBn ? exp.periodBn : exp.period}</span>
          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
            exp.type === "full-time" ? "bg-green-50 text-green-600" : exp.type === "internship" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
          }`}>
            {exp.type === "full-time" ? t("experience.fullTime") : t("experience.internship")}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-1">{isBn ? exp.titleBn : exp.title}</h3>
        <p className="text-primary font-medium text-sm mb-3 flex items-center gap-1.5">
          <i className="bi bi-building text-xs" /> {exp.company}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">{isBn ? exp.descriptionBn : exp.description}</p>
      </div>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const { data, loading } = useFirebase();
  const { t, isBn } = useLanguage();

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
            <i className="bi bi-briefcase-fill mr-1.5 text-[10px]" /> {t("experience.experience")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t("experience.myJourney")}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{t("experience.experienceDesc")}</p>
          <div className="section-divider w-24 mx-auto mt-5 rounded-full" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Work Experience */}
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <i className="bi bi-briefcase text-primary" /> {t("experience.workExperience")}
            </h2>
            {data.experiences.map((exp, i) => (
              <TimelineItem key={exp.title} exp={exp} index={i} total={data.experiences.length} isBn={isBn} t={t} />
            ))}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <i className="bi bi-mortarboard text-primary" /> {t("experience.education")}
            </h2>
            {data.education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="relative flex gap-5 md:gap-8"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-lg md:text-xl z-10 shadow-lg">
                    <i className={`bi ${edu.icon}`} />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 transition-all flex-1">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent mb-3">{isBn ? edu.periodBn : edu.period}</span>
                  <h3 className="text-lg font-bold mb-1">{isBn ? edu.degreeBn : edu.degree}</h3>
                  <p className="text-primary font-medium text-sm flex items-center gap-1.5">
                    <i className="bi bi-building text-xs" /> {isBn ? edu.institutionBn : edu.institution}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
