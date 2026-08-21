"use client";

import { TypewriterEffectSmooth } from "@/components/accernity-ui/TypeWriterEffect";
import { Button } from "@/components/ui/button";
import { pricingPlans, typeWriterWords } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  BotIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  Code2Icon,
  GlobeIcon,
  LayersIcon,
  SendIcon,
  SparklesIcon,
  WorkflowIcon,
  ZapIcon,
} from "lucide-react";
import { FeaturesSection } from "./_components/Feature";
import { FeaturesGradient } from "./_components/FeaturesGradient";
import { HoverEffect } from "@/components/accernity-ui/CardHover";
import Link from "next/link";
import Navbar from "./_components/Navbar";

export default function HomeLandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-foreground selection:text-background dark bg-black text-foreground overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-6xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-white/[0.04] blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-foreground text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
          <SparklesIcon size={14} className="text-white" />
          <span>Next-Gen Visual Web Scraping & AI Automation</span>
        </div>

        {/* Dynamic Typewriter Title */}
        <div className="flex justify-center">
          <TypewriterEffectSmooth
            words={typeWriterWords}
            className="mb-2"
            cursorClassName="bg-foreground"
          />
        </div>

        <p className="max-w-2xl text-muted-foreground text-sm sm:text-base md:text-lg mb-8 leading-relaxed font-normal">
          Design, schedule, and execute multi-step web scraping pipelines with an intuitive drag-and-drop node graph. Powered by Puppeteer, React Flow, and OpenAI GPT.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Link href="/sign-in">
            <Button size="lg" className="rounded-full px-8 font-semibold bg-white text-black hover:bg-neutral-200 gap-2 h-12 shadow-lg shadow-white/10">
              Start Building for Free
              <ArrowRightIcon size={18} />
            </Button>
          </Link>
          <a href="#howItWorks">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-white/20 hover:bg-white/10 text-white h-12"
            >
              How It Works
            </Button>
          </a>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-medium flex items-center gap-1.5">
          <CheckCircle2Icon size={15} className="text-white" />
          New accounts receive 200 free credits upon login • No credit card required
        </p>

        {/* Interactive Canvas Mockup */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl border border-white/15 bg-neutral-950/80 p-3 sm:p-5 shadow-2xl backdrop-blur-md relative group">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="text-xs text-neutral-400 ml-2 font-mono">workflow-canvas.flow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 font-mono">
                Status: Published
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 text-left">
            {/* Mock Node 1 */}
            <div className="rounded-xl border border-white/15 bg-neutral-900/90 p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-3">
                <GlobeIcon size={16} />
                <span>1. Launch Browser</span>
              </div>
              <p className="text-[11px] text-neutral-400">https://news.ycombinator.com</p>
              <div className="mt-4 pt-2 border-t border-white/10 text-[10px] text-white font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Browser Ready
              </div>
            </div>

            {/* Mock Node 2 */}
            <div className="rounded-xl border border-white/15 bg-neutral-900/90 p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-3">
                <Code2Icon size={16} />
                <span>2. Page to HTML</span>
              </div>
              <p className="text-[11px] text-neutral-400">Captures dynamic client-rendered DOM</p>
              <div className="mt-4 pt-2 border-t border-white/10 text-[10px] text-white font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                184 KB Captured
              </div>
            </div>

            {/* Mock Node 3 */}
            <div className="rounded-xl border border-white/15 bg-neutral-900/90 p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-3">
                <BotIcon size={16} />
                <span>3. Extract via AI</span>
              </div>
              <p className="text-[11px] text-neutral-400">"Extract top 10 articles with score & URL"</p>
              <div className="mt-4 pt-2 border-t border-white/10 text-[10px] text-white font-mono flex items-center gap-1">
                <SparklesIcon size={12} />
                JSON Structured
              </div>
            </div>

            {/* Mock Node 4 */}
            <div className="rounded-xl border border-white/15 bg-neutral-900/90 p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-3">
                <SendIcon size={16} />
                <span>4. Webhook Delivery</span>
              </div>
              <p className="text-[11px] text-neutral-400">POST https://api.mycrm.com/leads</p>
              <div className="mt-4 pt-2 border-t border-white/10 text-[10px] text-white font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Status: 200 OK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 border-y border-white/10 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/10 text-white border border-white/15 shrink-0">
              <WorkflowIcon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 text-white">Visual Drag-and-Drop Canvas</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Wire nodes seamlessly. Parameter validation ensures zero broken connections before execution.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/10 text-white border border-white/15 shrink-0">
              <BotIcon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 text-white">AI Semantic Parsing</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Never fix broken CSS selectors again. Let GPT structure raw web content into clean JSON.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/10 text-white border border-white/15 shrink-0">
              <ClockIcon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 text-white">Automated Cron Scheduling</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Set and forget recurring jobs with automatic timezone handling and detailed run logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <SectionWrapper
        id="howItWorks"
        primaryTitle="How"
        secondaryTitle="It Works"
        subtitle="Turn any web data requirement into an automated pipeline in 3 simple steps"
      >
        <FeaturesGradient />
      </SectionWrapper>

      {/* Workflow Task Library */}
      <SectionWrapper
        id="scrapingFeatures"
        primaryTitle="Scraping & Automation"
        secondaryTitle="Task Modules"
        subtitle="A full suite of browser actions, parsers, and delivery nodes ready to plug into your workflow"
      >
        <FeaturesSection />
      </SectionWrapper>

      {/* Pricing Section */}
      <SectionWrapper
        id="pricing"
        className="w-full py-12 md:py-24"
        primaryTitle="Simple & Transparent"
        secondaryTitle="Pricing"
        subtitle="Pay only for the resources you consume. Top up credits anytime via Stripe."
      >
        <div className="flex gap-5 w-full mt-6">
          <HoverEffect items={[...pricingPlans]} />
        </div>
      </SectionWrapper>

      {/* Call to Action */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="rounded-3xl border border-white/15 bg-neutral-950 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to Automate Your Scraping?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join developers, data analysts, and growth teams building reliable, AI-powered web extraction workflows in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-in">
              <Button size="lg" className="rounded-full px-8 h-12 font-semibold bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10">
                Get Started with 200 Free Credits
                <ChevronRightIcon className="ml-1" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-black text-xs text-neutral-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white text-black">
              <ZapIcon size={14} className="fill-black" />
            </div>
            <span className="font-bold text-white text-sm">ScrapeFlow</span>
            <span>— Visual Web Scraping Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Vamshavardhan50/ScrapeFlow" target="_blank" rel="noreferrer" className="hover:text-white transition">
              GitHub
            </a>
            <Link href="/sign-in" className="hover:text-white transition">
              Dashboard
            </Link>
            <a href="#howItWorks" className="hover:text-white transition">
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionWrapper({
  children,
  className,
  id,
  primaryTitle,
  secondaryTitle,
  subtitle,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  primaryTitle?: string;
  secondaryTitle?: string;
  subtitle?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 box-border max-w-6xl mx-auto scroll-mt-[80px] px-4",
        className
      )}
      id={id}
    >
      {primaryTitle && (
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className="text-white">{primaryTitle}</span>{" "}
            <span className="text-neutral-400">{secondaryTitle}</span>
          </h2>
          {subtitle && (
            <p className="text-neutral-400 text-xs sm:text-sm md:text-base mt-2 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
