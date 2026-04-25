"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── 1. 3D Tilt Card Effect ─── */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/* ─── 2. Sound Effects ─── */
const AudioCtx = typeof window !== "undefined" ? window.AudioContext : null;

export function useSoundEffect() {
  const ctxRef = useRef<InstanceType<typeof AudioContext> | null>(null);

  const play = useCallback((type: "click" | "success" | "error" | "hover" = "click") => {
    try {
      if (!ctxRef.current && AudioCtx) ctxRef.current = new AudioCtx();
      const ctx = ctxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") { osc.frequency.value = 600; gain.gain.value = 0.08; osc.type = "sine"; }
      else if (type === "success") { osc.frequency.value = 800; gain.gain.value = 0.1; osc.type = "sine"; }
      else if (type === "error") { osc.frequency.value = 300; gain.gain.value = 0.1; osc.type = "sawtooth"; }
      else { osc.frequency.value = 1200; gain.gain.value = 0.03; osc.type = "sine"; }

      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch { /* silent fail */ }
  }, []);

  return { play };
}

/* ─── 3. Confetti Animation ─── */
export function ConfettiEffect({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; rotation: number; vx: number; vy: number }>>([]);

  useEffect(() => {
    if (!trigger) return;
    const colors = ["#006a4e", "#f42a41", "#00875a", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 15,
      vy: -(Math.random() * 12 + 5),
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div key={p.id} initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 1, rotate: 0 }}
          animate={{ left: `${p.x + p.vx}%`, top: `${p.y + p.vy + 60}%`, opacity: 0, rotate: p.rotation + 360 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute" style={{ width: p.size, height: p.size, backgroundColor: p.color, borderRadius: Math.random() > 0.5 ? "50%" : "2px" }} />
      ))}
    </div>
  );
}

/* ─── 4. Easter Egg (Konami Code) ─── */
export function useEasterEgg(callback: () => void, enabled: boolean = true) {
  const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === sequence[indexRef.current]) {
        indexRef.current++;
        if (indexRef.current === sequence.length) {
          callback();
          indexRef.current = 0;
        }
      } else {
        indexRef.current = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback, enabled]);
}

export function EasterEggModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
              <span className="text-6xl block mb-4">🎉</span>
            </motion.div>
            <h3 className="text-xl font-extrabold mb-2 gradient-text">You found it!</h3>
            <p className="text-sm text-muted-foreground mb-4">You discovered the secret Konami Code! You are a true explorer. Thanks for visiting my portfolio!</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Awesome! 🚀</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── 5. Skill Radar Chart (SVG) ─── */
export function SkillRadarChart({ skills }: { skills: Array<{ name: string; level: number; color: string }> }) {
  const size = 280;
  const center = size / 2;
  const radius = 110;
  const levels = 5;
  const count = skills.length;
  if (count < 3) return null;

  const angleStep = (Math.PI * 2) / count;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid lines */}
        {Array.from({ length: levels }, (_, l) => {
          const r = (radius / levels) * (l + 1);
          const points = Array.from({ length: count }, (_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={l} points={points} fill="none" stroke="var(--border)" strokeWidth="0.5" />;
        })}
        {/* Axis lines */}
        {Array.from({ length: count }, (_, i) => {
          const p = getPoint(i, 100);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--border)" strokeWidth="0.5" />;
        })}
        {/* Data polygon */}
        <polygon
          points={skills.map((s, i) => { const p = getPoint(i, s.level); return `${p.x},${p.y}`; }).join(" ")}
          fill="rgba(0,106,78,0.15)" stroke="#006a4e" strokeWidth="2"
        />
        {/* Data points */}
        {skills.map((s, i) => {
          const p = getPoint(i, s.level);
          return <circle key={i} cx={p.x} cy={p.y} r="4" fill={s.color} stroke="white" strokeWidth="1.5" />;
        })}
        {/* Labels */}
        {skills.map((s, i) => {
          const p = getPoint(i, 120);
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[9px] font-semibold">{s.name}</text>;
        })}
      </svg>
    </div>
  );
}

/* ─── 6. Real-time Bangladesh Clock ─── */
export function BangladeshClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
      <i className="bi bi-clock text-primary" /> {time} (BST)
    </span>
  );
}

/* ─── 7. QR Code ─── */
export function QRCodeDisplay({ url, size = 120 }: { url: string; size?: number }) {
  // Simple QR code using SVG pattern (lightweight, no external lib needed)
  const [qrData, setQrData] = useState<string>("");

  useEffect(() => {
    // Use Google Charts API for QR generation (no external dependency)
    setQrData(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`);
  }, [url, size]);

  if (!qrData) return null;

  return (
    <div className="bg-white p-3 rounded-xl inline-block">
      <img src={qrData} alt="QR Code" width={size} height={size} className="rounded-lg" />
    </div>
  );
}

/* ─── 8. Live Chat Widget (Telegram-based) ─── */
export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: "user" | "bot"; text: string; time: string }>>([
    { from: "bot", text: "👋 Hello! How can I help you today? Feel free to ask about my services, projects, or anything!", time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { from: "user", text: input, time }]);
    setInput("");

    // Auto reply
    setTimeout(() => {
      const replies = [
        "Thanks for your message! I'll get back to you soon. You can also reach me on Telegram for faster response. 📱",
        "Great question! Please email me at contact.mdmubarok@gmail.com for detailed discussion. 📧",
        "I appreciate your interest! Let me connect you with more details shortly. 🚀",
      ];
      setMessages((prev) => [...prev, { from: "bot", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1000);
  };

  return (
    <Fragment>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-[calc(100%-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><i className="bi bi-headset text-lg" /></div>
                <div>
                  <p className="font-bold text-sm">Live Chat</p>
                  <p className="text-[10px] opacity-80 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"><i className="bi bi-x-lg text-sm" /></button>
            </div>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-2.5 bg-muted/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3.5 py-2 rounded-xl text-sm ${msg.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${msg.from === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..." className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all">
                <i className="bi bi-send-fill text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble */}
      <motion.button onClick={() => setOpen(!open)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:shadow-xl transition-shadow">
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"} text-xl`} />
      </motion.button>
    </Fragment>
  );
}

/* ─── 9. AI Chatbot Widget ─── */
export function AIChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: "user" | "ai"; text: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const currentMessages = [...messages, { from: "user" as const, text: userMsg }];
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: currentMessages.slice(-20) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "ai", text: data.reply || "Sorry, I could not process that." }]);
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <Fragment>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-4 md:left-6 z-50 w-[calc(100%-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-bd-green-light text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><i className="bi bi-robot text-lg" /></div>
                <div>
                  <p className="font-bold text-sm">AI Assistant</p>
                  <p className="text-[10px] opacity-80">Powered by AI</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"><i className="bi bi-x-lg text-sm" /></button>
            </div>
            <div className="h-64 overflow-y-auto p-3 space-y-2.5 bg-muted/30">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <i className="bi bi-robot text-4xl mb-2 block text-primary/30" />
                  <p>Ask me anything about the portfolio!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2 rounded-xl text-sm ${msg.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                    <span className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-xl px-3.5 py-2 text-sm text-muted-foreground">
                    <i className="bi bi-three-dots animate-pulse" /> Thinking...
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..." className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button onClick={sendMessage} disabled={loading} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50">
                <i className="bi bi-send-fill text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={() => setOpen(!open)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-4 md:left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-bd-green-light text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
        <i className={`bi ${open ? "bi-x-lg" : "bi-robot"} text-xl`} />
      </motion.button>
    </Fragment>
  );
}

/* ─── 10. Mouse Follow Effect ─── */
export function MouseFollowEffect() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="fixed pointer-events-none z-[9980] hidden md:block"
      style={{ left: pos.x - 100, top: pos.y - 100, width: 200, height: 200 }}>
      <div className="w-full h-full rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />
    </div>
  );
}

/* ─── 11. Keyboard Shortcuts ─── */
export function useKeyboardShortcuts(enabled: boolean, navigateTo: (page: string) => void, toggleTheme: () => void, toggleLanguage: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const pages = ["home", "about", "skills", "projects", "experience", "contact"];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) { e.preventDefault(); navigateTo(pages[num - 1]); }
      if (e.key === "d" || e.key === "D") { e.preventDefault(); toggleTheme(); }
      if (e.key === "l" || e.key === "L") { e.preventDefault(); toggleLanguage(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, navigateTo, toggleTheme, toggleLanguage]);
}

/* ─── 12. Notification Bell ─── */
export function NotificationBell() {
  const [show, setShow] = useState(false);
  const notifications = [
    { icon: "bi-bell-fill", text: "Welcome to my portfolio!", time: "Now", color: "#006a4e" },
    { icon: "bi-rocket-takeoff-fill", text: "New project: Shohayok Messenger", time: "2 days ago", color: "#f42a41" },
    { icon: "bi-patch-check-fill", text: "New certificate added!", time: "1 week ago", color: "#00875a" },
  ];

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
        <i className="bi bi-bell text-base" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute right-0 top-10 w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-border font-semibold text-sm flex items-center gap-2"><i className="bi bi-bell text-primary" /> Notifications</div>
            {notifications.map((n, i) => (
              <div key={i} className="p-3 hover:bg-muted/50 transition-colors flex items-start gap-2.5 border-b border-border/50 last:border-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${n.color}15`, color: n.color }}>
                  <i className={`bi ${n.icon}`} />
                </div>
                <div><p className="text-xs font-medium">{n.text}</p><p className="text-[10px] text-muted-foreground">{n.time}</p></div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── 13. Color Theme Customizer ─── */
export function ColorCustomizer() {
  const [open, setOpen] = useState(false);
  const presets = [
    { name: "BD Green", primary: "#006a4e", accent: "#f42a41" },
    { name: "Ocean Blue", primary: "#1a73e8", accent: "#ff6d00" },
    { name: "Purple Dream", primary: "#7c3aed", accent: "#f59e0b" },
    { name: "Rose Gold", primary: "#e11d48", accent: "#8b5cf6" },
    { name: "Teal Wave", primary: "#0d9488", accent: "#f97316" },
    { name: "Midnight", primary: "#4338ca", accent: "#06b6d4" },
  ];

  const applyTheme = (primary: string, accent: string) => {
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--accent", accent);
    localStorage.setItem("custom-primary", primary);
    localStorage.setItem("custom-accent", accent);
  };

  return (
    <Fragment>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="fixed right-16 bottom-6 z-50 w-64 bg-card border border-border rounded-xl shadow-xl p-4">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><i className="bi bi-palette text-primary" /> Theme Colors</h4>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button key={p.name} onClick={() => applyTheme(p.primary, p.accent)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex gap-0.5">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.primary }} />
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.accent }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{p.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { localStorage.removeItem("custom-primary"); localStorage.removeItem("custom-accent"); window.location.reload(); }}
              className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 border border-border rounded-lg">
              <i className="bi bi-arrow-counterclockwise mr-1" /> Reset to Default
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen(!open)}
        className="fixed right-4 md:right-6 bottom-24 z-50 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:border-primary/30 transition-all">
        <i className="bi bi-palette text-base text-primary" />
      </button>
    </Fragment>
  );
}

/* ─── 14. Parallax Wrapper ─── */
export function ParallaxSection({ children, speed = 0.3, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const diff = scrollY - elementTop;
      setOffset(diff * speed);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div style={{ transform: `translateY(${offset}px)` }}>{children}</div>
    </div>
  );
}

/* ─── 15. Visitor Counter Badge ─── */
export function VisitorBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
      <i className="bi bi-eye-fill" /> {count.toLocaleString()} visitors
    </span>
  );
}

/* ─── 16. Email Subscription ─── */
export function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Store in Firebase
    try {
      const { push, ref } = await import("firebase/database");
      const { db } = await import("@/lib/firebase");
      await push(ref(db, "subscribers"), { email, date: new Date().toISOString() });
      setSubscribed(true);
      setEmail("");
    } catch { /* silent */ }
  };

  if (subscribed) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
        <i className="bi bi-check-circle-fill" /> Subscribed! Thank you.
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
        className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required />
      <button type="submit" className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        <i className="bi bi-send" />
      </button>
    </form>
  );
}

/* ─── 17. Lazy Loading Image ─── */
export function LazyImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-xl" />
      )}
      <img src={src} alt={alt} onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} />
    </div>
  );
}

/* ─── 18. Project Case Study Modal ─── */
export function CaseStudyModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: Record<string, unknown> | null }) {
  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive">
            <i className="bi bi-x-lg text-sm" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white" style={{ backgroundColor: String(project.color || "#006a4e") }}>
              <i className={`bi ${String(project.icon || "bi-folder")}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{String(project.title)}</h3>
              <span className="text-xs font-semibold text-primary uppercase">{String(project.category)}</span>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><i className="bi bi-file-text text-primary" /> Overview</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{String(project.description)}</p>
          </div>

          {/* Challenge */}
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><i className="bi bi-exclamation-diamond text-amber-500" /> Challenge</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">Building a scalable, performant solution that handles real-world complexity while maintaining excellent user experience across all devices and platforms.</p>
          </div>

          {/* Solution */}
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><i className="bi bi-lightbulb text-green-500" /> Solution</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">Implemented using modern technologies and best practices with focus on performance, accessibility, and maintainability. Clean architecture with modular components.</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><i className="bi bi-code-slash text-primary" /> Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {(project.tags as string[] || []).map((tag) => (
                <span key={tag} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20">{tag}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            <a href={String(project.liveUrl || "#")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
              <i className="bi bi-box-arrow-up-right" /> Live Demo
            </a>
            <a href={String(project.codeUrl || "#")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted">
              <i className="bi bi-github" /> Source Code
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── 19. Bangladesh Map SVG ─── */
export function BangladeshMap() {
  return (
    <div className="relative inline-block">
      <svg viewBox="0 0 200 250" className="w-48 h-auto" fill="none">
        <path d="M100 20 C120 25, 150 40, 160 70 C170 100, 165 130, 155 155 C145 180, 125 200, 110 220 C95 235, 80 240, 70 230 C55 215, 45 195, 40 170 C35 145, 38 120, 45 95 C52 70, 65 45, 80 30 C85 25, 93 20, 100 20Z"
          fill="var(--primary)" fillOpacity="0.15" stroke="var(--primary)" strokeWidth="2" />
        <circle cx="105" cy="120" r="6" fill="var(--accent)" className="animate-pulse" />
        <text x="115" y="125" className="fill-foreground text-[9px] font-bold">ঢাকা</text>
      </svg>
    </div>
  );
}

/* ─── 20. PWA Install Prompt ─── */
export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const deferredPrompt = sessionStorage.getItem("pwa-prompt-shown");
    if (!deferredPrompt) {
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = () => {
    setShow(false);
    sessionStorage.setItem("pwa-prompt-shown", "true");
  };

  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40 bg-card border border-border rounded-2xl p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <i className="bi bi-download text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-1">Install App</h4>
          <p className="text-xs text-muted-foreground">Add to home screen for offline access</p>
        </div>
        <button onClick={() => { setShow(false); sessionStorage.setItem("pwa-prompt-shown", "true"); }} className="text-muted-foreground hover:text-foreground">
          <i className="bi bi-x" />
        </button>
      </div>
      <button onClick={handleInstall}
        className="w-full mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
        Install Now
      </button>
    </motion.div>
  );
}

/* ─── 21. Language Auto-Detection ─── */
export function useLanguageAutoDetect(setLang: (lang: "en" | "bn") => void) {
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang");
    if (saved) return; // Already set by user
    const browserLang = navigator.language || (navigator as unknown as Record<string, string>).userLanguage;
    if (browserLang.startsWith("bn")) {
      setLang("bn");
    }
  }, [setLang]);
}

/* ─── 22. Sound Toggle Button ─── */
export function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
      title={enabled ? "Mute sounds" : "Enable sounds"}>
      <i className={`bi ${enabled ? "bi-volume-up-fill" : "bi-volume-mute-fill"} text-base ${enabled ? "text-primary" : "text-muted-foreground"}`} />
    </button>
  );
}

/* ─── 23. Video Intro Modal ─── */
export function VideoIntroModal({ isOpen, onClose, videoUrl }: { isOpen: boolean; onClose: () => void; videoUrl: string }) {
  if (!isOpen || !videoUrl) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
            <i className="bi bi-x-lg text-sm" />
          </button>
          <iframe src={videoUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── 24. Keyboard Shortcuts Help ─── */
export function KeyboardShortcutsHelp({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  const shortcuts = [
    { key: "1-6", action: "Navigate pages" },
    { key: "D", action: "Toggle dark/light mode" },
    { key: "L", action: "Switch language" },
    { key: "↑↑↓↓←→←→BA", action: "Easter egg! 🎉" },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="bi bi-keyboard text-primary" /> Keyboard Shortcuts</h3>
          <div className="space-y-3">
            {shortcuts.map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.action}</span>
                <kbd className="px-2.5 py-1 text-xs font-mono bg-muted border border-border rounded-lg">{s.key}</kbd>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="mt-4 w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Got it!</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
