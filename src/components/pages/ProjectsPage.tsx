"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { useFirebase } from "@/context/FirebaseContext";
import { useLanguage } from "@/context/LanguageContext";
import ProjectLightbox from "@/components/ProjectLightbox";

type Project = (typeof portfolioData.projects)[number];

function ProjectCard({ project, index, isBn, t, onOpen }: { project: Project; index: number; isBn: boolean; t: (key: string) => string; onOpen: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group card-glow bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}66)` }} />
      <div className="p-6 md:p-7">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ backgroundColor: project.color }}
          >
            <i className={`bi ${project.icon}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{isBn ? project.titleBn : project.title}</h3>
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full mt-1">
                <i className="bi bi-star-fill text-[8px]" /> {t("projects.featured")}
              </span>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 break-words whitespace-pre-wrap">{isBn ? project.descriptionBn : project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-primary/8 text-primary border border-primary/15">{tag}</span>
          ))}
        </div>
        <div className="flex gap-3 pt-4 border-t border-border/60">
          <a href={project.liveUrl} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <i className="bi bi-box-arrow-up-right" /> {t("projects.liveDemo")}
          </a>
          <a href={project.codeUrl} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-muted transition-colors">
            <i className="bi bi-github" /> {t("projects.sourceCode")}
          </a>
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all ml-auto"
          >
            <i className="bi bi-eye" /> {t("projects.viewDetails")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { data, loading } = useFirebase();
  const { t, isBn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="bi bi-arrow-repeat animate-spin text-3xl text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = activeCategory === "all"
    ? data.projects
    : data.projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
            <i className="bi bi-folder-fill mr-1.5 text-[10px]" /> {t("projects.myProjects")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t("projects.portfolioShowcase")}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{t("projects.projectsDesc")}</p>
          <div className="section-divider w-24 mx-auto mt-5 rounded-full" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {data.projectCategories.map((cat) => (
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

        {/* Projects Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                isBn={isBn}
                t={t}
                onOpen={() => setLightboxProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-muted-foreground text-sm mb-4">{t("projects.interestedInWorking")}</p>
          <a
            href="mailto:contact.mdmubarok@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <i className="bi bi-envelope" /> {t("projects.discussProject")}
          </a>
        </motion.div>
      </div>

      {/* Project Lightbox */}
      <ProjectLightbox
        isOpen={!!lightboxProject}
        onClose={() => setLightboxProject(null)}
        title={lightboxProject ? (isBn ? lightboxProject.titleBn : lightboxProject.title) : ""}
        description={lightboxProject ? (isBn ? lightboxProject.descriptionBn : lightboxProject.description) : ""}
        icon={lightboxProject?.icon || ""}
        color={lightboxProject?.color || "#006a4e"}
        tags={lightboxProject?.tags || []}
        liveUrl={lightboxProject?.liveUrl || "#"}
        codeUrl={lightboxProject?.codeUrl || "#"}
        isBn={isBn}
        t={t}
      />
    </div>
  );
}
