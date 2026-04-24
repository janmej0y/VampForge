import { escapeHtml } from "@/lib/export-utils";
import {
  categorizePortfolioSkills,
  portfolioStats,
  projectCaseStudy,
  sectionNavigation,
  splitPortfolioLines,
  templateIdentity,
  templateSectionNavigation,
} from "./intelligence";
import { type PortfolioData } from "./types";

export type PortfolioCodeFile = {
  path: string;
  content: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderLines(value: string, fallback: string) {
  const lines = splitPortfolioLines(value);
  if (!lines.length) return `<p class="copy">${escapeHtml(fallback)}</p>`;
  return lines.map((line) => `<p class="copy">${escapeHtml(line)}</p>`).join("");
}

function renderAnimatedName(value: string) {
  return Array.from(value || "Your Name")
    .map((character, index) => {
      const content = character === " " ? "&nbsp;" : escapeHtml(character);
      return `<span class="hero-char" style="--char-index:${index}">${content}</span>`;
    })
    .join("");
}

function renderLink(href: string, label: string, className: string) {
  if (!href) return "";
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer" class="${className}">${escapeHtml(label)}</a>`;
}

function renderSkillPills(skills: string[], className = "skill-pill") {
  return skills.map((skill) => `<span class="${className}">${escapeHtml(skill)}</span>`).join("");
}

function createPortfolioStyles() {
  return `
:root{--bg:#06101f;--panel:rgba(9,16,31,.74);--surface:rgba(255,255,255,.06);--line:rgba(255,255,255,.1);--text:#eef6ff;--muted:#97a8bf;--primary:#3ad7f4;--accent:#f5c768;--shadow:0 28px 90px rgba(2,6,23,.32)}
body.light{--bg:#edf5ff;--panel:rgba(255,255,255,.88);--surface:rgba(15,23,42,.045);--line:rgba(15,23,42,.1);--text:#0f172a;--muted:#55657d;--primary:#0f8ea7;--accent:#d99112;--shadow:0 28px 80px rgba(15,23,42,.12)}
body.template-orbit{--bg:#050713;--panel:rgba(11,15,35,.78);--primary:#a78bfa;--accent:#67e8f9;--shadow:0 32px 110px rgba(167,139,250,.18)}
body.template-terminal{--bg:#02070a;--panel:rgba(0,12,9,.84);--primary:#6ee7b7;--accent:#22d3ee;--shadow:0 32px 110px rgba(16,185,129,.14)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;color:var(--text);background:radial-gradient(circle at 10% 8%,rgba(58,215,244,.14),transparent 20%),radial-gradient(circle at 92% 14%,rgba(245,199,104,.12),transparent 18%),linear-gradient(180deg,var(--bg),color-mix(in srgb,var(--bg) 92%,#020617 8%));min-height:100vh;overflow-x:hidden}button,input,textarea,a{font:inherit}button,a{text-decoration:none;transition:transform .18s ease,border-color .18s ease,background-color .18s ease,color .18s ease,box-shadow .18s ease}
button:hover,a:hover{transform:translateY(-1px)}
body.has-custom-cursor,body.has-custom-cursor a,body.has-custom-cursor button{cursor:none}.vf-cursor{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;opacity:0;transform:translate3d(-50%,-50%,0);mix-blend-mode:screen;transition:opacity .18s ease}.vf-cursor-visible{opacity:1}.vf-cursor::before,.vf-cursor::after{content:"";position:absolute;inset:0}.template-nova .vf-cursor{width:48px;height:48px;border:1px solid rgba(251,191,36,.54);border-radius:999px;background:rgba(103,232,249,.08);box-shadow:0 0 34px rgba(34,211,238,.28)}.template-nova .vf-cursor::after{left:50%;top:50%;width:96px;height:1px;background:linear-gradient(90deg,rgba(103,232,249,.8),transparent);transform-origin:left center;animation:cursor-sweep 1.8s ease-in-out infinite}.template-orbit .vf-cursor{width:66px;height:66px;border:1px solid rgba(103,232,249,.72);border-radius:999px;background:rgba(167,139,250,.1);box-shadow:0 0 48px rgba(103,232,249,.34)}.template-orbit .vf-cursor::after{inset:-10px;border:1px solid rgba(196,181,253,.36);border-radius:inherit;animation:cursor-orbit 2.4s linear infinite}.template-terminal .vf-cursor{width:16px;height:28px;border:1px solid rgba(209,250,229,.8);border-radius:4px;background:rgba(110,231,183,.24);box-shadow:0 0 30px rgba(110,231,183,.46)}.template-terminal .vf-cursor::after{left:50%;top:100%;width:1px;height:34px;background:rgba(110,231,183,.68);animation:cursor-scan .9s ease-in-out infinite}
.ambient-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:74px 74px;mask-image:radial-gradient(circle at center,black 40%,transparent 90%);opacity:.35}
.bg-orb{position:fixed;border-radius:999px;filter:blur(70px);pointer-events:none;opacity:.65;animation:float-orb 14s ease-in-out infinite}.orb-a{left:-60px;top:110px;width:260px;height:260px;background:rgba(58,215,244,.16)}.orb-b{right:-70px;top:180px;width:300px;height:300px;background:rgba(245,199,104,.14);animation-delay:-4s}.orb-c{left:30%;bottom:-110px;width:320px;height:320px;background:rgba(96,165,250,.1);animation-delay:-8s}
.portfolio-shell{position:relative;z-index:1;max-width:1240px;margin:0 auto;padding:18px 16px 40px}.panel{border:1px solid var(--line);background:radial-gradient(circle at top left,rgba(58,215,244,.08),transparent 26%),radial-gradient(circle at bottom right,rgba(245,199,104,.07),transparent 24%),var(--panel);box-shadow:var(--shadow);backdrop-filter:blur(22px)}
.site-nav{position:sticky;top:16px;z-index:60;display:grid;gap:0;border-radius:26px;transition:transform .28s ease,opacity .28s ease}.site-nav.is-hidden{transform:translateY(-140%);opacity:0;pointer-events:none}.site-nav-top{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 16px}.site-nav-links{display:flex;gap:10px;overflow-x:auto;padding:0 16px 14px;scrollbar-width:none}.site-nav-links::-webkit-scrollbar{display:none}.brand{display:inline-flex;align-items:center;gap:12px;border:0;background:transparent;color:var(--text);cursor:pointer;text-align:left}.brand-mark{display:grid;place-items:center;width:46px;height:46px;border-radius:18px;background:linear-gradient(135deg,var(--primary),var(--accent));color:#06101f;font-weight:800;box-shadow:0 18px 40px rgba(58,215,244,.18)}.brand strong,.site-footer strong{display:block;font-size:16px}.brand small{display:block;margin-top:2px;color:var(--muted);font-size:12px}
.nav-links,.nav-actions,.footer-links,.hero-actions,.hero-mini-grid,.skill-pill-row,.project-links{display:flex;flex-wrap:wrap;gap:10px}.nav-link,.icon-pill,.badge-link,.skill-pill,.grade-pill{border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:999px;padding:10px 14px;cursor:pointer}.nav-link.is-active{background:linear-gradient(135deg,rgba(58,215,244,.18),rgba(245,199,104,.12));border-color:rgba(58,215,244,.28)}.icon-pill-solid,.cta-solid,.badge-link-solid{background:linear-gradient(135deg,#fff,#dff8ff);color:#04111d;border-color:transparent}body.light .icon-pill-solid,body.light .cta-solid,body.light .badge-link-solid{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff}
.site-main{display:grid;gap:20px;margin-top:20px}section[id]{scroll-margin-top:120px}.hero,.section,.site-footer{border-radius:34px}.hero{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr);gap:24px;padding:34px;overflow:hidden}.eyebrow,.section-eyebrow,.meta-kicker{display:inline-flex;align-items:center;font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--primary)}.hero-name{margin:18px 0 0;font-size:clamp(48px,6vw,76px);line-height:.96;letter-spacing:-.06em}.hero-char{display:inline-block;opacity:0;transform:translateY(26px) rotate(5deg);animation:reveal-char .68s cubic-bezier(.2,.9,.2,1) forwards;animation-delay:calc(var(--char-index) * 38ms)}.hero-role{margin:16px 0 0;font-size:22px;color:color-mix(in srgb,var(--text) 80%,var(--primary) 20%)}.hero-summary{margin-top:20px;max-width:760px}.copy,.section-copy,.info-card p,.site-footer p,.contact-card span{color:var(--muted);line-height:1.8}.copy{margin:0}.hero-actions{margin-top:24px}.cta{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 18px;border-radius:16px;border:1px solid var(--line);background:var(--surface);color:var(--text);font-weight:700}
body.template-orbit .hero-name{background:linear-gradient(110deg,#fff,#a78bfa,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent}body.template-orbit .hero,body.template-orbit .section{border-radius:46px}body.template-terminal .hero-name{font-family:Consolas,monospace;text-shadow:0 0 24px rgba(110,231,183,.35)}body.template-terminal .hero,body.template-terminal .section,body.template-terminal .site-footer{border-radius:22px;border-color:rgba(110,231,183,.22)}body.template-terminal .eyebrow::before{content:"$ ";color:var(--accent)}body.template-terminal .cta{text-transform:lowercase;border-color:rgba(110,231,183,.28)}
.orbit-stage{position:relative;min-height:620px;padding:42px;overflow:hidden;border-radius:46px}.orbit-stage::before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 22% 18%,rgba(103,232,249,.22),transparent 26%),radial-gradient(circle at 82% 24%,rgba(167,139,250,.26),transparent 28%),linear-gradient(180deg,#050713,#090d1f 55%,#050713);animation:orbit-breathe 9s ease-in-out infinite}.orbit-ring{position:absolute;border:1px dashed rgba(103,232,249,.24);border-radius:999px;animation:spin-soft 28s linear infinite}.orbit-ring-a{inset:120px 12% auto auto;width:420px;height:420px}.orbit-ring-b{right:34px;top:110px;width:250px;height:250px;animation-duration:18s;animation-direction:reverse}.orbit-copy,.orbit-visual,.terminal-window,.terminal-section{position:relative;z-index:2}.orbit-hero{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.02fr) minmax(320px,.98fr);gap:28px;align-items:center}.orbit-kicker{display:inline-flex;border:1px solid rgba(103,232,249,.26);background:rgba(103,232,249,.1);border-radius:999px;padding:10px 14px;color:#cffafe;font-size:11px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;animation:neon-pulse 4.2s ease-in-out infinite}.orbit-title{margin:22px 0 0;font-size:clamp(50px,7vw,92px);line-height:.9;letter-spacing:-.07em;background:linear-gradient(110deg,#fff,#c4b5fd,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent}.orbit-role{font-size:22px;color:#cffafe}.orbit-summary{max-width:760px;color:#cbd5e1;line-height:1.85}.orbit-actions,.orbit-skills,.terminal-actions,.terminal-stack{display:flex;flex-wrap:wrap;gap:12px}.orbit-button{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 18px;border-radius:18px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff;font-weight:800}.orbit-button-solid{background:#a5f3fc;color:#06101f;border-color:transparent}.orbit-visual{min-height:440px}.orbit-avatar{position:absolute;left:50%;top:50%;display:grid;place-items:center;width:290px;height:290px;transform:translate(-50%,-50%);border-radius:54px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(135deg,var(--primary),var(--accent));color:#06101f;font-size:76px;font-weight:900;box-shadow:0 32px 110px rgba(103,232,249,.22);animation:orbit-avatar-float 7s ease-in-out infinite;overflow:hidden}.orbit-avatar img{width:100%;height:100%;object-fit:cover;object-position:top center}.orbit-float{position:absolute;z-index:3;max-width:230px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:rgba(2,6,23,.72);backdrop-filter:blur(18px);padding:14px 16px;color:#e0f2fe;box-shadow:0 20px 60px rgba(2,6,23,.28);animation:badge-float 6s ease-in-out infinite}.orbit-float strong{display:block;margin-top:5px;color:#fff}.orbit-float-a{right:4%;top:24%;animation-delay:-1s}.orbit-float-b{left:2%;bottom:22%;animation-delay:-3s}.orbit-grid{position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:28px}.orbit-card{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.11);border-radius:30px;background:rgba(255,255,255,.06);padding:24px;backdrop-filter:blur(18px);transition:transform .26s ease,border-color .26s ease}.orbit-card::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,.14),transparent);transform:translateX(-120%);animation:sweep 6s ease-in-out infinite}.orbit-card:hover{transform:translateY(-8px) rotate(.5deg);border-color:rgba(103,232,249,.32)}.orbit-card h3{margin:12px 0 0;font-size:22px}.orbit-card p{color:#cbd5e1;line-height:1.75}.orbit-section{position:relative;overflow:hidden;border-radius:42px;padding:34px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.055);box-shadow:0 28px 90px rgba(2,6,23,.26);backdrop-filter:blur(18px)}
.orbit-project-visual{position:relative;height:170px;margin:-10px -10px 18px;overflow:hidden;border-radius:22px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(135deg,rgba(103,232,249,.2),rgba(167,139,250,.18),rgba(5,7,19,.35))}.orbit-project-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,.2),transparent);transform:translateX(-120%);animation:sweep 5s ease-in-out infinite}.orbit-project-visual img{width:100%;height:100%;object-fit:cover;filter:saturate(1.12) contrast(1.05);transition:transform .5s ease}.orbit-card:hover .orbit-project-visual img{transform:scale(1.08)}.orbit-constellation{position:absolute;inset:0;overflow:hidden;border-radius:46px}.orbit-constellation-canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.78}.orbit-visual-frame{position:absolute;inset:0;border-radius:46px;border:1px solid rgba(255,255,255,.08);background:radial-gradient(circle at center,rgba(103,232,249,.08),transparent 48%)}
.terminal-shell{font-family:Consolas,Monaco,monospace;color:#d1fae5;background:#02070a}.terminal-matrix-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;opacity:.22;z-index:0}.terminal-shell::before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(rgba(16,185,129,.06) 1px,transparent 1px);background-size:100% 4px;z-index:0}.terminal-shell::after{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 18% 10%,rgba(16,185,129,.22),transparent 26%),radial-gradient(circle at 82% 18%,rgba(34,211,238,.16),transparent 24%);z-index:0}.terminal-main{position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:18px 16px 40px}.terminal-nav{position:sticky;top:16px;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:18px;border:1px solid rgba(110,231,183,.22);border-radius:22px;background:rgba(0,12,9,.82);padding:14px 16px;backdrop-filter:blur(18px);box-shadow:0 0 70px rgba(16,185,129,.08)}.terminal-links{display:flex;flex-wrap:wrap;gap:8px}.terminal-link,.terminal-button{border:1px solid rgba(110,231,183,.24);border-radius:13px;background:rgba(16,185,129,.08);color:#d1fae5;padding:10px 12px;font-weight:800}.terminal-button-solid{background:rgba(110,231,183,.2);box-shadow:0 0 28px rgba(16,185,129,.14)}.terminal-window{margin-top:20px;border:1px solid rgba(110,231,183,.22);border-radius:28px;background:rgba(0,0,0,.36);box-shadow:0 0 90px rgba(16,185,129,.12);overflow:hidden}.terminal-bar{display:flex;gap:8px;border-bottom:1px solid rgba(110,231,183,.16);padding:14px 16px}.terminal-dot{width:12px;height:12px;border-radius:999px}.terminal-dot-red{background:#f87171}.terminal-dot-amber{background:#fbbf24}.terminal-dot-green{background:#6ee7b7}.terminal-hero{padding:34px}.terminal-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,.42fr);gap:28px;align-items:center}.terminal-command{display:block;color:#a7f3d0;line-height:1.9;opacity:0;transform:translateX(-12px);animation:terminal-in .55s ease forwards;animation-delay:calc(var(--command-index) * 180ms)}.terminal-command::before{content:"$ ";color:#67e8f9}.terminal-title{margin:28px 0 0;font-size:clamp(42px,6vw,78px);line-height:.95;letter-spacing:-.04em;color:#fff;text-shadow:0 0 26px rgba(110,231,183,.34)}.terminal-cursor{display:inline-block;animation:blink 1s step-end infinite}.terminal-summary{max-width:850px;color:rgba(209,250,229,.74);line-height:1.85}.terminal-photo-card{position:relative;min-height:330px;border:1px solid rgba(110,231,183,.2);border-radius:26px;background:linear-gradient(180deg,rgba(16,185,129,.08),rgba(0,0,0,.32));box-shadow:0 0 80px rgba(16,185,129,.12);overflow:hidden}.terminal-photo-card::before{content:"";position:absolute;inset:14px;border:1px dashed rgba(103,232,249,.28);border-radius:22px;animation:terminal-scan 3.2s linear infinite}.terminal-photo-card::after{content:"";position:absolute;left:0;right:0;top:-30%;height:38%;background:linear-gradient(180deg,transparent,rgba(110,231,183,.16),transparent);animation:terminal-scanline 4s ease-in-out infinite}.terminal-photo,.terminal-photo-fallback{position:absolute;inset:34px;display:grid;place-items:center;border-radius:20px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.45);color:#67e8f9;font-size:54px;font-weight:900;overflow:hidden;text-shadow:0 0 24px rgba(103,232,249,.36)}.terminal-photo{width:calc(100% - 68px);height:calc(100% - 68px);object-fit:cover}.terminal-boot-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:20px}.terminal-boot{border:1px solid rgba(110,231,183,.14);border-radius:14px;background:rgba(0,0,0,.34);padding:11px;color:rgba(209,250,229,.8);font-size:12px;animation:neon-pulse 3s ease-in-out infinite}.terminal-section{margin-top:18px;border:1px solid rgba(110,231,183,.18);border-radius:24px;background:rgba(0,0,0,.28);padding:26px}.terminal-section h2{margin:10px 0 0;color:#fff;font-size:28px}.terminal-kicker{color:#67e8f9;text-transform:uppercase;letter-spacing:.22em;font-size:11px;font-weight:900}.terminal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px}.terminal-card{border:1px solid rgba(110,231,183,.16);border-radius:18px;background:rgba(16,185,129,.055);padding:18px;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.terminal-card:hover{transform:translateX(6px);border-color:rgba(110,231,183,.42);box-shadow:0 0 35px rgba(16,185,129,.1)}.terminal-card h3{margin:8px 0 0;color:#fff}.terminal-card p{color:rgba(209,250,229,.72);line-height:1.75}.terminal-chip{border:1px solid rgba(110,231,183,.18);border-radius:999px;background:rgba(16,185,129,.08);color:#d1fae5;padding:7px 10px;font-size:12px;font-weight:800}.terminal-timeline{display:grid;gap:14px;margin-top:20px}.terminal-record{border-left:2px solid rgba(103,232,249,.42);padding:4px 0 4px 18px}
.hero-mini-grid{margin-top:24px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.mini-card,.stat-card,.info-card,.skill-card,.contact-card,.contact-form,.timeline-panel,.project-card,.profile-card{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border-radius:26px}.mini-card{padding:16px}.mini-card span,.stat-card span,.info-card span,.skill-topline span,.contact-card span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.22em;color:var(--muted)}.mini-card strong,.stat-card strong,.skill-topline strong,.contact-card strong,.info-card h3,.project-content h3,.timeline-panel h3,.contact-form h3{display:block;margin-top:10px;font-size:20px}
body.template-nova .panel,body.template-nova .mini-card,body.template-nova .stat-card,body.template-nova .info-card,body.template-nova .skill-card,body.template-nova .contact-card,body.template-nova .contact-form,body.template-nova .timeline-panel,body.template-nova .project-card,body.template-nova .profile-card{border-color:transparent;background:transparent;box-shadow:none;backdrop-filter:none}body.template-nova .section,body.template-nova .hero,body.template-nova .site-footer{border-radius:0;border-top:1px solid var(--line);border-bottom:0;border-left:0;border-right:0}body.template-nova .project-card{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:22px;align-items:stretch}body.template-nova .project-visual{height:100%;min-height:280px;border-radius:28px}body.template-nova .project-content{padding:10px 0 10px 0}body.template-nova .mini-card,body.template-nova .stat-card,body.template-nova .info-card,body.template-nova .skill-card,body.template-nova .contact-card{border-left:2px solid color-mix(in srgb,var(--primary) 42%,transparent);border-radius:0;padding-left:18px}
body.template-orbit .orbit-card,body.template-orbit .orbit-section{border-color:transparent;background:transparent;box-shadow:none;backdrop-filter:none}body.template-orbit .orbit-section{border-top:1px solid rgba(255,255,255,.1);border-radius:0}body.template-orbit .orbit-card{border-left:1px solid rgba(103,232,249,.3);border-radius:0;padding-left:18px}body.template-orbit .orbit-project-visual{border-radius:30px}
body.template-terminal .terminal-card,body.template-terminal .terminal-section,body.template-terminal .contact-form{border-color:rgba(110,231,183,.12);background:transparent;box-shadow:none}body.template-terminal .terminal-section{border-left:0;border-right:0;border-bottom:0;border-radius:0}body.template-terminal .terminal-card{border-top:0;border-right:0;border-bottom:0;border-radius:0}
.hero-side{display:grid;gap:16px}.profile-card{padding:22px}.photo-shell{position:relative;display:grid;place-items:center;min-height:360px}.photo-orbit{position:absolute;width:300px;height:300px;border-radius:999px;border:1px dashed rgba(58,215,244,.3);animation:spin-soft 18s linear infinite}.profile-photo,.profile-fallback{position:relative;z-index:1;width:240px;height:300px;border-radius:36px;object-fit:cover;object-position:top center;border:1px solid rgba(255,255,255,.12);box-shadow:0 26px 80px rgba(2,6,23,.32);animation:photo-float 7s ease-in-out infinite}.profile-fallback{display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--accent));color:#04111d;font-size:72px;font-weight:800}.photo-badge{position:absolute;z-index:2;max-width:200px;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(10,16,29,.8);color:#eef6ff;font-size:12px;text-align:center;backdrop-filter:blur(18px);animation:badge-float 6s ease-in-out infinite}body.light .photo-badge{background:rgba(255,255,255,.82);color:#0f172a}.badge-top{top:34px;right:8px}.badge-bottom{bottom:26px;left:0;animation-delay:-3s}
.hero-stats,.stats-grid,.grid-two,.grid-three,.projects-grid,.contact-grid{display:grid;gap:14px}.hero-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.stat-card{padding:18px}.stat-card strong{font-size:30px}.stat-card p{margin:10px 0 0;color:var(--muted);line-height:1.7}.section{padding:30px}.section-head{max-width:780px}.section-head h2{margin:14px 0 0;font-size:36px;line-height:1.08}.section-copy{margin-top:12px}.about-grid,.contact-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.92fr);gap:18px;margin-top:24px}.stack-list{display:grid;gap:14px}.info-card{padding:22px}.info-card-strong{position:relative;overflow:hidden}.info-card-strong::before{content:"";position:absolute;inset:-40% auto auto 52%;width:180px;height:180px;border-radius:999px;background:rgba(58,215,244,.08);filter:blur(18px)}.stats-grid,.grid-two{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-three{grid-template-columns:repeat(3,minmax(0,1fr))}
.skill-card{padding:22px}.skill-topline{display:flex;align-items:start;justify-content:space-between;gap:16px}.skill-meter-label{font-size:13px;font-weight:700;color:var(--primary)}.progress-track{margin-top:18px;height:9px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--primary),#8ee7ff,var(--accent));background-size:200% 100%;animation:pulse-line 4s linear infinite}.skill-pill-row{margin-top:18px}.skill-pill,.grade-pill{font-size:12px;font-weight:700}
.projects-grid{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:24px}.project-card{overflow:hidden}.project-visual{position:relative;overflow:hidden;height:252px}.project-gradient,.project-visual::after{position:absolute;inset:0}.project-gradient{background:linear-gradient(135deg,rgba(58,215,244,.34),rgba(245,199,104,.18),rgba(15,23,42,.4))}.project-visual::after{content:"";background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);transform:translateX(-120%);animation:sweep 5.6s ease-in-out infinite}.project-visual img{width:100%;height:100%;object-fit:cover;transition:transform .48s ease}.project-card:hover .project-visual img{transform:scale(1.06)}.project-content{padding:24px}.project-top,.timeline-head{display:flex;justify-content:space-between;align-items:start;gap:16px}.project-copy{display:grid;gap:10px;margin-top:18px}.case-study-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}.case-study-card{border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.045);padding:14px}.case-study-card span{display:block;color:var(--primary);font-size:10px;font-weight:800;letter-spacing:.22em;text-transform:uppercase}.case-study-card p{margin:8px 0 0;color:var(--muted);font-size:12px;line-height:1.55}.badge-link{font-size:12px;font-weight:700}
.timeline{position:relative;margin-top:24px;padding-left:34px}.timeline::before{content:"";position:absolute;left:11px;top:10px;bottom:10px;width:1px;background:var(--line)}.timeline-card{position:relative;padding-left:18px}.timeline-card+.timeline-card{margin-top:20px}.timeline-dot{position:absolute;left:-2px;top:26px;width:18px;height:18px;border-radius:999px;background:linear-gradient(135deg,var(--primary),var(--accent));box-shadow:0 0 0 6px rgba(58,215,244,.08)}.timeline-panel{padding:22px}
.contact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.contact-card{padding:18px}.contact-card strong{display:block;margin-top:10px;font-size:20px;line-height:1.5;overflow-wrap:anywhere}.contact-form{display:grid;gap:14px;padding:24px}.field{width:100%;min-height:52px;padding:14px 16px;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--text);outline:none}.field::placeholder{color:var(--muted)}.field-area{min-height:180px;resize:vertical}.site-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px;padding:24px 28px}.footer-links{justify-content:flex-end}.reveal{opacity:0;transform:translateY(24px);transition:opacity .72s ease,transform .72s ease}.reveal-visible{opacity:1;transform:translateY(0)}
@keyframes reveal-char{to{opacity:1;transform:translateY(0) rotate(0deg)}}@keyframes float-orb{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(18px,-18px,0) scale(1.05)}}@keyframes photo-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-12px,0)}}@keyframes orbit-avatar-float{0%,100%{transform:translate(-50%,-50%) translate3d(0,0,0)}50%{transform:translate(-50%,-50%) translate3d(0,-14px,0) rotate(1.5deg)}}@keyframes badge-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-8px,0)}}@keyframes spin-soft{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes sweep{0%,100%{transform:translateX(-120%)}45%,55%{transform:translateX(120%)}}@keyframes pulse-line{from{background-position:200% 0}to{background-position:-200% 0}}@keyframes orbit-breathe{0%,100%{transform:scale(1);filter:saturate(1)}50%{transform:scale(1.03);filter:saturate(1.25)}}@keyframes neon-pulse{0%,100%{box-shadow:0 0 0 rgba(103,232,249,0)}50%{box-shadow:0 0 34px rgba(103,232,249,.24)}}@keyframes terminal-in{to{opacity:1;transform:translateX(0)}}@keyframes terminal-scan{from{clip-path:inset(0 0 88% 0)}50%{clip-path:inset(46% 0 38% 0)}to{clip-path:inset(88% 0 0 0)}}@keyframes terminal-scanline{0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(330px);opacity:.85}}@keyframes cursor-sweep{0%,100%{transform:rotate(-10deg) scaleX(.75);opacity:.45}50%{transform:rotate(16deg) scaleX(1.1);opacity:1}}@keyframes cursor-orbit{from{transform:rotate(0deg) scale(.9)}to{transform:rotate(360deg) scale(1.1)}}@keyframes cursor-scan{0%,100%{transform:scaleY(.2);opacity:.35}50%{transform:scaleY(1);opacity:1}}@keyframes blink{50%{opacity:0}}
@media (max-width:1040px){.site-nav-top,.site-footer,.project-top,.timeline-head{flex-direction:column;align-items:flex-start}.hero,.about-grid,.contact-layout,.projects-grid,.grid-three,.orbit-hero,.terminal-grid,.terminal-hero-grid,.orbit-grid,.case-study-grid{grid-template-columns:1fr}}@media (max-width:760px){.portfolio-shell,.terminal-main{padding:14px 12px 28px}.site-nav-top,.site-nav-links,.hero,.section,.site-footer,.orbit-stage,.terminal-hero,.terminal-section{padding:20px;border-radius:26px}.hero-mini-grid,.hero-stats,.grid-two,.contact-grid{grid-template-columns:1fr}.photo-shell{min-height:300px}.profile-photo,.profile-fallback{width:200px;height:252px}.photo-orbit{width:250px;height:250px}.orbit-visual{min-height:360px}.orbit-avatar{width:220px;height:220px;font-size:58px}.orbit-float{position:relative;left:auto;right:auto;top:auto;bottom:auto;margin-top:12px}.terminal-photo-card{min-height:270px}.terminal-nav{align-items:flex-start;flex-direction:column}.terminal-title,.orbit-title{word-break:break-word}}
`;
}

function createPortfolioScript() {
  return `
const root=document.body;
const siteNav=document.querySelector(".site-nav");
const toggle=document.getElementById("theme-toggle");
const contactForm=document.getElementById("contact-form");
const revealItems=Array.from(document.querySelectorAll("[data-reveal]"));
const navButtons=Array.from(document.querySelectorAll("[data-nav-target]"));
const navLinks=Array.from(document.querySelectorAll(".nav-link"));
function bootCustomCursor(){if(window.matchMedia("(pointer: coarse)").matches)return;const cursor=document.createElement("div");cursor.className="vf-cursor";document.body.appendChild(cursor);document.body.classList.add("has-custom-cursor");let tx=window.innerWidth/2,ty=window.innerHeight/2,cx=tx,cy=ty,visible=false;function tick(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cursor.style.transform="translate3d("+cx+"px,"+cy+"px,0) translate(-50%,-50%)";requestAnimationFrame(tick)}window.addEventListener("pointermove",(event)=>{tx=event.clientX;ty=event.clientY;if(!visible){visible=true;cursor.classList.add("vf-cursor-visible")}});window.addEventListener("pointerleave",()=>{visible=false;cursor.classList.remove("vf-cursor-visible")});tick();}
function setTheme(mode){root.classList.toggle("light",mode==="light");if(toggle)toggle.textContent=mode==="light"?"Dark Mode":"Light Mode";try{localStorage.setItem("portfolio-theme",mode)}catch{}}
function navigateTo(targetId){const section=document.getElementById(targetId);if(section){const top=Math.max(0,section.offsetTop-108);window.scrollTo({top,behavior:"smooth"})}}
toggle?.addEventListener("click",()=>setTheme(root.classList.contains("light")?"dark":"light"));
navButtons.forEach((button)=>button.addEventListener("click",()=>{const targetId=button.getAttribute("data-nav-target");if(targetId)navigateTo(targetId)}));
const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting)entry.target.classList.add("reveal-visible")});const active=entries.filter((entry)=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(active?.target?.id){navLinks.forEach((item)=>item.classList.toggle("is-active",item.getAttribute("data-nav-target")===active.target.id))}},{threshold:[.2,.45,.7]});
revealItems.forEach((item)=>observer.observe(item));
let lastY=window.scrollY;
function syncNav(){if(!siteNav)return;const currentY=window.scrollY;const nearTop=currentY<48;const movingUp=currentY<lastY;siteNav.classList.toggle("is-hidden",!nearTop&&!movingUp);lastY=currentY;}
window.addEventListener("scroll",syncNav,{passive:true});
syncNav();
contactForm?.addEventListener("submit",(event)=>{event.preventDefault();const email=contactForm.getAttribute("data-contact-email");if(!email)return;const formData=new FormData(contactForm);const name=String(formData.get("name")||"").trim();const sender=String(formData.get("email")||"").trim();const message=String(formData.get("message")||"").trim();const subject="Portfolio inquiry from "+(name||"a visitor");const body=[name?"Name: "+name:"",sender?"Email: "+sender:"","",message||"Hello, I came across your portfolio and would like to connect."].filter(Boolean).join("\\n");window.location.href="mailto:"+email+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);});
function bootOrbitCanvas(){const canvas=document.querySelector(".orbit-constellation-canvas");if(!canvas)return;const ctx=canvas.getContext("2d");const host=canvas.parentElement;let nodes=[];function resize(){const rect=host.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;canvas.style.width=rect.width+"px";canvas.style.height=rect.height+"px";ctx.setTransform(dpr,0,0,dpr,0,0);nodes=Array.from({length:36},(_,index)=>({angle:(index/36)*Math.PI*2,radius:70+(index%5)*28,speed:.003+(index%4)*.001,size:2+(index%3)}));}function draw(){const w=canvas.clientWidth;const h=canvas.clientHeight;const cx=w/2;const cy=h/2;ctx.clearRect(0,0,w,h);ctx.strokeStyle="rgba(103,232,249,.18)";ctx.lineWidth=1;[82,138,194].forEach((radius)=>{ctx.beginPath();ctx.ellipse(cx,cy,radius,radius*.44,Date.now()/9000,0,Math.PI*2);ctx.stroke();});nodes.forEach((node,index)=>{const t=Date.now()*node.speed+node.angle;const x=cx+Math.cos(t)*node.radius;const y=cy+Math.sin(t)*node.radius*.44+Math.sin(t*1.7)*16;ctx.fillStyle=index%3===0?"rgba(250,204,21,.9)":"rgba(103,232,249,.85)";ctx.beginPath();ctx.arc(x,y,node.size,0,Math.PI*2);ctx.fill();});requestAnimationFrame(draw);}resize();draw();window.addEventListener("resize",resize);}
function bootTerminalCanvas(){const canvas=document.querySelector(".terminal-matrix-canvas");if(!canvas)return;const ctx=canvas.getContext("2d");const glyphs="01{}[]<>/run build deploy";let drops=[];function resize(){const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=window.innerWidth*dpr;canvas.height=window.innerHeight*dpr;canvas.style.width=window.innerWidth+"px";canvas.style.height=window.innerHeight+"px";ctx.setTransform(dpr,0,0,dpr,0,0);drops=Array.from({length:Math.ceil(window.innerWidth/18)},()=>Math.random()*window.innerHeight/18);}function draw(){ctx.fillStyle="rgba(2,7,10,.13)";ctx.fillRect(0,0,window.innerWidth,window.innerHeight);ctx.fillStyle="rgba(110,231,183,.7)";ctx.font="13px Consolas, monospace";drops.forEach((drop,index)=>{const text=glyphs[Math.floor(Math.random()*glyphs.length)];ctx.fillText(text,index*18,drop*18);if(drop*18>window.innerHeight&&Math.random()>.975)drops[index]=0;drops[index]+=1;});requestAnimationFrame(draw);}resize();draw();window.addEventListener("resize",resize);}
bootOrbitCanvas();
bootTerminalCanvas();
bootCustomCursor();
let storedTheme="dark";try{storedTheme=localStorage.getItem("portfolio-theme")||"dark"}catch{}setTheme(storedTheme);
`;
}

export function createPortfolioFileName(data: PortfolioData) {
  return `${slugify(data.name || "portfolio") || "portfolio"}.html`;
}

export function createPortfolioCodeArchiveName(data: PortfolioData) {
  return `${slugify(data.name || "portfolio") || "portfolio"}-portfolio-code.zip`;
}

function renderPortfolioMarkup(data: PortfolioData) {
  if (data.template === "orbit") {
    return renderOrbitPortfolioMarkup(data);
  }

  if (data.template === "terminal") {
    return renderTerminalPortfolioMarkup(data);
  }

  const sections = sectionNavigation();
  const skills = categorizePortfolioSkills(data.skills);
  const stats = portfolioStats(data).slice(0, 4);
  const projects = data.projects.filter((project) => project.name || project.description);
  const experience = data.experience.filter((item) => item.company || item.role);
  const education = data.education.filter((item) => item.degree || item.institution);
  const achievements = data.achievements.filter((item) => item.title || item.description);
  const initials = (data.name || "VF")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `
<div class="ambient-grid" aria-hidden="true"></div>
<div class="bg-orb orb-a" aria-hidden="true"></div>
<div class="bg-orb orb-b" aria-hidden="true"></div>
<div class="bg-orb orb-c" aria-hidden="true"></div>
<div class="portfolio-shell">
  <nav class="site-nav panel">
    <div class="site-nav-top">
      <button class="brand" type="button" data-nav-target="home">
        <span class="brand-mark">${escapeHtml(initials)}</span>
        <span><strong>${escapeHtml(data.name || "Your Name")}</strong><small>${escapeHtml(
          data.title || "Developer Portfolio"
        )}</small></span>
      </button>
      <div class="nav-actions">
        <button type="button" id="theme-toggle" class="icon-pill">Dark Mode</button>
        ${data.contact.resumeLink ? renderLink(data.contact.resumeLink, "Resume", "icon-pill icon-pill-solid") : ""}
        ${renderLink(data.socialLinks.github, "GitHub", "icon-pill")}
        ${renderLink(data.socialLinks.linkedin, "LinkedIn", "icon-pill")}
      </div>
    </div>
    <div class="site-nav-links">
      ${sections
        .map(
          (item) =>
            `<button type="button" class="nav-link" data-nav-target="${item.id}">${escapeHtml(item.label)}</button>`
        )
        .join("")}
    </div>
  </nav>

  <main class="site-main">
    <section id="home" class="hero panel reveal" data-reveal>
      <div class="hero-copy">
        <span class="eyebrow">Personal portfolio</span>
        <h1 class="hero-name">${renderAnimatedName(data.name || "Your Name")}</h1>
        <p class="hero-role">${escapeHtml(data.title || "Full Stack Developer")}</p>
        <div class="hero-summary">
          ${renderLines(
            data.summary || data.about,
            "Add a stronger summary to introduce your positioning and product impact."
          )}
        </div>
        <div class="hero-actions">
          <a href="#projects" class="cta cta-solid">View Projects</a>
          ${data.contact.resumeLink ? renderLink(data.contact.resumeLink, "Download Resume", "cta") : ""}
          <a href="#contact" class="cta">Contact Me</a>
        </div>
        <div class="hero-mini-grid">
          <div class="mini-card"><span>Premium UI</span><strong>Startup-grade polish</strong></div>
          <div class="mini-card"><span>Motion</span><strong>Animated sections and interactions</strong></div>
          <div class="mini-card"><span>Clear Structure</span><strong>Fast scanning and clean hierarchy</strong></div>
        </div>
      </div>
      <aside class="hero-side">
        <div class="profile-card">
          <div class="photo-shell">
            <div class="photo-orbit"></div>
            ${
              data.profileImage
                ? `<img class="profile-photo" src="${escapeHtml(data.profileImage)}" style="object-position:50% ${data.profileImagePosition}%" alt="${escapeHtml(data.name || "Profile photo")}" />`
                : `<div class="profile-fallback">${escapeHtml(initials)}</div>`
            }
            <div class="photo-badge badge-top">Available for premium product teams</div>
            <div class="photo-badge badge-bottom">Frontend quality plus system thinking</div>
          </div>
          <div class="skill-pill-row">
            ${data.skills.slice(0, 6).map((skill) => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join("")}
          </div>
        </div>
        <div class="hero-stats">
          ${stats
            .map(
              (stat) => `<div class="stat-card"><span>${escapeHtml(stat.label)}</span><strong>${escapeHtml(stat.value)}</strong></div>`
            )
            .join("")}
        </div>
      </aside>
    </section>

    <section id="about" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">About</span>
        <h2>Professional story with premium product framing</h2>
        <p class="section-copy">This section introduces your direction quickly while the layout stays polished and premium.</p>
      </div>
      <div class="about-grid">
        <div class="stack-list">
          ${[
            ["Short Bio", data.about],
            ["Experience Summary", data.experienceSummary],
            ["Career Goals", data.careerGoals],
            ["Tech Focus", data.techFocus],
          ]
            .map(
              ([label, value]) =>
                `<article class="info-card"><span>${escapeHtml(label)}</span><p>${escapeHtml((value as string) || "Add builder content to strengthen this area.")}</p></article>`
            )
            .join("")}
        </div>
        <div class="stats-grid">
          ${portfolioStats(data)
            .slice(0, 4)
            .map(
              (stat) =>
                `<article class="stat-card"><span>${escapeHtml(stat.label)}</span><strong>${escapeHtml(stat.value)}</strong><p>Designed for quick scanning and clear hierarchy.</p></article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section id="skills" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">Skills</span>
        <h2>Category-based expertise with animated depth</h2>
        <p class="section-copy">Skills are grouped into clean clusters and displayed with animated progress rails.</p>
      </div>
      <div class="grid-two">
        ${skills
          .map(
            (category) => `
              <article class="skill-card">
                <div class="skill-topline">
                  <div><span>${escapeHtml(category.title)}</span><strong>${escapeHtml(String(category.skills.length))} key tools</strong></div>
                  <div class="skill-meter-label">${escapeHtml(String(category.progress))}%</div>
                </div>
                <div class="progress-track"><div class="progress-fill" style="width:${category.progress}%"></div></div>
                <div class="skill-pill-row">
                  ${category.skills.map((skill) => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section id="projects" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">Projects</span>
        <h2>High-trust project cards with motion-rich presentation</h2>
        <p class="section-copy">These cards feel closer to product case studies than a basic portfolio grid.</p>
      </div>
      <div class="projects-grid">
        ${projects
          .map(
            (project, index) => {
              const caseStudy = projectCaseStudy(project, index);

              return `
              <article class="project-card">
                <div class="project-visual">
                  ${project.imageUrl ? `<img src="${escapeHtml(project.imageUrl)}" alt="${escapeHtml(project.name || "Project image")}" />` : `<div class="project-gradient"></div>`}
                </div>
                <div class="project-content">
                  <div class="project-top">
                    <div><span class="meta-kicker">Featured Build</span><h3>${escapeHtml(project.name || "Untitled Project")}</h3></div>
                    <div class="project-links">
                      ${renderLink(project.githubLink, "GitHub", "badge-link")}
                      ${renderLink(project.liveLink, "Live Demo", "badge-link badge-link-solid")}
                    </div>
                  </div>
                  <div class="project-copy">${renderLines(project.description, "Add a stronger project description.")}</div>
                  <div class="skill-pill-row">
                    ${project.techStack.map((tech) => `<span class="skill-pill">${escapeHtml(tech)}</span>`).join("")}
                  </div>
                  <div class="case-study-grid">
                    ${[
                      ["Problem", caseStudy.problem],
                      ["Solution", caseStudy.solution],
                      ["Result", caseStudy.result],
                    ]
                      .map(
                        ([label, value]) =>
                          `<div class="case-study-card"><span>${escapeHtml(label)}</span><p>${escapeHtml(value)}</p></div>`
                      )
                      .join("")}
                  </div>
                </div>
              </article>
            `;
            }
          )
          .join("")}
      </div>
    </section>

    <section id="experience" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">Experience</span>
        <h2>Timeline-style experience with cleaner motion rhythm</h2>
        <p class="section-copy">A vertical flow makes company, scope, and outcomes easy to scan quickly.</p>
      </div>
      <div class="timeline">
        ${experience
          .map(
            (item) => `
              <article class="timeline-card">
                <div class="timeline-dot"></div>
                <div class="timeline-panel">
                  <div class="timeline-head">
                    <div><h3>${escapeHtml(item.role || "Role")}</h3><p class="copy">${escapeHtml(item.company || "Company")}</p></div>
                    <span class="meta-kicker">${escapeHtml(item.duration || "Duration")}</span>
                  </div>
                  <div class="project-copy">${renderLines(item.description, "Add stronger role context and measurable outcomes.")}</div>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section id="education" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">Education</span>
        <h2>Academic credentials presented with polished clarity</h2>
        <p class="section-copy">Education stays clean and premium instead of feeling like an afterthought.</p>
      </div>
      <div class="grid-two">
        ${education
          .map(
            (item) => `
              <article class="info-card info-card-strong">
                <span class="meta-kicker">${escapeHtml(item.year || "Year")}</span>
                <h3>${escapeHtml(item.degree || "Degree")}</h3>
                <p>${escapeHtml(item.institution || "Institution")}</p>
                <div class="grade-pill">${escapeHtml(item.grade || "Add a grade or academic distinction.")}</div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section id="achievements" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">Achievements</span>
        <h2>Certifications, awards, and momentum signals</h2>
        <p class="section-copy">Proof points are surfaced as premium cards that build trust without clutter.</p>
      </div>
      <div class="grid-three">
        ${achievements
          .map(
            (item) => `
              <article class="info-card info-card-strong">
                <span class="meta-kicker">${escapeHtml(item.category || "Achievement")}</span>
                <h3>${escapeHtml(item.title || "Achievement Title")}</h3>
                <p>${escapeHtml(item.description || "Add a short achievement description.")}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section id="contact" class="section panel reveal" data-reveal>
      <div class="section-head">
        <span class="section-eyebrow">Contact</span>
        <h2>Easy contact paths for collaborators and teams</h2>
        <p class="section-copy">The final section keeps every important action visible and easy to use.</p>
      </div>
      <div class="contact-layout">
        <div class="contact-grid">
          ${[
            ["Email", data.contact.email],
            ["Phone", data.contact.phone],
            ["Location", data.contact.location],
            ["Website", data.contact.website],
            ["LinkedIn", data.socialLinks.linkedin],
            ["GitHub", data.socialLinks.github],
          ]
            .filter(([, value]) => Boolean(value))
            .map(
              ([label, value]) =>
                `<article class="contact-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value as string)}</strong></article>`
            )
            .join("")}
        </div>
        <form id="contact-form" class="contact-form" data-contact-email="${escapeHtml(
          data.contact.email
        )}">
          <h3>Contact Form</h3>
          <input class="field" name="name" placeholder="Your Name" />
          <input class="field" name="email" placeholder="Your Email" />
          <textarea class="field field-area" name="message" placeholder="Your Message"></textarea>
          <button type="submit" class="cta cta-solid">Send Message</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="site-footer panel reveal" data-reveal>
    <div>
      <strong>${escapeHtml(data.name || "Your Name")}</strong>
      <p>Designed and developed with care.</p>
    </div>
    <div class="footer-links">
      ${["home", "projects", "experience", "contact"]
        .map(
          (item) =>
            `<button type="button" class="nav-link footer-link" data-nav-target="${item}">${escapeHtml(
              item.charAt(0).toUpperCase() + item.slice(1)
            )}</button>`
        )
        .join("")}
    </div>
  </footer>
</div>
`;
}

function createPortfolioReadme(data: PortfolioData) {
  return `# ${data.name || "Portfolio"} Portfolio Export

This ZIP contains a standalone version of your generated portfolio.

Files:
- index.html
- styles/main.css
- scripts/main.js

How to use:
1. Open index.html in a browser for a quick local preview.
2. Edit the HTML, CSS, or JS files to customize the portfolio later.
3. Upload the folder to any static hosting platform if you want a separate edited version.

Important:
- Any already hosted version will keep using the code that was previously deployed.
- Editing this downloaded ZIP later will not change the already deployed URL automatically.
`;
}

function renderOrbitPortfolioMarkup(data: PortfolioData) {
  const sections = templateSectionNavigation("orbit");
  const identity = templateIdentity("orbit");
  const stats = portfolioStats(data).slice(0, 4);
  const projects = data.projects.filter((project) => project.name || project.description);
  const experience = data.experience.filter((item) => item.company || item.role);
  const education = data.education.filter((item) => item.degree || item.institution);
  const achievements = data.achievements.filter((item) => item.title || item.description);
  const initials = (data.name || "VF")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `
<div class="ambient-grid" aria-hidden="true"></div>
<div class="portfolio-shell">
  <nav class="site-nav panel">
    <div class="site-nav-top">
      <button class="brand" type="button" data-nav-target="home">
        <span class="brand-mark">${escapeHtml(initials)}</span>
        <span><strong>${escapeHtml(data.name || "Your Name")}</strong><small>${escapeHtml(
          data.title || "Developer Portfolio"
        )}</small></span>
      </button>
      <div class="nav-actions">
        ${data.contact.resumeLink ? renderLink(data.contact.resumeLink, "Resume", "icon-pill icon-pill-solid") : ""}
        ${renderLink(data.socialLinks.github, "GitHub", "icon-pill")}
        ${renderLink(data.socialLinks.linkedin, "LinkedIn", "icon-pill")}
      </div>
    </div>
    <div class="site-nav-links">
      ${sections
        .map(
          (item) =>
            `<button type="button" class="nav-link" data-nav-target="${item.id}">${escapeHtml(item.label)}</button>`
        )
        .join("")}
    </div>
  </nav>

  <main class="site-main">
    <section id="home" class="orbit-stage panel reveal" data-reveal>
      <div class="orbit-constellation" aria-hidden="true">
        <canvas class="orbit-constellation-canvas"></canvas>
        <div class="orbit-visual-frame"></div>
      </div>
      <div class="orbit-ring orbit-ring-a" aria-hidden="true"></div>
      <div class="orbit-ring orbit-ring-b" aria-hidden="true"></div>
      <div class="orbit-hero">
        <div class="orbit-copy">
          <span class="orbit-kicker">${escapeHtml(identity.concept)}</span>
          <h1 class="orbit-title">${escapeHtml(data.name || "Your Name")}</h1>
          <p class="orbit-role">${escapeHtml(data.title || "Full Stack Developer")}</p>
          <div class="orbit-summary">
            ${renderLines(
              data.summary || data.about,
              "Add a stronger summary to introduce your positioning and product impact."
            )}
          </div>
          <div class="orbit-actions">
            <a href="#projects" class="orbit-button orbit-button-solid">View Projects</a>
            ${data.contact.resumeLink ? renderLink(data.contact.resumeLink, "Resume", "orbit-button") : ""}
            ${renderLink(data.socialLinks.github, "GitHub", "orbit-button")}
          </div>
        </div>
        <div class="orbit-visual">
          <div class="orbit-avatar">
            ${
              data.profileImage
                ? `<img src="${escapeHtml(data.profileImage)}" style="object-position:50% ${data.profileImagePosition}%" alt="${escapeHtml(data.name || "Profile photo")}" />`
                : escapeHtml(initials)
            }
          </div>
          <div class="orbit-float orbit-float-a"><span>Available for</span><strong>premium product teams</strong></div>
          <div class="orbit-float orbit-float-b"><span>Signal</span><strong>frontend quality plus system thinking</strong></div>
        </div>
      </div>
    </section>

    <section class="orbit-grid reveal" data-reveal>
      ${stats
        .map(
          (stat) =>
            `<article class="orbit-card"><span class="meta-kicker">${escapeHtml(stat.label)}</span><h3>${escapeHtml(stat.value)}</h3><p>Animated proof point designed for quick portfolio scanning.</p></article>`
        )
        .join("")}
    </section>

    <section id="about" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">About</span>
      <h2>Product-minded story with cinematic depth</h2>
      <div class="grid-two">
        ${[
          ["Short Bio", data.about],
          ["Experience Summary", data.experienceSummary],
          ["Career Goals", data.careerGoals],
          ["Tech Focus", data.techFocus],
        ]
          .map(
            ([label, value]) =>
              `<article class="orbit-card"><span class="meta-kicker">${escapeHtml(label)}</span><p>${escapeHtml((value as string) || "Add builder content to strengthen this area.")}</p></article>`
          )
          .join("")}
      </div>
    </section>

    <section id="skills" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">Skills</span>
      <h2>Floating stack signals</h2>
      <div class="orbit-skills">
        ${renderSkillPills(data.skills, "skill-pill")}
      </div>
    </section>

    <section id="projects" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">Projects</span>
      <h2>Motion-rich case study cards</h2>
      <div class="orbit-grid">
        ${projects
          .map(
            (project, index) => {
              const caseStudy = projectCaseStudy(project, index);

              return `
              <article class="orbit-card">
                <div class="orbit-project-visual">
                  ${project.imageUrl ? `<img src="${escapeHtml(project.imageUrl)}" alt="${escapeHtml(project.name || "Project image")}" />` : ""}
                </div>
                <span class="meta-kicker">Featured Build</span>
                <h3>${escapeHtml(project.name || "Untitled Project")}</h3>
                <p>${escapeHtml(project.description || "Add a stronger project description.")}</p>
                <div class="case-study-grid">
                  ${[
                    ["Problem", caseStudy.problem],
                    ["Impact", caseStudy.impact],
                    ["Result", caseStudy.result],
                  ]
                    .map(
                      ([label, value]) =>
                        `<div class="case-study-card"><span>${escapeHtml(label)}</span><p>${escapeHtml(value)}</p></div>`
                    )
                    .join("")}
                </div>
                <div class="orbit-skills">${renderSkillPills(project.techStack.slice(0, 5), "skill-pill")}</div>
                <div class="project-links">
                  ${renderLink(project.githubLink, "GitHub", "badge-link")}
                  ${renderLink(project.liveLink, "Live Demo", "badge-link badge-link-solid")}
                </div>
              </article>
            `;
            }
          )
          .join("")}
      </div>
    </section>

    <section id="experience" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">Experience</span>
      <h2>Experience orbit</h2>
      <div class="timeline">
        ${experience
          .map(
            (item) => `
              <article class="timeline-card">
                <div class="timeline-dot"></div>
                <div class="timeline-panel">
                  <div class="timeline-head">
                    <div><h3>${escapeHtml(item.role || "Role")}</h3><p class="copy">${escapeHtml(item.company || "Company")}</p></div>
                    <span class="meta-kicker">${escapeHtml(item.duration || "Duration")}</span>
                  </div>
                  <div class="project-copy">${renderLines(item.description, "Add stronger role context and measurable outcomes.")}</div>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section id="education" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">Education</span>
      <h2>Academic proof points</h2>
      <div class="grid-two">
        ${education
          .map(
            (item) =>
              `<article class="orbit-card"><span class="meta-kicker">${escapeHtml(item.year || "Year")}</span><h3>${escapeHtml(item.degree || "Degree")}</h3><p>${escapeHtml(item.institution || "Institution")}</p><span class="grade-pill">${escapeHtml(item.grade || "Grade")}</span></article>`
          )
          .join("")}
      </div>
    </section>

    <section id="achievements" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">Achievements</span>
      <h2>Momentum signals</h2>
      <div class="orbit-grid">
        ${achievements
          .map(
            (item) =>
              `<article class="orbit-card"><span class="meta-kicker">${escapeHtml(item.category || "Achievement")}</span><h3>${escapeHtml(item.title || "Achievement Title")}</h3><p>${escapeHtml(item.description || "Add a short achievement description.")}</p></article>`
          )
          .join("")}
      </div>
    </section>

    <section id="contact" class="orbit-section reveal" data-reveal>
      <span class="section-eyebrow">Contact</span>
      <h2>Open channel for teams and collaborators</h2>
      <div class="contact-layout">
        <div class="contact-grid">
          ${[
            ["Email", data.contact.email],
            ["Phone", data.contact.phone],
            ["Location", data.contact.location],
            ["Website", data.contact.website],
            ["LinkedIn", data.socialLinks.linkedin],
            ["GitHub", data.socialLinks.github],
          ]
            .filter(([, value]) => Boolean(value))
            .map(
              ([label, value]) =>
                `<article class="contact-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value as string)}</strong></article>`
            )
            .join("")}
        </div>
        <form id="contact-form" class="contact-form" data-contact-email="${escapeHtml(data.contact.email)}">
          <h3>Contact Form</h3>
          <input class="field" name="name" placeholder="Your Name" />
          <input class="field" name="email" placeholder="Your Email" />
          <textarea class="field field-area" name="message" placeholder="Your Message"></textarea>
          <button type="submit" class="cta cta-solid">Send Message</button>
        </form>
      </div>
    </section>
  </main>
</div>
`;
}

function renderTerminalPortfolioMarkup(data: PortfolioData) {
  const sections = templateSectionNavigation("terminal");
  const identity = templateIdentity("terminal");
  const skills = categorizePortfolioSkills(data.skills);
  const projects = data.projects.filter((project) => project.name || project.description);
  const experience = data.experience.filter((item) => item.company || item.role);
  const education = data.education.filter((item) => item.degree || item.institution);
  const achievements = data.achievements.filter((item) => item.title || item.description);
  const initials = (data.name || "VF")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const commands = [
    `whoami -> ${data.name || "developer"}`,
    `role -> ${data.title || "full-stack engineer"}`,
    `skills -> ${data.skills.slice(0, 5).join(", ") || "next.js, typescript"}`,
  ];

  return `
<div class="terminal-shell">
  <canvas class="terminal-matrix-canvas" aria-hidden="true"></canvas>
  <div class="terminal-main">
    <nav class="terminal-nav">
      <button class="brand" type="button" data-nav-target="home">
        <span><strong>${escapeHtml(data.name || "Your Name")}</strong><small>${escapeHtml(
          data.title || "Developer Portfolio"
        )}</small></span>
      </button>
      <div class="terminal-links">
        ${sections
          .map(
            (item) =>
              `<button type="button" class="terminal-link" data-nav-target="${item.id}">/${escapeHtml(item.label.toLowerCase())}</button>`
          )
          .join("")}
      </div>
    </nav>

    <main>
      <section id="home" class="terminal-window reveal" data-reveal>
        <div class="terminal-bar">
          <span class="terminal-dot terminal-dot-red"></span>
          <span class="terminal-dot terminal-dot-amber"></span>
          <span class="terminal-dot terminal-dot-green"></span>
        </div>
        <div class="terminal-hero">
          ${commands
            .map(
              (command, index) =>
                `<span class="terminal-command" style="--command-index:${index}">${escapeHtml(command)}</span>`
            )
            .join("")}
          <div class="terminal-boot-grid">
            ${[
              "boot portfolio.kernel",
              `load ${identity.concept}`,
              "status online",
            ]
              .map((item) => `<div class="terminal-boot">${escapeHtml(item)}</div>`)
              .join("")}
          </div>
          <div class="terminal-hero-grid">
            <div>
              <h1 class="terminal-title">${escapeHtml(data.name || "Your Name")}<span class="terminal-cursor">_</span></h1>
              <p class="terminal-summary">${escapeHtml(
                data.summary || data.about || "Add a stronger summary to introduce your positioning and product impact."
              )}</p>
              <div class="terminal-actions">
                ${data.contact.resumeLink ? renderLink(data.contact.resumeLink, "./download-resume", "terminal-button terminal-button-solid") : ""}
                ${renderLink(data.socialLinks.github, "git remote", "terminal-button")}
                <a href="#contact" class="terminal-button">./contact</a>
              </div>
            </div>
            <div class="terminal-photo-card" aria-label="Profile photo">
              ${
                data.profileImage
                  ? `<img class="terminal-photo" src="${escapeHtml(data.profileImage)}" style="object-position:50% ${data.profileImagePosition}%" alt="${escapeHtml(data.name || "Profile photo")}" />`
                  : `<div class="terminal-photo-fallback">${escapeHtml(initials)}</div>`
              }
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">cat about.md</span>
        <h2>Developer profile</h2>
        <div class="terminal-grid">
          ${[
            ["bio", data.about],
            ["experience", data.experienceSummary],
            ["goals", data.careerGoals],
            ["focus", data.techFocus],
          ]
            .map(
              ([label, value]) =>
                `<article class="terminal-card"><span class="terminal-kicker">${escapeHtml(label)}</span><p>${escapeHtml((value as string) || "Add builder content to strengthen this area.")}</p></article>`
            )
            .join("")}
        </div>
      </section>

      <section id="skills" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">ls ./skills</span>
        <h2>Stack map</h2>
        <div class="terminal-grid">
          ${skills
            .map(
              (category) =>
                `<article class="terminal-card"><span class="terminal-kicker">${escapeHtml(category.title)}</span><h3>${escapeHtml(String(category.progress))}% loaded</h3><div class="terminal-stack">${renderSkillPills(category.skills, "terminal-chip")}</div></article>`
            )
            .join("")}
        </div>
      </section>

      <section id="projects" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">git log --featured</span>
        <h2>Repositories and builds</h2>
        <div class="terminal-grid">
          ${projects
            .map(
              (project, index) => `
                <article class="terminal-card">
                  <span class="terminal-kicker">repo 0${index + 1}</span>
                  <h3>${escapeHtml(project.name || "Untitled Project")}</h3>
                  <p>${escapeHtml(project.description || "Add a stronger project description.")}</p>
                  <div class="terminal-stack">${renderSkillPills(project.techStack.slice(0, 5), "terminal-chip")}</div>
                  <div class="terminal-actions">
                    ${renderLink(project.githubLink, "source", "terminal-button")}
                    ${renderLink(project.liveLink, "live", "terminal-button terminal-button-solid")}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section id="experience" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">history --work</span>
        <h2>Experience timeline</h2>
        <div class="terminal-timeline">
          ${experience
            .map(
              (item) => `
                <article class="terminal-record">
                  <span class="terminal-kicker">${escapeHtml(item.duration || "Duration")}</span>
                  <h3>${escapeHtml(item.role || "Role")} @ ${escapeHtml(item.company || "Company")}</h3>
                  ${renderLines(item.description, "Add stronger role context and measurable outcomes.")}
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section id="education" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">cat education.json</span>
        <h2>Education</h2>
        <div class="terminal-grid">
          ${education
            .map(
              (item) =>
                `<article class="terminal-card"><span class="terminal-kicker">${escapeHtml(item.year || "Year")}</span><h3>${escapeHtml(item.degree || "Degree")}</h3><p>${escapeHtml(item.institution || "Institution")}</p><span class="terminal-chip">${escapeHtml(item.grade || "Grade")}</span></article>`
            )
            .join("")}
        </div>
      </section>

      <section id="achievements" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">grep -r achievements</span>
        <h2>Proof signals</h2>
        <div class="terminal-grid">
          ${achievements
            .map(
              (item) =>
                `<article class="terminal-card"><span class="terminal-kicker">${escapeHtml(item.category || "Achievement")}</span><h3>${escapeHtml(item.title || "Achievement Title")}</h3><p>${escapeHtml(item.description || "Add a short achievement description.")}</p></article>`
            )
            .join("")}
        </div>
      </section>

      <section id="contact" class="terminal-section reveal" data-reveal>
        <span class="terminal-kicker">ssh contact</span>
        <h2>Open a channel</h2>
        <div class="terminal-grid">
          ${[
            ["email", data.contact.email],
            ["phone", data.contact.phone],
            ["location", data.contact.location],
            ["website", data.contact.website],
            ["linkedin", data.socialLinks.linkedin],
            ["github", data.socialLinks.github],
          ]
            .filter(([, value]) => Boolean(value))
            .map(
              ([label, value]) =>
                `<article class="terminal-card"><span class="terminal-kicker">${escapeHtml(label)}</span><p>${escapeHtml(value as string)}</p></article>`
            )
            .join("")}
        </div>
        <form id="contact-form" class="contact-form" data-contact-email="${escapeHtml(data.contact.email)}">
          <h3>Contact Form</h3>
          <input class="field" name="name" placeholder="Your Name" />
          <input class="field" name="email" placeholder="Your Email" />
          <textarea class="field field-area" name="message" placeholder="Your Message"></textarea>
          <button type="submit" class="terminal-button terminal-button-solid">send --message</button>
        </form>
      </section>
    </main>
  </div>
</div>
`;
}

function renderPortfolioHtml(data: PortfolioData, inlineAssets: boolean) {
  const assetTags = inlineAssets
    ? `<style>${createPortfolioStyles()}</style>`
    : `<link rel="stylesheet" href="./styles/main.css" />`;
  const scriptTag = inlineAssets
    ? `<script>${createPortfolioScript()}</script>`
    : `<script src="./scripts/main.js" defer></script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(
    `${data.name || "Developer"} portfolio built with premium motion, polished sections, and clear personal branding.`
  )}" />
  <title>${escapeHtml(data.name || "Portfolio")}</title>
  ${assetTags}
</head>
<body class="template-${escapeHtml(data.template)}">
  ${renderPortfolioMarkup(data)}
  ${scriptTag}
</body>
</html>`;
}

export function createPortfolioCodeBundle(data: PortfolioData): PortfolioCodeFile[] {
  return [
    { path: "index.html", content: renderPortfolioHtml(data, false) },
    { path: "styles/main.css", content: createPortfolioStyles() },
    { path: "scripts/main.js", content: createPortfolioScript() },
    { path: "README.md", content: createPortfolioReadme(data) },
  ];
}

export function createPortfolioDocument(data: PortfolioData) {
  return renderPortfolioHtml(data, true);
}
