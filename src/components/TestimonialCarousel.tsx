"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import portfolioData from "@/data/portfolio.json";

export default function TestimonialCarousel() {
  const data = portfolioData;
  const { isBn } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = data.testimonials.length;

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  const tItem = data.testimonials[current];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-10 min-h-[220px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full text-center"
          >
            <div className="flex justify-center gap-0.5 mb-4">
              {[...Array(5)].map((_, j) => (
                <i key={j} className="bi bi-star-fill text-amber-400" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed italic mb-6 max-w-lg mx-auto">
              &ldquo;{isBn ? tItem.textBn : tItem.text}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {tItem.avatar}
              </div>
              <div className="text-left">
                <p className="font-semibold">{tItem.name}</p>
                <p className="text-xs text-muted-foreground">{isBn ? tItem.roleBn : tItem.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          aria-label="Previous testimonial"
        >
          <i className="bi bi-chevron-left" />
        </button>

        <div className="flex gap-2">
          {data.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          aria-label="Next testimonial"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}
