"use client";

import { motion } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
            <i className="bi bi-person-fill mr-1.5 text-[10px]" /> {t("about.aboutMe")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">{t("about.getToKnowMe")}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{t("about.aboutDesc")}</p>
          <div className="section-divider w-24 mx-auto mt-5 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto lg:mx-0">
              <img src={data.personal.profileImage} alt={data.personal.name} className="w-full aspect-[4/5] object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-28 h-28 border-2 border-primary/25 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-28 h-28 border-2 border-primary/15 rounded-2xl -z-10" />

            {/* Quick Info Below Image */}
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-md mx-auto lg:mx-0">
              {[
                { icon: "bi-person-fill", label: t("about.name"), value: data.personal.name },
                { icon: "bi-geo-alt-fill", label: t("about.location"), value: data.personal.location },
                { icon: "bi-envelope-fill", label: t("about.email"), value: data.personal.email },
                { icon: "bi-translate", label: t("about.language"), value: data.personal.languages.join(", ") },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-2.5 bg-card border border-border rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 text-sm">
                    <i className={`bi ${info.icon}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{info.label}</p>
                    <p className="text-xs font-semibold truncate">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
              {t("about.dedicatedDev")} <span className="text-primary">{isBn ? "বাংলাদেশ থেকে" : "from " + data.personal.locationEn}</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
              {(isBn ? data.personal.bio.fullBn : data.personal.bio.full).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Services I Offer */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <i className="bi bi-tools text-primary" /> {t("about.whatIDo")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.services.map((service, i) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="group card-glow bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${service.color}15`, color: service.color }}
                    >
                      <i className={`bi ${service.icon}`} />
                    </div>
                    <h4 className="font-bold text-sm mb-1.5 group-hover:text-primary transition-colors">{isBn ? service.titleBn : service.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{isBn ? service.descriptionBn : service.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <i className="bi bi-chat-quote text-primary" /> {t("about.whatPeopleSay")}
              </h3>
              <div className="space-y-4">
                {data.testimonials.map((tItem, i) => (
                  <motion.div
                    key={tItem.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all"
                  >
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <i key={j} className="bi bi-star-fill text-amber-400 text-xs" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed italic mb-4">&ldquo;{isBn ? tItem.textBn : tItem.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">{tItem.avatar}</div>
                      <div>
                        <p className="font-semibold text-xs">{tItem.name}</p>
                        <p className="text-[10px] text-muted-foreground">{isBn ? tItem.roleBn : tItem.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-2 px-6 py-3 mt-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <i className="bi bi-chat-left-text" /> {t("about.contactMe")}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
