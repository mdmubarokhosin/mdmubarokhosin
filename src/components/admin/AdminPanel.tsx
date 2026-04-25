"use client";

import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import type { SiteSettings } from "@/context/FirebaseContext";

type Section = "dashboard" | "personal" | "projects" | "skills" | "services" | "experiences" | "education" | "testimonials" | "certificates" | "faq" | "social" | "contact" | "settings";

const sections: { id: Section; icon: string; label: string }[] = [
  { id: "dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { id: "personal", icon: "bi-person-fill", label: "Personal" },
  { id: "projects", icon: "bi-folder-fill", label: "Projects" },
  { id: "skills", icon: "bi-code-slash", label: "Skills" },
  { id: "services", icon: "bi-tools", label: "Services" },
  { id: "experiences", icon: "bi-briefcase-fill", label: "Experience" },
  { id: "education", icon: "bi-mortarboard-fill", label: "Education" },
  { id: "testimonials", icon: "bi-chat-quote-fill", label: "Testimonials" },
  { id: "certificates", icon: "bi-patch-check-fill", label: "Certificates" },
  { id: "faq", icon: "bi-question-circle-fill", label: "FAQ" },
  { id: "social", icon: "bi-share-fill", label: "Social Links" },
  { id: "contact", icon: "bi-envelope-fill", label: "Contact Info" },
  { id: "settings", icon: "bi-gear-fill", label: "Settings" },
];

/* ─── Reusable UI Components ─── */
function InputField({ label, icon, value, onChange, type = "text", placeholder = "", required = false }: { label: string; icon?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
        {icon && <i className={`bi ${icon} mr-1 text-primary/60`} />} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
      />
    </div>
  );
}

function BilingualInput({ labelEn, labelBn, valueEn, valueBn, onChangeEn, onChangeBn, icon, required = false }: { labelEn: string; labelBn: string; valueEn: string; valueBn: string; onChangeEn: (v: string) => void; onChangeBn: (v: string) => void; icon?: string; required?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <InputField label={labelEn} icon={icon} value={valueEn} onChange={onChangeEn} placeholder={`Enter ${labelEn.toLowerCase()}`} required={required} />
      <InputField label={labelBn} value={valueBn} onChange={onChangeBn} placeholder={`${labelBn} লিখুন`} required={required} />
    </div>
  );
}

function TextArea({ label, icon, value, onChange, rows = 3 }: { label: string; icon?: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
        {icon && <i className={`bi ${icon} mr-1 text-primary/60`} />} {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
      />
    </div>
  );
}

function Toggle({ label, icon, checked, onChange }: { label: string; icon?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">
        {icon && <i className={`bi ${icon} mr-1.5 text-primary/60`} />} {label}
      </span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="bi bi-exclamation-triangle-fill" />
          </div>
          <h3 className="font-bold text-lg mb-2">Delete Item?</h3>
          <p className="text-sm text-muted-foreground mb-6">This action cannot be undone. The item will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-white font-semibold text-sm hover:opacity-90 transition-all">Delete</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${type === "success" ? "bg-green-600 text-white" : "bg-destructive text-white"}`}
    >
      <i className={`bi ${type === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"}`} /> {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70"><i className="bi bi-x" /></button>
    </motion.div>
  );
}

/* ─── Form Wrapper Components (module-level to avoid parser issues) ─── */

const PROJECT_DEFAULTS: Record<string, unknown> = {
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
  tags: [],
  icon: "bi-folder",
  color: "#006a4e",
  liveUrl: "#",
  codeUrl: "#",
  featured: false,
  category: "frontend",
};

function ProjectForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...PROJECT_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <BilingualInput labelEn="Title" labelBn="Title (BN)" valueEn={String(f.title)} valueBn={String(f.titleBn)} onChangeEn={(v) => u("title", v)} onChangeBn={(v) => u("titleBn", v)} icon="bi-type-bold" required />
      <BilingualInput labelEn="Description" labelBn="Description (BN)" valueEn={String(f.description)} valueBn={String(f.descriptionBn)} onChangeEn={(v) => u("description", v)} onChangeBn={(v) => u("descriptionBn", v)} />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Tags (comma-separated)" icon="bi-tags" value={String(Array.isArray(f.tags) ? (f.tags as string[]).join(", ") : f.tags)} onChange={(v) => u("tags", v.split(",").map((t: string) => t.trim()).filter(Boolean))} />
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground"><i className="bi bi-tag mr-1 text-primary/60" /> Category</label>
          <select value={String(f.category)} onChange={(e) => u("category", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm">
            <option value="frontend">Frontend</option>
            <option value="fullstack">Full Stack</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Icon (bi-*)" icon="bi-icons" value={String(f.icon)} onChange={(v) => u("icon", v)} placeholder="bi-folder" />
        <ColorPicker label="Color" value={String(f.color)} onChange={(v) => u("color", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Live URL" icon="bi-link" value={String(f.liveUrl)} onChange={(v) => u("liveUrl", v)} />
        <InputField label="Code URL" icon="bi-github" value={String(f.codeUrl)} onChange={(v) => u("codeUrl", v)} />
      </div>
      <Toggle label="Featured" icon="bi-star" checked={Boolean(f.featured)} onChange={(v) => u("featured", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const SKILL_DEFAULTS: Record<string, unknown> = {
  name: "",
  icon: "bi-code-slash",
  level: 80,
  color: "#006a4e",
  category: "frontend",
};

function SkillForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...SKILL_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Skill Name" icon="bi-type" value={String(f.name)} onChange={(v) => u("name", v)} required />
        <InputField label="Icon (bi-*)" icon="bi-icons" value={String(f.icon)} onChange={(v) => u("icon", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground"><i className="bi bi-bar-chart mr-1 text-primary/60" /> Level: {f.level}%</label>
          <input type="range" min="0" max="100" value={Number(f.level)} onChange={(e) => u("level", Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground"><i className="bi bi-tag mr-1 text-primary/60" /> Category</label>
          <select value={String(f.category)} onChange={(e) => u("category", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="tools">Tools</option>
          </select>
        </div>
      </div>
      <ColorPicker label="Color" value={String(f.color)} onChange={(v) => u("color", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const SERVICE_DEFAULTS: Record<string, unknown> = {
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
  icon: "bi-globe2",
  color: "#006a4e",
};

function ServiceForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...SERVICE_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <BilingualInput labelEn="Title" labelBn="Title (BN)" valueEn={String(f.title)} valueBn={String(f.titleBn)} onChangeEn={(v) => u("title", v)} onChangeBn={(v) => u("titleBn", v)} />
      <BilingualInput labelEn="Description" labelBn="Description (BN)" valueEn={String(f.description)} valueBn={String(f.descriptionBn)} onChangeEn={(v) => u("description", v)} onChangeBn={(v) => u("descriptionBn", v)} />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Icon (bi-*)" value={String(f.icon)} onChange={(v) => u("icon", v)} />
        <ColorPicker label="Color" value={String(f.color)} onChange={(v) => u("color", v)} />
      </div>
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const EXPERIENCE_DEFAULTS: Record<string, unknown> = {
  title: "",
  titleBn: "",
  company: "",
  period: "",
  periodBn: "",
  description: "",
  descriptionBn: "",
  icon: "bi-briefcase-fill",
  type: "full-time",
};

function ExperienceForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...EXPERIENCE_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <BilingualInput labelEn="Title" labelBn="Title (BN)" valueEn={String(f.title)} valueBn={String(f.titleBn)} onChangeEn={(v) => u("title", v)} onChangeBn={(v) => u("titleBn", v)} />
      <InputField label="Company" icon="bi-building" value={String(f.company)} onChange={(v) => u("company", v)} />
      <BilingualInput labelEn="Period" labelBn="Period (BN)" valueEn={String(f.period)} valueBn={String(f.periodBn)} onChangeEn={(v) => u("period", v)} onChangeBn={(v) => u("periodBn", v)} />
      <BilingualInput labelEn="Description" labelBn="Description (BN)" valueEn={String(f.description)} valueBn={String(f.descriptionBn)} onChangeEn={(v) => u("description", v)} onChangeBn={(v) => u("descriptionBn", v)} />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Icon (bi-*)" value={String(f.icon)} onChange={(v) => u("icon", v)} />
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Type</label>
          <select value={String(f.type)} onChange={(e) => u("type", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm">
            <option value="full-time">Full-time</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      </div>
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const EDUCATION_DEFAULTS: Record<string, unknown> = {
  degree: "",
  degreeBn: "",
  institution: "",
  institutionBn: "",
  period: "",
  periodBn: "",
  icon: "bi-mortarboard-fill",
};

function EducationForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...EDUCATION_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <BilingualInput labelEn="Degree" labelBn="Degree (BN)" valueEn={String(f.degree)} valueBn={String(f.degreeBn)} onChangeEn={(v) => u("degree", v)} onChangeBn={(v) => u("degreeBn", v)} />
      <BilingualInput labelEn="Institution" labelBn="Institution (BN)" valueEn={String(f.institution)} valueBn={String(f.institutionBn)} onChangeEn={(v) => u("institution", v)} onChangeBn={(v) => u("institutionBn", v)} />
      <BilingualInput labelEn="Period" labelBn="Period (BN)" valueEn={String(f.period)} valueBn={String(f.periodBn)} onChangeEn={(v) => u("period", v)} onChangeBn={(v) => u("periodBn", v)} />
      <InputField label="Icon (bi-*)" value={String(f.icon)} onChange={(v) => u("icon", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const TESTIMONIAL_DEFAULTS: Record<string, unknown> = {
  name: "",
  role: "",
  roleBn: "",
  text: "",
  textBn: "",
  avatar: "",
};

function TestimonialForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...TESTIMONIAL_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <InputField label="Name" icon="bi-person" value={String(f.name)} onChange={(v) => u("name", v)} required />
      <InputField label="Avatar (initials)" icon="bi-person-circle" value={String(f.avatar)} onChange={(v) => u("avatar", v)} placeholder="AB" />
      <BilingualInput labelEn="Role" labelBn="Role (BN)" valueEn={String(f.role)} valueBn={String(f.roleBn)} onChangeEn={(v) => u("role", v)} onChangeBn={(v) => u("roleBn", v)} />
      <BilingualInput labelEn="Testimonial" labelBn="Testimonial (BN)" valueEn={String(f.text)} valueBn={String(f.textBn)} onChangeEn={(v) => u("text", v)} onChangeBn={(v) => u("textBn", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const CERTIFICATE_DEFAULTS: Record<string, unknown> = {
  title: "",
  titleBn: "",
  issuer: "",
  issuerBn: "",
  date: "",
  icon: "bi-patch-check-fill",
  color: "#006a4e",
  url: "#",
};

function CertificateForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...CERTIFICATE_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <BilingualInput labelEn="Title" labelBn="Title (BN)" valueEn={String(f.title)} valueBn={String(f.titleBn)} onChangeEn={(v) => u("title", v)} onChangeBn={(v) => u("titleBn", v)} />
      <BilingualInput labelEn="Issuer" labelBn="Issuer (BN)" valueEn={String(f.issuer)} valueBn={String(f.issuerBn)} onChangeEn={(v) => u("issuer", v)} onChangeBn={(v) => u("issuerBn", v)} />
      <div className="grid grid-cols-3 gap-3">
        <InputField label="Date" value={String(f.date)} onChange={(v) => u("date", v)} />
        <InputField label="Icon (bi-*)" value={String(f.icon)} onChange={(v) => u("icon", v)} />
        <ColorPicker label="Color" value={String(f.color)} onChange={(v) => u("color", v)} />
      </div>
      <InputField label="URL" icon="bi-link" value={String(f.url)} onChange={(v) => u("url", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const FAQ_DEFAULTS: Record<string, unknown> = {
  question: "",
  questionBn: "",
  answer: "",
  answerBn: "",
};

function FaqForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...FAQ_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <BilingualInput labelEn="Question" labelBn="Question (BN)" valueEn={String(f.question)} valueBn={String(f.questionBn)} onChangeEn={(v) => u("question", v)} onChangeBn={(v) => u("questionBn", v)} />
      <BilingualInput labelEn="Answer" labelBn="Answer (BN)" valueEn={String(f.answer)} valueBn={String(f.answerBn)} onChangeEn={(v) => u("answer", v)} onChangeBn={(v) => u("answerBn", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const SOCIAL_DEFAULTS: Record<string, unknown> = {
  name: "",
  icon: "bi-globe2",
  url: "",
};

function SocialForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...SOCIAL_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Name" icon="bi-type" value={String(f.name)} onChange={(v) => u("name", v)} />
        <InputField label="Icon (bi-*)" value={String(f.icon)} onChange={(v) => u("icon", v)} />
      </div>
      <InputField label="URL" icon="bi-link" value={String(f.url)} onChange={(v) => u("url", v)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

const CONTACT_DEFAULTS: Record<string, unknown> = {
  icon: "bi-envelope-fill",
  title: "",
  titleBn: "",
  value: "",
  valueEn: "",
  link: "",
};

function ContactForm({ onSave, initial }: { onSave: (data: Record<string, unknown>) => void; initial?: Record<string, unknown> }) {
  const [f, setF] = useState({ ...CONTACT_DEFAULTS, ...initial });
  const u = (k: string, v: unknown) => setF((prev) => ({ ...prev, [k]: v }));
  return (
    <Fragment>
      <InputField label="Icon (bi-*)" value={String(f.icon)} onChange={(v) => u("icon", v)} />
      <BilingualInput labelEn="Title" labelBn="Title (BN)" valueEn={String(f.title)} valueBn={String(f.titleBn)} onChangeEn={(v) => u("title", v)} onChangeBn={(v) => u("titleBn", v)} />
      <BilingualInput labelEn="Value" labelBn="Value (BN)" valueEn={String(f.valueEn || f.value)} valueBn={String(f.value)} onChangeEn={(v) => u("valueEn", v)} onChangeBn={(v) => u("value", v)} />
      <InputField label="Link (optional)" icon="bi-link" value={String(f.link || "")} onChange={(v) => u("link", v || null)} />
      <button onClick={() => onSave(f)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-check-lg" /> Save
      </button>
    </Fragment>
  );
}

/* ─── Main Admin Panel ─── */
export default function AdminPanel() {
  const { data, adminLogout, updateData, pushData, removeData, settings, updateSettings, visitors } = useFirebase();
  const [active, setActive] = useState<Section>("dashboard");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ path: string; label: string } | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (path: string, value: unknown, label: string = "Item") => {
    try {
      await updateData(path, value);
      showToast(`${label} saved successfully!`);
    } catch {
      showToast(`Failed to save ${label}`, "error");
    }
  };

  const handlePush = async (path: string, value: unknown, label: string = "Item") => {
    try {
      await pushData(path, value);
      showToast(`${label} added successfully!`);
    } catch {
      showToast(`Failed to add ${label}`, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeData(deleteTarget.path);
      showToast(`${deleteTarget.label} deleted!`);
    } catch {
      showToast("Failed to delete", "error");
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      <AnimatePresence>{deleteTarget && <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}</AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold">
              <i className="bi bi-shield-lock-fill" />
            </div>
            <div>
              <p className="font-extrabold text-sm">Admin Panel</p>
              <p className="text-[10px] text-muted-foreground">MD MUBAROK HOSIN</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active === s.id ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <i className={`bi ${s.icon}`} /> {s.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={adminLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            <i className="bi bi-shield-lock-fill" />
          </div>
          <span className="font-bold text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={adminLogout} className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors">
            <i className="bi bi-box-arrow-right text-sm" />
          </button>
          <button onClick={() => setMobileNav(!mobileNav)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <i className={`bi ${mobileNav ? "bi-x-lg" : "bi-list"} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-card border-b border-border overflow-hidden">
            <div className="p-3 grid grid-cols-3 gap-1.5">
              {sections.map((s) => (
                <button key={s.id} onClick={() => { setActive(s.id); setMobileNav(false); }} className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-medium transition-all ${active === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  <i className={`bi ${s.icon} text-base`} /> {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {active === "dashboard" && <DashboardSection data={data} visitors={visitors} onNavigate={setActive} />}
            {active === "personal" && <PersonalSection data={data} onSave={handleSave} />}
            {active === "projects" && <ProjectsSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "skills" && <SkillsSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "services" && <ServicesSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "experiences" && <ExperiencesSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "education" && <EducationSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "testimonials" && <TestimonialsSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "certificates" && <CertificatesSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "faq" && <FaqSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "social" && <SocialSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "contact" && <ContactSection data={data} onSave={handleSave} onPush={handlePush} onDelete={(p, l) => setDeleteTarget({ path: p, label: l })} />}
            {active === "settings" && <SettingsSection settings={settings} onUpdate={updateSettings} showToast={showToast} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-2 py-1.5 flex overflow-x-auto gap-1">
        {sections.slice(0, 8).map((s) => (
          <button key={s.id} onClick={() => { setActive(s.id); setMobileNav(false); }} className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${active === s.id ? "text-primary" : "text-muted-foreground"}`}>
            <i className={`bi ${s.icon} text-sm`} /> {s.label.slice(0, 5)}
          </button>
        ))}
        <button onClick={() => setMobileNav(true)} className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-muted-foreground">
          <i className="bi bi-three-dots text-sm" /> More
        </button>
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function DashboardSection({ data, visitors, onNavigate }: { data: Record<string, unknown>; visitors: number; onNavigate: (s: Section) => void }) {
  const d = data as Record<string, unknown[]>;
  const stats = [
    { icon: "bi-eye-fill", label: "Visitors", value: visitors, color: "#006a4e" },
    { icon: "bi-folder-fill", label: "Projects", value: d.projects?.length || 0, color: "#f42a41" },
    { icon: "bi-code-slash", label: "Skills", value: d.skills?.length || 0, color: "#00875a" },
    { icon: "bi-chat-quote-fill", label: "Testimonials", value: d.testimonials?.length || 0, color: "#3776ab" },
    { icon: "bi-briefcase-fill", label: "Experiences", value: d.experiences?.length || 0, color: "#a259ff" },
    { icon: "bi-patch-check-fill", label: "Certificates", value: d.certificates?.length || 0, color: "#06b6d4" },
  ];
  return (
    <div>
      <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2"><i className="bi bi-speedometer2 text-primary" /> Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mx-auto mb-2" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              <i className={`bi ${s.icon}`} />
            </div>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <h3 className="font-bold text-sm mb-3 text-muted-foreground">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {sections.filter(s => s.id !== "dashboard").slice(0, 8).map(s => (
          <button key={s.id} onClick={() => onNavigate(s.id)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card border border-border text-sm font-medium hover:border-primary/30 hover:shadow-sm transition-all">
            <i className={`bi ${s.icon} text-primary`} /> {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Personal Section ─── */
function PersonalSection({ data, onSave }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void }) {
  const p = data.personal as Record<string, unknown>;
  const bio = p?.bio as Record<string, unknown>;
  const [form, setForm] = useState(p || {});

  const update = (key: string, value: unknown) => setForm((prev: Record<string, unknown>) => ({ ...prev, [key]: value }));

  return (
    <div>
      <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2"><i className="bi bi-person-fill text-primary" /> Personal Info</h2>
      <div className="space-y-4 bg-card border border-border rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Name" icon="bi-person" value={String(form.name || "")} onChange={(v) => update("name", v)} required />
          <InputField label="First Name" value={String(form.firstName || "")} onChange={(v) => update("firstName", v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Initials" value={String(form.initials || "")} onChange={(v) => update("initials", v)} />
          <InputField label="Email" icon="bi-envelope" type="email" value={String(form.email || "")} onChange={(v) => update("email", v)} />
        </div>
        <BilingualInput labelEn="Title" labelBn="Title (BN)" valueEn={String(form.title || "")} valueBn={String(form.titleBn || "")} onChangeEn={(v) => update("title", v)} onChangeBn={(v) => update("titleBn", v)} icon="bi-briefcase" />
        <BilingualInput labelEn="Tagline" labelBn="Tagline (BN)" valueEn={String(form.tagline || "")} valueBn={String(form.taglineBn || "")} onChangeEn={(v) => update("tagline", v)} onChangeBn={(v) => update("taglineBn", v)} icon="bi-star" />
        <InputField label="Phone" icon="bi-phone" value={String(form.phone || "")} onChange={(v) => update("phone", v)} />
        <BilingualInput labelEn="Location" labelBn="Location (BN)" valueEn={String(form.locationEn || "")} valueBn={String(form.location || "")} onChangeEn={(v) => update("locationEn", v)} onChangeBn={(v) => update("location", v)} icon="bi-geo-alt" />
        <InputField label="Profile Image URL" icon="bi-image" value={String(form.profileImage || "")} onChange={(v) => update("profileImage", v)} />
        <InputField label="Resume URL" icon="bi-file-earmark" value={String(form.resumeUrl || "")} onChange={(v) => update("resumeUrl", v)} />
        <BilingualInput labelEn="Availability" labelBn="Availability (BN)" valueEn={String(form.availability || "")} valueBn={String(form.availabilityBn || "")} onChangeEn={(v) => update("availability", v)} onChangeBn={(v) => update("availabilityBn", v)} icon="bi-clock" />
        <TextArea label="Short Bio (EN)" icon="bi-file-text" value={String(bio?.short || "")} onChange={(v) => update("bio", { ...((bio || {}) as object), short: v })} />
        <TextArea label="Short Bio (BN)" value={String(bio?.shortBn || "")} onChange={(v) => update("bio", { ...((bio || {}) as object), shortBn: v })} />
        <button onClick={() => onSave("personal", form, "Personal info")} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <i className="bi bi-check-lg" /> Save Personal Info
        </button>
      </div>
    </div>
  );
}

/* ─── Array Section (Generic CRUD) ─── */
function ArraySection({ title, icon, items, renderItem, renderForm, path, onSave, onPush, onDelete }: {
  title: string;
  icon: string;
  items: unknown[];
  path: string;
  renderItem: (item: Record<string, unknown>, index: number) => React.ReactNode;
  renderForm: (onSave: (data: Record<string, unknown>) => void, initial?: Record<string, unknown>) => React.ReactNode;
  onSave: (p: string, v: unknown, l?: string) => void;
  onPush: (p: string, v: unknown, l?: string) => void;
  onDelete: (p: string, l: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = (data: Record<string, unknown>) => {
    onPush(path, data, title.slice(0, -1));
    setShowForm(false);
  };

  const handleEdit = (data: Record<string, unknown>, index: number) => {
    onSave(`${path}/${index}`, data, title.slice(0, -1));
    setEditIndex(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold flex items-center gap-2"><i className={`bi ${icon} text-primary`} /> {title}</h2>
        <button onClick={() => { setShowForm(!showForm); setEditIndex(null); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20">
          <i className="bi bi-plus-lg" /> Add
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
            <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-plus-circle text-primary" /> Add New {title.slice(0, -1)}</h3>
              {renderForm(handleAdd)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2.5">
        {items.map((item, i) => {
          const r = item as Record<string, unknown>;
          if (editIndex === i) {
            return (
              <div key={i} className="bg-card border border-primary/20 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm"><i className="bi bi-pencil text-primary mr-1.5" /> Edit</h3>
                {renderForm((data) => handleEdit(data, i), r)}
                <button onClick={() => setEditIndex(null)} className="text-sm text-muted-foreground hover:text-foreground"><i className="bi bi-x-lg mr-1" /> Cancel</button>
              </div>
            );
          }
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">{renderItem(r, i)}</div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditIndex(i); setShowForm(false); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"><i className="bi bi-pencil text-sm" /></button>
                  <button onClick={() => onDelete(`${path}/${i}`, String(r.title || r.name || r.question || `Item ${i + 1}`))} className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"><i className="bi bi-trash text-sm" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No items yet. Add your first one!</p>}
      </div>
    </div>
  );
}

/* ─── Section Components (using module-level forms) ─── */

function ProjectsSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const projects = (data.projects || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Projects"
      icon="bi-folder-fill"
      items={projects}
      path="projects"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <i className={`bi ${String(item.icon || "bi-folder")}`} style={{ color: String(item.color || "#006a4e") }} />
            <span className="font-semibold text-sm">{String(item.title || "Untitled")}</span>
            {item.featured && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Featured</span>}
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{String(item.category)}</span>
          </div>
          <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap">{String(item.description || "")}</p>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <ProjectForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function SkillsSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const skills = (data.skills || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Skills"
      icon="bi-code-slash"
      items={skills}
      path="skills"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${String(item.color)}20`, color: String(item.color) }}>
            <i className={`bi ${String(item.icon)}`} />
          </span>
          <div>
            <span className="font-semibold text-sm">{String(item.name)}</span>
            <span className="text-xs text-muted-foreground ml-2">{String(item.level)}% - {String(item.category)}</span>
          </div>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <SkillForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function ServicesSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.services || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Services"
      icon="bi-tools"
      items={items}
      path="services"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <span className="font-semibold text-sm" style={{ color: String(item.color) }}>
            <i className={`bi ${String(item.icon)} mr-1`} />{String(item.title)}
          </span>
          <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap">{String(item.description)}</p>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <ServiceForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function ExperiencesSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.experiences || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Experiences"
      icon="bi-briefcase-fill"
      items={items}
      path="experiences"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <span className="font-semibold text-sm">{String(item.title)}</span>
          <span className="text-xs text-muted-foreground ml-2">{String(item.company)} - {String(item.period)}</span>
          <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap">{String(item.description)}</p>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <ExperienceForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function EducationSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.education || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Education"
      icon="bi-mortarboard-fill"
      items={items}
      path="education"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <span className="font-semibold text-sm">{String(item.degree)}</span>
          <span className="text-xs text-muted-foreground ml-2">{String(item.institution)}</span>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <EducationForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function TestimonialsSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.testimonials || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Testimonials"
      icon="bi-chat-quote-fill"
      items={items}
      path="testimonials"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <span className="font-semibold text-sm">{String(item.name)}</span>
          <span className="text-xs text-muted-foreground ml-2">{String(item.role)}</span>
          <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap mt-0.5 italic">&ldquo;{String(item.text)}&rdquo;</p>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <TestimonialForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function CertificatesSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.certificates || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Certificates"
      icon="bi-patch-check-fill"
      items={items}
      path="certificates"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <span className="font-semibold text-sm" style={{ color: String(item.color) }}>
            <i className={`bi ${String(item.icon)} mr-1`} />{String(item.title)}
          </span>
          <p className="text-xs text-muted-foreground">{String(item.issuer)} - {String(item.date)}</p>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <CertificateForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function FaqSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.faq || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="FAQ"
      icon="bi-question-circle-fill"
      items={items}
      path="faq"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div>
          <p className="font-semibold text-sm">{String(item.question)}</p>
          <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap">{String(item.answer)}</p>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <FaqForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function SocialSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.socialLinks || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Social Links"
      icon="bi-share-fill"
      items={items}
      path="socialLinks"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div className="flex items-center gap-2">
          <i className={`bi ${String(item.icon)} text-primary`} />
          <span className="font-semibold text-sm">{String(item.name)}</span>
          <span className="text-xs text-muted-foreground break-all">{String(item.url)}</span>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <SocialForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

function ContactSection({ data, onSave, onPush, onDelete }: { data: Record<string, unknown>; onSave: (p: string, v: unknown, l?: string) => void; onPush: (p: string, v: unknown, l?: string) => void; onDelete: (p: string, l: string) => void }) {
  const items = (data.contactInfo || []) as Record<string, unknown>[];
  return (
    <ArraySection
      title="Contact Info"
      icon="bi-envelope-fill"
      items={items}
      path="contactInfo"
      onSave={onSave}
      onPush={onPush}
      onDelete={onDelete}
      renderItem={(item) => (
        <div className="flex items-center gap-2">
          <i className={`bi ${String(item.icon)} text-primary`} />
          <span className="font-semibold text-sm">{String(item.title)}</span>
          <span className="text-xs text-muted-foreground">{String(item.value)}</span>
        </div>
      )}
      renderForm={(onSaveFn, initial) => <ContactForm onSave={onSaveFn} initial={initial} />}
    />
  );
}

/* ─── Settings Section ─── */
function SettingsSection({ settings, onUpdate, showToast }: { settings: SiteSettings; onUpdate: (s: Partial<SiteSettings>) => Promise<void>; showToast: (m: string, t: "success" | "error") => void }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  const u = (k: keyof SiteSettings, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(form);
      showToast("Settings saved!", "success");
    } catch {
      showToast("Failed to save settings", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2"><i className="bi bi-gear-fill text-primary" /> Settings</h2>

      <div className="space-y-5">
        {/* AI Chatbot */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-robot text-primary" /> AI Chatbot</h3>
          <Toggle label="Enable AI Chatbot" icon="bi-robot" checked={form.aiChatbotEnabled} onChange={(v) => u("aiChatbotEnabled", v)} />
          {form.aiChatbotEnabled && (
            <Fragment>
              {/* Provider Quick Select */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                  <i className="bi bi-cloud-fill mr-1 text-primary/60" /> Quick Setup (Select Provider)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: "openrouter",
                      label: "OpenRouter (Recommended)",
                      desc: "Works from all countries including Bangladesh",
                      baseUrl: "https://openrouter.ai/api/v1",
                      model: "google/gemini-2.5-flash-preview-05-20",
                      color: "#6366f1",
                    },
                    {
                      id: "gemini",
                      label: "Google Gemini Direct",
                      desc: "Not available in Bangladesh",
                      baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
                      model: "gemini-2.5-flash",
                      color: "#4285f4",
                    },
                    {
                      id: "groq",
                      label: "Groq (Fast)",
                      desc: "Free tier available, works globally",
                      baseUrl: "https://api.groq.com/openai/v1",
                      model: "llama-3.3-70b-versatile",
                      color: "#f55036",
                    },
                    {
                      id: "openai",
                      label: "OpenAI",
                      desc: "GPT models, paid only",
                      baseUrl: "https://api.openai.com/v1",
                      model: "gpt-4o-mini",
                      color: "#10a37f",
                    },
                  ].map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        u("aiChatbotBaseUrl", provider.baseUrl);
                        u("aiChatbotModel", provider.model);
                      }}
                      className="text-left p-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
                        <span className="text-xs font-bold">{provider.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{provider.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <InputField label="Base URL" icon="bi-globe" value={String(form.aiChatbotBaseUrl)} onChange={(v) => u("aiChatbotBaseUrl", v)} placeholder="https://openrouter.ai/api/v1" />
              <InputField label="API Key" icon="bi-key" type="password" value={String(form.aiChatbotApiKey)} onChange={(v) => u("aiChatbotApiKey", v)} placeholder="Enter API key" />
              <InputField label="Model Name" icon="bi-cpu" value={String(form.aiChatbotModel)} onChange={(v) => u("aiChatbotModel", v)} placeholder="google/gemini-2.5-flash-preview-05-20" />
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                <p className="text-[11px] text-amber-800 dark:text-amber-200 font-medium flex items-center gap-1.5 mb-1.5">
                  <i className="bi bi-exclamation-triangle-fill" /> Important Notes
                </p>
                <ul className="text-[10px] text-amber-700 dark:text-amber-300 space-y-1">
                  <li>- Google Gemini direct API does NOT work from Bangladesh. Use OpenRouter instead.</li>
                  <li>- For OpenRouter, model names must include provider prefix (e.g., google/gemini-2.5-flash-preview-05-20)</li>
                  <li>- Get free OpenRouter API key from openrouter.ai/keys</li>
                  <li>- For Google Gemini direct (outside BD only): model name is just gemini-2.5-flash</li>
                </ul>
              </div>
              <TextArea label="System Prompt" icon="bi-chat-left-text" value={String(form.aiChatbotSystemPrompt)} onChange={(v) => u("aiChatbotSystemPrompt", v)} rows={3} />
            </Fragment>
          )}
        </div>

        {/* Features */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-1">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><i className="bi bi-stars text-primary" /> Features</h3>
          <Toggle label="Sound Effects" icon="bi-volume-up" checked={form.soundEnabled} onChange={(v) => u("soundEnabled", v)} />
          <Toggle label="Easter Eggs" icon="bi-easel" checked={form.easterEggEnabled} onChange={(v) => u("easterEggEnabled", v)} />
          <Toggle label="Live Chat" icon="bi-chat-dots" checked={form.liveChatEnabled} onChange={(v) => u("liveChatEnabled", v)} />
          <Toggle label="Color Customizer" icon="bi-palette" checked={form.colorCustomizerEnabled} onChange={(v) => u("colorCustomizerEnabled", v)} />
          <Toggle label="Visitor Counter" icon="bi-eye" checked={form.visitorCounterEnabled} onChange={(v) => u("visitorCounterEnabled", v)} />
          <Toggle label="Keyboard Shortcuts" icon="bi-keyboard" checked={form.keyboardShortcutsEnabled} onChange={(v) => u("keyboardShortcutsEnabled", v)} />
          <Toggle label="Notification Bell" icon="bi-bell" checked={form.notificationBellEnabled} onChange={(v) => u("notificationBellEnabled", v)} />
          <Toggle label="PWA" icon="bi-phone" checked={form.pwaEnabled} onChange={(v) => u("pwaEnabled", v)} />
          <Toggle label="Parallax" icon="bi-layers" checked={form.parallaxEnabled} onChange={(v) => u("parallaxEnabled", v)} />
          <Toggle label="Bangladesh Map" icon="bi-map" checked={form.mapEnabled} onChange={(v) => u("mapEnabled", v)} />
          <Toggle label="QR Code" icon="bi-qr-code" checked={form.qrCodeEnabled} onChange={(v) => u("qrCodeEnabled", v)} />
          <Toggle label="Email Subscription" icon="bi-envelope-paper" checked={form.emailSubscriptionEnabled} onChange={(v) => u("emailSubscriptionEnabled", v)} />
        </div>

        {/* Video Intro */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-play-circle text-primary" /> Video Intro</h3>
          <Toggle label="Enable Video Intro" icon="bi-play-btn" checked={form.videoIntroEnabled} onChange={(v) => u("videoIntroEnabled", v)} />
          {form.videoIntroEnabled && (
            <InputField label="Video URL" icon="bi-link-45deg" value={String(form.videoIntroUrl)} onChange={(v) => u("videoIntroUrl", v)} placeholder="YouTube or direct video URL" />
          )}
        </div>

        {/* Colors */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-palette2 text-primary" /> Theme Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Primary Color" value={String(form.primaryColor)} onChange={(v) => u("primaryColor", v)} />
            <ColorPicker label="Accent Color" value={String(form.accentColor)} onChange={(v) => u("accentColor", v)} />
          </div>
        </div>

        {/* Site Info */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-globe text-primary" /> Site Info</h3>
          <InputField label="Site Name" icon="bi-type-bold" value={String(form.siteName)} onChange={(v) => u("siteName", v)} />
          <InputField label="Site Description" icon="bi-card-text" value={String(form.siteDescription)} onChange={(v) => u("siteDescription", v)} />
        </div>

        {/* Telegram */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-telegram text-primary" /> Telegram Bot</h3>
          <InputField label="Bot Token" icon="bi-key" value={String(form.telegramBotToken)} onChange={(v) => u("telegramBotToken", v)} />
          <InputField label="Chat ID" icon="bi-hash" value={String(form.telegramChatId)} onChange={(v) => u("telegramChatId", v)} />
        </div>

        {/* Admin Password */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><i className="bi bi-shield-lock text-primary" /> Admin Password</h3>
          <InputField label="New Password" icon="bi-key" type="password" value={String(form.adminPassword)} onChange={(v) => u("adminPassword", v)} />
          <p className="text-xs text-muted-foreground">Change the admin panel login password. Make sure to remember it!</p>
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
          {saving ? <><i className="bi bi-arrow-repeat animate-spin" /> Saving...</> : <><i className="bi bi-check-lg" /> Save All Settings</>}
        </button>
      </div>
    </div>
  );
}
