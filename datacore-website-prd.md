# Datacore Website: Product Requirements Document

**Version:** 1.0 (draft for review) | **Date:** 5 October 2026 | **Target launch:** within 2 weeks

> Items marked **(Proposed)** are my recommendations that you have not yet confirmed. Everything else comes from your answers.

---

## 1. Overview

**Product:** A single-page marketing and portfolio website for **Datacore**, a studio that builds AI solutions, web and app development, and systems and automation tools.

**Purpose:** Convert visiting agencies and partners into project or retainer inquiries by letting them browse proof of delivery (case studies with outcomes) and contact Datacore in one step.

**Design reference:** A dark-navy AI-systems agency landing page. The layout and palette are followed closely; all content, branding, imagery and project mockups are original to Datacore.

**Technical shape:** Static site (plain HTML, CSS, JavaScript, Bootstrap), hosted on GitHub Pages or Netlify, with Formspree for the contact form and a Google Calendar booking page for calls.

**Voice:** Studio brand ("we"), English only.

## 2. Goals & Objectives

**Primary goal:** Get visitors to browse the portfolio and then hire Datacore.

| # | Objective | How the site supports it |
|---|---|---|
| G1 | Make the portfolio the centerpiece | Projects carousel with outcome-led case study cards, placed high on the page |
| G2 | Build trust with agency buyers | Real stats, real client quotes, clear process, technical credibility |
| G3 | Make contacting Datacore frictionless | Form, booking link and direct links reachable from every screen |
| G4 | Launch fast without cutting credibility | Static build, 2-week scope, FAQ/Insights deferred to phase 2 |

**Non-goals (launch):** blog or Insights section, FAQ page, e-commerce or shop, multi-language support, a custom backend or CMS, public pricing, project detail pages.

## 3. Target Users

**Primary:** Agencies and partners outsourcing development work, both local (Kenya / East Africa) and international.

| Persona | Needs | What convinces them |
|---|---|---|
| Agency owner / account lead | A dependable partner for client builds | Case study outcomes, a clear process, a quick way to talk |
| Delivery lead / technical manager | Confidence in engineering quality and communication | Services framed as engineering capability, how work is run and handed over |

**Secondary (not designed for, but served by the same page):** startups and SMEs, collaborators, recruiters.

## 4. User Stories / Use Cases

1. As an agency owner, I want to see what Datacore does within seconds so I can decide whether it fits my needs.
2. As an agency owner, I want to browse real projects with outcomes so I can judge delivery quality.
3. As a delivery lead, I want to understand how a project runs (the process) so I know what working together looks like.
4. As a visitor, I want to know whether Datacore works on fixed-price projects or monthly retainers, without needing prices.
5. As a prospect, I want to book a call, send a message, or ping on WhatsApp, whichever I prefer.
6. As a visitor on mobile, I want the whole experience to work on my phone.
7. As Datacore, I want to see which projects get attention and which contact paths get used.

## 5. Functional Requirements

### Page structure (launch)

| Order | Section | Notes |
|---|---|---|
| 1 | Floating pill navbar | Launch links: Home, Services, Projects, Process, Contact. A "Book a call" pill CTA on the right |
| 2 | Hero | Left-aligned text block (eyebrow, headline "We build systems that just work.", subline, two CTAs) over the animated background-paths visual (see FR-2 and Hero layout in section 7) |
| 3 | Brand/stats split row | Brand statement card plus real stats and "Get in touch" block |
| 4 | Services grid | Four services (see FR-4) |
| 5 | Projects carousel | 4-6 case study cards |
| 6 | Process | 4 steps |
| 7 | Testimonial | 1-2 real client quotes |
| 8 | Final CTA | Contact options |
| 9 | Footer | Links, social icons, legal links |

**(Proposed)** The inspo's "Why us" split and stats glass band are folded into the stats row and process section to keep the page within the 2-week scope.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Floating translucent navbar with smooth-scroll anchors and a mobile collapse menu | P0 |
| FR-2 | Hero uses a **vanilla JS/CSS port** of the animated "Background Paths" component: two mirrored sets of 36 SVG paths animated in a slow loop, letter-by-letter title reveal, ghost-style CTA button with arrow. Recolored for the dark navy theme (light paths, soft blue title gradient). Honors `prefers-reduced-motion` by disabling the animation | P0 |
| FR-3 | Stats row with **real** figures only (e.g. projects delivered, services offered, clients/countries served, years building). No inflated numbers | P0 |
| FR-4 | Services grid, 2x2 or 4-up cards: AI solutions / integrations, Web development, App development, Systems & automation (Excel/VBA tools). Copy framed as engineering capability for agency partners | P0 |
| FR-5 | Projects carousel: 4-6 cards, each with thumbnail, category chip, title, short description and **a measurable outcome**. Horizontal scroll-snap with prev/next buttons; last card peeks to signal scrolling. Cards are display-only (no detail pages) | P0 |
| FR-6 | Process section: 4 numbered steps (Discover, Strategy, Build, Launch or equivalent), written as a partner collaboration model | P0 |
| FR-7 | Testimonial block showing 1-2 real client quotes with name and role. Layout adapts to one or two quotes (no empty columns) | P0 |
| FR-8 | Engagement-model line near the process or CTA: "Fixed-price projects or monthly retainers." No prices anywhere; messaging says "pricing on request" | P0 |
| FR-9 | Contact form via **Formspree**: name, email, company, message; client-side validation, success and error states, spam protection (honeypot) | P0 |
| FR-10 | "Book a call" link to a **Google Calendar booking page**, opened in a new tab; appears in the navbar, hero and final CTA | P0 |
| FR-11 | Direct contact links: WhatsApp (click-to-chat), email, phone. **(Proposed)** A floating contact rail as in the inspo, on desktop only | P1 |
| FR-12 | Footer with social links, short blurb, and links to Privacy Policy and Terms | P0 |
| FR-13 | **GA4** analytics with events: project card click, carousel next/prev, scroll to Projects section, scroll depth, form submit, booking click, WhatsApp click, email click | P0 |
| FR-14 | Cookie/consent notice gating GA4, plus a short Privacy Policy page | P0 |
| FR-15 | Basic SEO: title, meta description, Open Graph tags, favicon, sitemap and robots.txt | P1 |

## 6. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Hosting | Static hosting on GitHub Pages or Netlify; no server-side code. Note that Netlify Forms are not used because the form goes through Formspree |
| Performance | **(Proposed)** Lighthouse 90+ on mobile for Performance, Accessibility and SEO. Images compressed and lazy-loaded (WebP), fonts limited and preloaded, the hero animation kept lightweight (CSS-driven, paused when off-screen) |
| Responsiveness | Fully responsive from 360px phones to desktop; carousel and navbar tested on touch devices |
| Accessibility | WCAG 2.1 AA targets: sufficient contrast on dark sections, keyboard-navigable nav, carousel and form, visible focus states, alt text, reduced-motion support |
| Browser support | Latest two versions of Chrome, Safari, Firefox and Edge, plus iOS Safari and Android Chrome |
| Privacy & compliance | Consent before GA4 loads; privacy policy published. Confirm legal requirements for your markets yourself (I am not a lawyer) |
| Reliability | Form failure shows a fallback message with the email address |
| Maintainability | Single repo, design tokens in CSS variables, content kept in clearly separated HTML blocks so projects and quotes are easy to update |

## 7. Design Considerations

**Style:** Modern tech-agency look. Dark navy and indigo sections alternating with white ones, thin borders, soft shadows, small monospace labels.

**Section rhythm:** dark hero, white services, indigo projects, white process and testimonial, dark CTA, near-black footer.

**Palette (approximate; adopted from the inspo):**

| Role | Hex |
|---|---|
| Hero / footer | `#070B1F` |
| Brand card | `#0B2545` |
| Indigo bands | `#171B5C` |
| Light background | `#FFFFFF` / `#F7F8FA` |
| Body text (muted) | `#6B7280` |
| Badge background / text | `#CFEFEF` / `#2A9D9A` |
| Highlight on dark | `#8DB8FF` |
| Step accents | `#0B1240`, `#F26A2E`, `#1F8F7A`, `#9A86F0` |

**Typography (Proposed):** Space Grotesk for headings, Inter for body, IBM Plex Mono for eyebrows, badges and the nav CTA. Mixed-weight headings ("Systems that **power growth**") are a signature element.

**Signature components:** floating pill navbar, translucent glass stat cards, pill badges, service cards with icon tiles and hover lift, numbered colored process tiles, scroll-snap project carousel.

**Original assets required** (to avoid looking like a copy):

- Datacore logo and wordmark
- All copy, written for agency partners
- A hero visual or animation of your own (the animated paths cover this)
- 4-6 project screenshots or mockups of your own work
- Icons from an open library (e.g. Lucide)

## 8. Success Metrics

**Primary: portfolio engagement** (first 3 months)

- Project card clicks per visitor
- Carousel interaction rate (next/prev usage)
- Share of sessions that scroll to the Projects section
- Average scroll depth

**Secondary: inquiries**

- Contact form submissions
- Booking link clicks
- WhatsApp and email clicks

**Targets are not set yet.** I'd recommend capturing a 2-4 week baseline after launch and then setting targets against it.

## 9. Delivery Plan (Proposed)

| Days | Milestone |
|---|---|
| 1-3 | Content collection (project outcomes, screenshots, quotes, stats), design tokens, wireframe |
| 4-8 | Build all sections, hero port, carousel, responsive pass |
| 9-10 | Formspree, booking link, GA4 events and consent notice, privacy page |
| 11-12 | QA: accessibility, Lighthouse, cross-browser and device checks |
| 13-14 | Deploy, custom domain/SSL, final checks, launch |

**Biggest risk:** content readiness (project outcomes, screenshots and the client quotes). Collect these first.

## 10. Open Questions

1. **Brand:** Is Datacore a rebrand of D&B Studio, or a separate brand? Do you have a logo and domain ready?
2. **Stats:** Which real figures will go in the stats row?
3. **Case studies:** Which 4-6 projects, and what is each project's headline outcome?
4. **Testimonials:** Who are the 1-2 quoted clients, and have they approved publication?
5. **Hero copy:** What are the headline and subline for agency partners?
6. **Hosting and domain:** GitHub Pages or Netlify, and which domain?
7. **Contact details:** WhatsApp number, email, phone, and whether the floating contact rail should show.
8. **Legal pages:** Who writes the Privacy Policy and Terms?
9. **Success targets:** What numbers count as success after the first 4 weeks of baseline data?
10. **Scope check:** Do you accept folding "Why us" into the stats row and process section for the 2-week timeline?
11. **Phase 2:** Timing and scope for FAQ/Insights, and whether project detail pages come later.
12. **Formspree plan:** Free-tier submission limits should be checked against expected volume.
