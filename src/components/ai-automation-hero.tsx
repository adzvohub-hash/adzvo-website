import { Link } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Database,
  FileText,
  Image,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export function AiAutomationHero() {
  return (
    <section className="automation-hero" aria-labelledby="automation-title">
      <img className="automation-backdrop" src={frost} alt="" width={1920} height={1088} />
      <div className="automation-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="automation-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="automation-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            AI <Highlight>& Automation</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            Smarter business starts with AI
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Talk to an AI Expert <ArrowUpRight /></GlassButton>
        </div>

        <div className="automation-showcase" aria-label="Illustrative intelligent workflow from business inputs through AI reasoning to automated action">
          <div className="automation-board">
            <div className="automation-board-heading">
              <div className="flex items-center gap-3">
                <span className="automation-board-icon"><Workflow className="size-5" /></span>
                <div>
                  <p className="text-sm font-semibold text-navy">Intelligent workflow</p>
                  <p className="mt-0.5 text-xs text-navy/60">Connected from signal to action</p>
                </div>
              </div>
              <span className="automation-status"><i /> System active</span>
            </div>

            <div className="automation-pipeline">
              <div className="automation-stage">
                <div className="automation-stage-heading">
                  <span className="automation-stage-icon"><Database className="size-4" /></span>
                  <span>01 / Input</span>
                </div>
                <p className="automation-stage-title">Multi-modal ingestion</p>
                <div className="automation-input-list" aria-label="Business data, prompts and creative assets">
                  <span><Database className="size-3" /> Business data</span>
                  <span><FileText className="size-3" /> Prompts</span>
                  <span><Image className="size-3" /> Creative assets</span>
                </div>
              </div>

              <ArrowRight className="automation-connector" aria-hidden="true" />

              <div className="automation-stage automation-stage-engine">
                <div className="automation-stage-heading">
                  <span className="automation-stage-icon"><BrainCircuit className="size-4" /></span>
                  <span>02 / Intelligence</span>
                </div>
                <div className="automation-neural" aria-hidden="true">
                  <span className="automation-neural-orbit"><i /><i /><i /></span>
                  <BrainCircuit className="size-7" />
                </div>
                <p className="automation-stage-title">Adaptive reasoning hub</p>
                <p className="automation-stage-copy">Orchestrate models, logic and brand context.</p>
              </div>

              <ArrowRight className="automation-connector" aria-hidden="true" />

              <div className="automation-stage">
                <div className="automation-stage-heading">
                  <span className="automation-stage-icon"><Zap className="size-4" /></span>
                  <span>03 / Action</span>
                </div>
                <p className="automation-stage-title">Autonomous execution</p>
                <div className="automation-output-list" aria-label="Generated content, smart routing and connected actions">
                  <span><Check className="size-3" /> Generate content</span>
                  <span><Check className="size-3" /> Route intelligently</span>
                  <span><Check className="size-3" /> Connect actions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="automation-float automation-float-speed">
            <span className="automation-float-icon"><Sparkles className="size-4" /></span>
            <div>
              <p className="text-xl font-bold leading-none text-navy">85%</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/55">Workflow acceleration</p>
              <p className="mt-1 text-[8px] text-navy/45">Illustrative target</p>
            </div>
          </div>

          <div className="automation-float automation-float-guardrails">
            <span className="automation-float-icon automation-float-icon-shield"><ShieldCheck className="size-4" /></span>
            <div>
              <p className="text-sm font-bold text-navy">Multi-model orchestration</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/55">Enterprise guardrails</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
