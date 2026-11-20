/**
 * Call-back requests from the guided chatbot.
 * Sent to the Google Apps Script web app (see chat-log.ts), which logs the
 * request in the "Call-backs" sheet and emails adzvohub@gmail.com.
 */
import { logChat } from "@/lib/chat-log";

export type CallbackLead = {
  sessionId: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  stepId: string;
  botText: string;
};

export function requestCallback(lead: CallbackLead) {
  logChat({
    sessionId: lead.sessionId,
    event: "callback",
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    service: lead.service,
    stepId: lead.stepId,
    botText: lead.botText,
    selection: "Call back requested",
    action: "callback",
  });
}
