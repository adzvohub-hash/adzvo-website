/**
 * Sends chatbot events and contact-form enquiries to ADZVO's Google Apps Script web app, which:
 *   • adds a row to the "Chat log" sheet for every chat event,
 *   • for call-back requests, adds a row to "Call-backs" and emails adzvohub@gmail.com,
 *   • for contact-form enquiries, adds a row to "Enquiries" and emails adzvohub@gmail.com.
 * Setup: google-apps-script/SETUP.md. Paste the web app URL into CHAT_LOG_URL below.
 */

// 1) Paste your Apps Script web app URL here (ends in /exec). Empty = logging off.
export const CHAT_LOG_URL = "https://script.google.com/macros/s/AKfycbx-SAdzsJqpOWSVF5V5UqJ415hbLPU-o6PNOZ11x7ns5kjZd-Z6gNopfJwbr60HtDldBg/exec";
// 2) Must match SECRET in google-apps-script/Code.gs (stops random junk being logged).
export const CHAT_LOG_KEY = "adzvo-bc4d61a2bf7d174ec9a13308";

export type ChatEvent = {
  sessionId: string;
  event: "chat started" | "selection" | "navigation" | "phone entered" | "callback";
  name: string;
  phone: string;
  email: string;
  service?: string;
  stepId?: string;
  botText?: string;   // the question the bot was asking
  selection?: string; // what the visitor chose or typed
  action?: string;    // what the choice did
};

function device() {
  const w = window.innerWidth;
  return w < 768 ? "Mobile" : w < 1024 ? "Tablet" : "Desktop";
}

/** POST to the Apps Script. text/plain + no-cors is the simple request Apps Script accepts from a browser. */
async function post(data: Record<string, unknown>): Promise<boolean> {
  const payload = { key: CHAT_LOG_KEY, ...data, page: window.location.pathname, device: device() };
  if (!CHAT_LOG_URL) {
    console.info("[ADZVO → sheet] (CHAT_LOG_URL not set)", payload);
    return true;
  }
  try {
    await fetch(CHAT_LOG_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    return false;
  }
}

/** Chat events: fire and forget — never break the chat over logging. */
export function logChat(ev: ChatEvent) {
  void post(ev);
}

export type Enquiry = { name: string; email: string; phone: string; message: string };

/** Contact-form enquiry. Resolves false only if the request couldn't be sent at all (e.g. offline). */
export function sendEnquiry(e: Enquiry) {
  return post({ event: "enquiry", ...e });
}
