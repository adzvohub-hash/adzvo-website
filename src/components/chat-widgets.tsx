/**
 * chat-widgets.tsx
 * Floating chat widgets — WhatsApp (direct link) + a guided web chat.
 *
 * The web chat asks for the visitor's details, then walks a predefined tree of
 * questions and answers (src/lib/chatbot-flow.ts). No AI and no server.
 *
 * Both buttons are stacked bottom-right, same visual pattern as the
 * reference Nivatier site (green WA circle, gold/navy chat circle).
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { CONTACT, FLOW_BY_ID, fill, leadMessage, type Answers, type FlowOption } from "@/lib/chatbot-flow";
import { requestCallback } from "@/lib/callback";
import { logChat, type ChatEvent } from "@/lib/chat-log";
import { motion, AnimatePresence } from "framer-motion";

// ─── Config ────────────────────────────────────────────────────────────────
// WhatsApp number: country code + number, no "+" or spaces.
// Set here on purpose (not from VITE_WHATSAPP_NUMBER) so an old .env / hosting value can't override it.
export const WA_NUMBER: string = "917012376221"; // +91 70123 76221

// ─── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

/** Guided-chat state, kept for the browser tab so it survives page changes and closing the panel. */
interface ChatState {
  messages: Message[];
  step: string;
  history: string[];
  answers: Answers;
  sessionId: string;
}
const STATE_KEY = "adzvo-chat-flow";
const newSessionId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).slice(0, 8).toUpperCase();

// ─── Icons ──────────────────────────────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516z" />
    </svg>
  );
}

/** Animated robot mascot for the web chat button (waves, blinks, bobs). */
function RobotMascot() {
  return (
    <svg width="50" height="50" viewBox="0 0 64 64" fill="none" aria-hidden>
      <g className="adz-bot-bob">
        {/* antenna */}
        <line x1="32" y1="10" x2="32" y2="17" stroke="#E8EDF5" strokeWidth="2.5" strokeLinecap="round" />
        <circle className="adz-bot-antenna" cx="32" cy="8" r="3.2" fill="#C9A227" />
        {/* ears */}
        <rect x="11.5" y="24" width="4.5" height="8" rx="2" fill="#C9A227" />
        <rect x="48" y="24" width="4.5" height="8" rx="2" fill="#C9A227" />
        {/* head */}
        <rect x="15" y="16" width="34" height="25" rx="10" fill="#FFFFFF" />
        {/* visor */}
        <rect x="19.5" y="20.5" width="25" height="16" rx="7" fill="#0A1628" />
        {/* eyes */}
        <g className="adz-bot-eyes">
          <circle cx="27" cy="27" r="2.8" fill="#F5D76E" />
          <circle cx="37" cy="27" r="2.8" fill="#F5D76E" />
        </g>
        {/* smile */}
        <path d="M28.5 31.8 Q32 34.6 35.5 31.8" stroke="#F5D76E" strokeWidth="1.8" strokeLinecap="round" />
        {/* body */}
        <rect x="22" y="43" width="20" height="14" rx="6" fill="#FFFFFF" />
        <circle cx="32" cy="50" r="2.6" fill="#C9A227" />
        {/* left arm (resting) */}
        <path d="M22 47 L15.5 52.5" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <circle cx="14.5" cy="53.5" r="3" fill="#C9A227" />
        {/* right arm (waving) */}
        <g className="adz-bot-wave">
          <path d="M42 47 L50 39" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <circle cx="51.5" cy="37.5" r="3.4" fill="#C9A227" />
        </g>
      </g>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const MASCOT_CSS = `
@keyframes adz-bot-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
@keyframes adz-bot-wave { 0%,55%,100% { transform: rotate(0deg) } 10%,30% { transform: rotate(-20deg) } 20%,40% { transform: rotate(14deg) } }
@keyframes adz-bot-blink { 0%,44%,50%,100% { transform: scaleY(1) } 47% { transform: scaleY(0.1) } }
@keyframes adz-bot-antenna { 0%,100% { opacity: 1 } 50% { opacity: 0.45 } }
@keyframes adz-bot-ping { 0% { transform: scale(1); opacity: 0.55 } 80%,100% { transform: scale(1.55); opacity: 0 } }
.adz-bot-bob { animation: adz-bot-bob 2.6s ease-in-out infinite; }
.adz-bot-wave { transform-origin: 42px 47px; animation: adz-bot-wave 2.8s ease-in-out infinite; }
.adz-bot-eyes { transform-origin: 32px 27px; animation: adz-bot-blink 4.2s ease-in-out infinite; }
.adz-bot-antenna { animation: adz-bot-antenna 1.6s ease-in-out infinite; }
.adz-bot-ping { animation: adz-bot-ping 2.4s ease-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .adz-bot-bob, .adz-bot-wave, .adz-bot-eyes, .adz-bot-antenna, .adz-bot-ping { animation: none; }
  .adz-bot-ping { display: none; }
}
`;


// ─── Tooltip ────────────────────────────────────────────────────────────────
function Tooltip({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black/85 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      aria-hidden
    >
      {label}
    </span>
  );
}

// ─── Pre-chat form (name required; email + phone optional) ──────────────────
interface ChatUser {
  name: string;
  email: string;
  phone: string;
}

const USER_KEY = "adzvoChatUser";

function loadUser(): ChatUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ChatUser) : null;
  } catch {
    return null;
  }
}

function PreChatForm({ onSubmit }: { onSubmit: (u: ChatUser) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const ph = phone.trim();
    const next: typeof errors = {};
    if (!n) next.name = "Please enter your name";
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) next.email = "Please enter a valid email";
    if (ph && !/^[+\d][\d\s()-]{5,}$/.test(ph)) next.phone = "Please enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ name: n, email: em, phone: ph });
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#C9A227]/70 focus:bg-white/[0.12]";
  const label = "block text-xs font-medium text-white/70";
  const err = "mt-1 text-[11px] text-red-300";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative flex flex-1 flex-col overflow-y-auto px-5 py-5"
    >
      <p className="text-base font-semibold text-white">Welcome to ADZVO</p>
      <p className="mt-1 text-xs text-white/55">
        Tell us a little about you and we'll start the chat.
      </p>

      <div className="mt-4 space-y-3.5">
        <div>
          <label htmlFor="adz-chat-name" className={label}>
            Name <span className="text-[#C9A227]">*</span>
          </label>
          <input
            id="adz-chat-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className={`${field} ${errors.name ? "!border-red-400" : ""}`}
          />
          {errors.name && <p className={err}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="adz-chat-email" className={label}>
            Email <span className="text-white/35">(optional)</span>
          </label>
          <input
            id="adz-chat-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`${field} ${errors.email ? "!border-red-400" : ""}`}
          />
          {errors.email && <p className={err}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="adz-chat-phone" className={label}>
            Phone <span className="text-white/35">(optional)</span>
          </label>
          <input
            id="adz-chat-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            aria-invalid={!!errors.phone}
            className={`${field} ${errors.phone ? "!border-red-400" : ""}`}
          />
          {errors.phone && <p className={err}>{errors.phone}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-gradient-to-br from-[#E3C255] to-[#B08920] py-2.5 text-sm font-semibold text-[#0A1628] shadow-[0_8px_20px_-8px_rgba(201,162,39,0.7)] transition hover:brightness-110"
      >
        Start chat
      </button>
      <p className="text-center text-[11px] leading-snug text-white/50">
        We save this chat so our team can follow up.{" "}
        <a href="/privacy-policy" className="underline underline-offset-2 hover:text-white/80">Privacy Policy</a>
      </p>
    </form>
  );
}

// ─── Web Chat Panel ──────────────────────────────────────────────────────────
function WebChatPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<ChatUser | null>(loadUser);
  const [chat, setChat] = useState<ChatState>(() => {
    try {
      const saved = sessionStorage.getItem(STATE_KEY);
      if (saved) {
        const c = JSON.parse(saved) as ChatState;
        return { ...c, sessionId: c.sessionId || newSessionId() };
      }
    } catch { /* ignore */ }
    return { messages: [], step: "main", history: [], answers: {}, sessionId: newSessionId() };
  });
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(Date.now());
  const msg = (role: Message["role"], text: string): Message => ({ id: nextId.current++, role, text });

  // remember the conversation for this tab
  useEffect(() => {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(chat)); } catch { /* ignore */ }
  }, [chat]);

  // first open after the details form: greet with the main menu
  useEffect(() => {
    if (user && chat.messages.length === 0) {
      setChat((c) => ({ ...c, messages: [msg("bot", fill(FLOW_BY_ID["main"]!.text, user, {}))], step: "main", history: [], answers: {} }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // Scroll only the message list (never the panel or the page). A new bot answer is
    // brought to the top of the list so it's read from its first line, choices below it.
    const list = bottomRef.current?.parentElement;
    if (!list) return;
    const bots = list.querySelectorAll<HTMLElement>("[data-bot-msg]");
    const last = bots[bots.length - 1];
    const top = !typing && last ? last.offsetTop - 12 : list.scrollHeight;
    list.scrollTo({ top, behavior: "smooth" });
  }, [chat.messages, typing]);

  function startChat(u: ChatUser) {
    try { sessionStorage.setItem(USER_KEY, JSON.stringify(u)); } catch { /* keep in memory only */ }
    setUser(u);
    logChat({ sessionId: chat.sessionId, event: "chat started", name: u.name, phone: u.phone, email: u.email, selection: "Details submitted" });
  }

  /** Log one event against the current step (who, what the bot asked, what they chose). */
  function log(event: ChatEvent["event"], selection: string, action: string, who: ChatUser | null = user, answers: Answers = chat.answers) {
    if (!who) return;
    const step = FLOW_BY_ID[chat.step];
    logChat({
      sessionId: chat.sessionId, event, name: who.name, phone: who.phone, email: who.email,
      service: answers.service ?? "", stepId: chat.step, botText: step ? fill(step.text, who, chat.answers) : "",
      selection, action,
    });
  }

  /** Show a step: the bot "types" briefly, then posts the step's text. */
  function showStep(id: string, answers: Answers, history: string[], userLabel?: string, who: ChatUser | null = user) {
    const step = FLOW_BY_ID[id];
    const u = who;
    if (!step || !u) return;
    setChat((c) => ({ ...c, messages: userLabel ? [...c.messages, msg("user", userLabel)] : c.messages, answers, history }));
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setChat((c) => ({ ...c, step: id, messages: [...c.messages, msg("bot", fill(step.text, u, answers))] }));
    }, 450);
  }

  function say(userLabel: string, botText: string) {
    setChat((c) => ({ ...c, messages: [...c.messages, msg("user", userLabel), msg("bot", botText)] }));
  }

  function choose(opt: FlowOption) {
    if (!user || typing) return;
    const label = fill(opt.label, user, chat.answers);
    const answers = opt.set ? { ...chat.answers, ...opt.set } : chat.answers;
    const did = opt.next ? `→ ${opt.next}` : opt.page ? `opened page ${opt.page}` : opt.href ? `opened ${fill(opt.href, user, answers)}` : opt.action ?? "";
    if (opt.action !== "callback" || !user.phone) log("selection", label, opt.action === "callback" ? "callback → asked for phone" : did, user, answers);

    if (opt.action === "callback") {
      // no number yet? ask for it first, then pass the request on
      if (!user.phone) return showStep("callback-phone", answers, [...chat.history, chat.step], label);
      requestCallback({ sessionId: chat.sessionId, name: user.name, phone: user.phone, email: user.email, service: answers.service ?? "General enquiry", stepId: chat.step, botText: fill(FLOW_BY_ID[chat.step]?.text ?? "", user, answers) });
      return showStep("callback-done", answers, [...chat.history, chat.step], label);
    }

    if (opt.next) return showStep(opt.next, answers, [...chat.history, chat.step], label);

    if (opt.page) {
      const [to, hash] = opt.page.split("#");
      navigate(hash ? { to: to || "/", hash } : { to: to || "/" });
      say(label, "Done — I've opened that page for you. Anything else I can help with?");
      if (window.innerWidth < 640) onClose(); // on phones, get out of the way so the page is visible
      return;
    }
    if (opt.href) {
      const href = fill(opt.href, user, answers);
      if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
      else window.location.href = href;
      say(label, "Opening that for you now.");
      return;
    }
    if (opt.action === "whatsapp") {
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(leadMessage(user, answers))}`, "_blank", "noopener,noreferrer");
      say(label, "I've opened WhatsApp with your details filled in — just press send and our team will reply.");
      return;
    }
    if (opt.action === "email") {
      const subject = encodeURIComponent(answers.service ? `Project enquiry — ${answers.service}` : `Enquiry from ${user.name}`);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(leadMessage(user, answers))}`;
      say(label, `I've opened your email app with a message to ${CONTACT.email} — just press send.`);
    }
  }

  /** Phone number typed in for a call back. */
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const ph = phoneInput.trim();
    if (!/^[+\d][\d\s()-]{5,}$/.test(ph)) { setPhoneError("Please enter a valid phone number"); return; }
    setPhoneError("");
    setPhoneInput("");
    const updated = { ...user, phone: ph };
    try { sessionStorage.setItem(USER_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
    setUser(updated);
    log("phone entered", ph, "phone saved", updated);
    requestCallback({ sessionId: chat.sessionId, name: updated.name, phone: ph, email: updated.email, service: chat.answers.service ?? "General enquiry", stepId: chat.step, botText: fill(FLOW_BY_ID[chat.step]?.text ?? "", updated, chat.answers) });
    showStep("callback-done", chat.answers, [...chat.history, chat.step], ph, updated);
  }

  function goBack() {
    if (typing || chat.history.length === 0) return;
    const history = chat.history.slice(0, -1);
    log("navigation", "← Back", `→ ${chat.history[chat.history.length - 1]}`);
    showStep(chat.history[chat.history.length - 1]!, chat.answers, history, "← Back");
  }
  function goMain() {
    if (typing) return;
    log("navigation", "Main menu", "→ main");
    showStep("main", {}, [], "Main menu");
  }

  const current = FLOW_BY_ID[chat.step] ?? FLOW_BY_ID["main"]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed bottom-[172px] right-5 z-[1000] flex w-[370px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[28px] border border-white/20"
      style={{
        height: "500px",
        maxHeight: "calc(100vh - 190px)",
        background:
          "linear-gradient(160deg, rgba(22,48,92,0.62) 0%, rgba(10,22,40,0.72) 55%, rgba(10,22,40,0.8) 100%)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        boxShadow:
          "0 30px 70px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* soft light blooms behind the glass content */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#C9A227]/30 blur-3xl" />
        <span className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-[#3b82f6]/20 blur-3xl" />
      </span>
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-white/10 bg-white/[0.06] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#E3C255] to-[#B08920] shadow-[0_4px_14px_rgba(201,162,39,0.45)]">
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#12233f] bg-emerald-400" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                fill="white"
                opacity="0.95"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold leading-none text-white">ADZVO Assistant</p>
            <p className="mt-1 text-[11px] text-white/60">Online · tap an option to begin</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
          aria-label="Close chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {!user ? (
        <PreChatForm onSubmit={startChat} />
      ) : (
        <>
      {/* Conversation */}
      <div className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
        {chat.messages.map((m) => (
          <div key={m.id} data-bot-msg={m.role === "bot" ? "" : undefined} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-[#E3C255] to-[#B08920] font-medium text-[#0A1628] shadow-[0_6px_16px_-6px_rgba(201,162,39,0.6)]"
                  : "rounded-bl-md border border-white/15 bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              }`}
              style={{ wordBreak: "break-word" }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-white/15 bg-white/[0.09] px-4 py-3">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </div>
          </div>
        )}

        {/* the current step's choices */}
        {!typing && user && (
          <div className="flex flex-col items-end gap-2 pt-1" role="group" aria-label="Choose an option">
            {current.options.map((o) => {
              const external = !!(o.page || o.href || (o.action && o.action !== "callback"));
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(o)}
                  className="inline-flex max-w-[90%] items-center gap-1.5 rounded-full border border-[#E3C255]/55 bg-white/[0.06] px-3.5 py-2 text-left text-[13px] font-semibold text-[#F5D76E] transition hover:border-[#E3C255] hover:bg-[#E3C255]/15 focus-visible:outline-2 focus-visible:outline-[#E3C255]"
                >
                  {fill(o.label, user, chat.answers)}
                  {external && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
        {/* phone box (only on the "what's your number?" step) */}
        {!typing && user && current.input === "phone" && (
          <form onSubmit={submitPhone} className="flex flex-col items-end gap-1.5 pt-1" noValidate>
            <label htmlFor="adz-chat-callback-phone" className="sr-only">Your phone number</label>
            <div className="flex w-[90%] items-center gap-2">
              <input
                id="adz-chat-callback-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                autoFocus
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+91 98765 43210"
                aria-invalid={!!phoneError}
                className={`min-w-0 flex-1 rounded-full border bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#C9A227]/70 ${phoneError ? "border-red-400" : "border-white/15"}`}
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-gradient-to-br from-[#E3C255] to-[#B08920] px-4 py-2.5 text-[13px] font-bold text-[#0A1628] transition hover:brightness-110"
              >
                Call me
              </button>
            </div>
            {phoneError && <p className="text-xs text-red-300">{phoneError}</p>}
          </form>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Back / main menu */}
      {user && chat.step !== "main" && (
        <div className="relative flex items-center justify-between gap-2 border-t border-white/10 bg-white/[0.04] px-3 py-2.5">
          <button
            type="button"
            onClick={goBack}
            disabled={chat.history.length === 0 || typing}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={goMain}
            disabled={typing}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            Main menu
          </button>
        </div>
      )}
        </>
      )}

      {/* Powered-by footer */}
      <div className="relative pb-2 pt-0.5 text-center text-[10px] tracking-wide text-white/35">
        Powered by ADZVO
      </div>
    </motion.div>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────
export function ChatWidgets() {
  const [chatOpen, setChatOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Greeting bubble: pops up shortly after load, then tucks away (still shows on hover)
  useEffect(() => {
    const show = setTimeout(() => setShowHint(true), 1500);
    const hide = setTimeout(() => setShowHint(false), 9000);
    // on phones the bubble sits over the page text, so tuck it away as soon as the visitor scrolls
    const onScroll = () => { if (window.innerWidth < 768) { clearTimeout(show); setShowHint(false); } };
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Hide on admin route
  const isAdmin = useRouterState({
    select: (s) =>
      s.location.pathname === "/adzvoadmin" ||
      s.location.pathname.startsWith("/adzvoadmin/"),
  });

  if (isAdmin) return null;

  return (
    <>
      {/* Web chat panel */}
      <AnimatePresence>{chatOpen && <WebChatPanel onClose={() => setChatOpen(false)} />}</AnimatePresence>

      {/* Button stack — bottom-right */}
      <div className="fixed bottom-5 right-5 z-[1001] flex flex-col-reverse items-center gap-3">
        {/* Web chat button — animated robot mascot */}
        <div className="group relative">
          <style>{MASCOT_CSS}</style>
          {!chatOpen && (
            <span
              aria-hidden
              className={`pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl rounded-br-sm bg-white px-3.5 py-2 text-[13px] font-semibold text-[#0A1628] shadow-xl ring-1 ring-black/5 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                showHint ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
              }`}
            >
              Hi! Chat with us 👋
            </span>
          )}
          {!chatOpen && (
            <span
              aria-hidden
              className="adz-bot-ping pointer-events-none absolute inset-0 rounded-full border-2 border-[#C9A227]"
            />
          )}
          <motion.button
            whileHover={{ scale: 1.07, y: -2 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => {
              setChatOpen((o) => !o);
              setShowHint(false);
            }}
            aria-label={chatOpen ? "Close chat" : "Chat with us"}
            className="relative flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{
              background: "linear-gradient(135deg,#16305c,#0A1628)",
              border: "2px solid #C9A227",
              boxShadow: "0 10px 25px -5px rgba(201,162,39,0.45)",
            }}
          >
            {chatOpen ? <CloseIcon /> : <RobotMascot />}
          </motion.button>
        </div>

        {/* WhatsApp button — green, same style as reference */}
        <div className="group relative">
          <Tooltip label="Chat on WhatsApp" />
          <motion.a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            whileHover={{ scale: 1.07, y: -2 }}
            whileTap={{ scale: 0.93 }}
            className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              boxShadow: "0 10px 25px -5px rgba(37,211,102,0.4)",
            }}
          >
            <WhatsAppIcon />
          </motion.a>
        </div>
      </div>
    </>
  );
}
