"use client";

import { type FormEvent } from "react";
import { BriefcaseBusiness, Code2, Download, Globe, Mail, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { type PortfolioData } from "../types";
import { SectionHeading } from "./section-heading";

type ContactSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function ContactSection({ data, theme }: ContactSectionProps) {
  const contacts = [
    { label: "Email", value: data.contact.email, href: data.contact.email ? `mailto:${data.contact.email}` : "", icon: Mail },
    { label: "Phone", value: data.contact.phone, href: data.contact.phone ? `tel:${data.contact.phone}` : "", icon: Phone },
    { label: "LinkedIn", value: data.socialLinks.linkedin, href: data.socialLinks.linkedin, icon: BriefcaseBusiness },
    { label: "GitHub", value: data.socialLinks.github, href: data.socialLinks.github, icon: Code2 },
    { label: "Portfolio", value: data.contact.website, href: data.contact.website, icon: Globe },
  ].filter((item) => item.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data.contact.email) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = `Portfolio inquiry from ${name || "a visitor"}`;
    const body = [
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
      "",
      message || "Hello, I came across your portfolio and would like to connect.",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${encodeURIComponent(
      data.contact.email
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Make it easy for people to reach out quickly"
            description="This final section keeps contact options visible and wraps them in a polished, easy-to-use presentation."
            theme={theme}
          />
          <div
            className={`mt-8 rounded-[1.8rem] border p-5 ${
              theme === "dark"
                ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
                : "border-slate-200 bg-white/92"
            }`}
          >
            <div className={`text-xs uppercase tracking-[0.24em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
              Reachability
            </div>
            <div className={`mt-3 text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Designed for fast outreach and easy follow-up
            </div>
            <p className={`mt-3 text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Keep the key destinations visible, make the resume one click away, and reduce friction for recruiters who want to move quickly.
            </p>
            {data.contact.resumeLink ? (
              <a
                href={data.contact.resumeLink}
                target="_blank"
                rel="noreferrer"
                className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  theme === "dark"
                    ? "bg-[linear-gradient(120deg,#f8fbff,#b9f3ff,#fcd889)] text-slate-950 hover:brightness-105"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                <Download className="h-4 w-4" />
                Open Resume
              </a>
            ) : null}
          </div>
          <div className="mt-8 grid gap-3">
            {contacts.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className={`flex items-center gap-4 rounded-[1.5rem] border px-4 py-4 transition ${
                    theme === "dark"
                      ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                      : "border-slate-200 bg-white/90 hover:bg-white"
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    theme === "dark"
                      ? "bg-cyan-300/10 text-cyan-100"
                      : "bg-cyan-50 text-cyan-900"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className={`text-xs uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      {item.label}
                    </div>
                    <div className={`mt-1 break-all text-sm font-medium leading-6 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className={`rounded-[1.8rem] border p-6 ${
            theme === "dark"
              ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
              : "border-slate-200 bg-white/95"
          }`}
        >
          <div className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            Contact Form
          </div>
          <div className="mt-5 grid gap-4">
            <input
              name="name"
              placeholder="Your Name"
              className={`h-12 rounded-xl border px-4 text-sm outline-none ${
                theme === "dark"
                  ? "border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <input
              name="email"
              placeholder="Your Email"
              className={`h-12 rounded-xl border px-4 text-sm outline-none ${
                theme === "dark"
                  ? "border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className={`min-h-[160px] rounded-xl border px-4 py-3 text-sm outline-none ${
                theme === "dark"
                  ? "border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <button
              type="submit"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${
                theme === "dark"
                  ? "bg-white text-slate-950"
                  : "bg-slate-950 text-white"
              }`}
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
