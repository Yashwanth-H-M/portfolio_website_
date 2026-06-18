# Peerya — Development Reference Guide

This reference guide provides a complete overview of the **Peerya** codebase, including architecture, page layouts, components, API endpoints, data flow, styling system, and instructions for future coding.

---

## 📂 Project Structure & Directory Mapping

```
Peerya/
├── data/
│   └── waitlist.example.json      # Sample JSON database structure
├── public/                        # Static assets (SVGs, icons, next/vercel logos)
└── src/
    ├── app/                       # Next.js App Router root
    │   ├── api/
    │   │   └── waitlist/
    │   │       └── route.ts       # API handler for GET / POST waitlist registration
    │   ├── favicon.ico
    │   ├── globals.css            # Global Tailwind v4 styles & design tokens
    │   ├── layout.tsx             # Root layout wrapper (Google Fonts & metadata)
    │   └── page.tsx               # Main landing page (interactive elements & form)
    ├── components/
    │   └── ScrollReveal.tsx       # IntersectionObserver scroll reveal component
    └── lib/
        └── waitlist.ts            # Node.js fs-based waitlist database operations
```

---

## 🛠️ Technology Stack

- **Core Framework**: [Next.js v16.2.6](file:///c:/Users/yashw/Desktop/Peerya-main/package.json) (App Router configuration)
- **UI Engine**: [React v19.2.4](file:///c:/Users/yashw/Desktop/Peerya-main/package.json) (utilizes React Hooks: `useState`, `useEffect`, `useRef`, `useMemo`)
- **Language**: TypeScript (strongly typed definitions for forms and storage)
- **CSS / Styling**: TailwindCSS v4 with PostCSS (configured via `@tailwindcss/postcss` in [postcss.config.mjs](file:///c:/Users/yashw/Desktop/Peerya-main/postcss.config.mjs))
- **Email Notifications**: `@emailjs/browser` (handles waitlist confirmation emails to both applicants and the founder)

---

## 🎨 Styling & Design System

Styling is driven by **TailwindCSS v4** and customized custom properties in [globals.css](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/globals.css).

### Design Tokens
Custom theme colors are defined in the CSS root selector:
- **Primary Color (Innovation)**: Electric Violet (`--violet`: `#7C3AED`, `--violet-bright`: `#8B5CF6`)
- **Secondary Color (Intelligence)**: Cyan-Teal (`--cyan`: `#06B6D4`, `--cyan-bright`: `#22D3EE`)
- **Accent Color (Ambition)**: Warm Gold (`--gold`: `#F59E0B`)
- **Background**: Deep Obsidian Dark Mode (`--bg-deep`: `#050917`, `--bg-mid`: `#080f24`)
- **Gradients**: Harmonic Violet-to-Cyan gradients for glass card hover effects and typography (`.gradient-text`).

### Key UI Features
1. **Interactive Cursor Glow**: [CursorTracker](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/page.tsx#L8) renders a radial gradient background that tracks the client cursor coordinates.
2. **Animated Background Canvas**: [ParticleCanvas](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/page.tsx#L142) animates 80 nodes floating and drawing vector connection lines when they are within 140px.
3. **Scroll Reveal**: [ScrollReveal](file:///c:/Users/yashw/Desktop/Peerya-main/src/components/ScrollReveal.tsx#L5) implements a client-side `IntersectionObserver` that attaches the class `is-visible` to elements marked `.reveal` or `.reveal-stagger` as they enter the viewport.
4. **Responsive Media Breakpoints**: Styles are fully optimized for standard layouts, medium viewport sizes (1040px), and mobile viewports (760px / 440px).

---

## 💾 Storage & Data Flow

Peerya stores waitlist submissions locally in a JSON file database to minimize operational dependencies during validation.

### Data Types
Defined in [waitlist.ts](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts):
- **[WaitlistData](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts#L4-L8)**:
  ```typescript
  export type WaitlistData = {
    count: number;
    emails: string[];
    applications: WaitlistApplication[];
  };
  ```
- **[WaitlistApplication](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts#L10-L18)**:
  ```typescript
  export type WaitlistApplication = {
    fullName: string;
    email: string;
    country: string;
    skillInterest: string;
    skillLevel: string;
    commitmentPeriod: string;
    createdAt: string;
  };
  ```

### Data Layer Helper Functions
Functions exported by [waitlist.ts](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts):
1. **[getWaitlist()](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts#L73)**: Reads the JSON file from disk (`data/waitlist.json` falling back to `data/waitlist.example.json`) and caches it in memory at `globalThis.__peeryaWaitlist`.
2. **[addToWaitlist(application)](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts#L87)**: Sanitizes parameters, checks for email duplicates, appends the entry, assigns a timestamp, and writes the updated array back to disk.

---

## 🌐 API Layer

Backend routing is located at [route.ts](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/api/waitlist/route.ts) under Next.js App Router conventions:

- **[GET](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/api/waitlist/route.ts#L5)**: Returns the current count of total applicants.
  - *Response*: `{ count: number }`
- **[POST](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/api/waitlist/route.ts#L10)**: Receives a waitlist application payload.
  - *Validation*: Sanitizes inputs, checks regex matches for email, and requires all fields (`fullName`, `email`, `country`, `skillInterest`, `skillLevel`, `commitmentPeriod`).
  - *Success Response*: `{ count: number, message: string }` (Status 200)
  - *Error Responses*: 
    - `{ error: "Please enter a valid email address." }` (Status 400)
    - `{ error: "Please complete every field before applying." }` (Status 400)
    - `{ error: "Something went wrong. Please try again." }` (Status 500)

---

## 🖥️ Page Layout & Form Submission Workflow

The user interface resides inside [page.tsx](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/page.tsx).

### Onboarding Form Submission Logic
1. **User Interaction**: Users fill out their personal details, country, target skill, skill level, and commitment length.
2. **Validation**: Client-side states map missing fields and trigger shaking CSS keyframe animations (`.field-error`) if submission fails initial checks.
3. **POST Request**: Submits application payload to `/api/waitlist`.
4. **Email Notifications**: Upon success, calls `emailjs.send()` using variables:
   - `process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - Template for Applicant: `process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_APPLICANT`
   - Template for Founder: `process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FOUNDER`
5. **Success View**: Switches to `success-screen` allowing the applicant to share Peerya directly on Twitter/X and WhatsApp.

---

## 📝 Coding Guidelines & Best Practices for Agents

When making future edits to the codebase, adhere to the following rules:

1. **Keep HTML Semantic**: Ensure headings use appropriate hierarchy (`h1` -> `h2` -> `h3`) and interactive components are fully accessible with ARIA attributes where needed.
2. **Preserve Next.js Version Compatibility**: Note that Next.js version 16 contains custom updates. Consult `node_modules/next/dist/docs/` if APIs differ from standard documentation.
3. **Keep Tailwind CSS Modular**:
   - Prefer Tailwind classes combined with design tokens in [globals.css](file:///c:/Users/yashw/Desktop/Peerya-main/src/app/globals.css).
   - Custom animations (`float`, `spin-slow`, `pulse-dot`, etc.) are built-in and should be reused instead of adding heavy JavaScript-based animations.
4. **Local Data Persistence**: Ensure files written to `data/waitlist.json` match the [WaitlistData](file:///c:/Users/yashw/Desktop/Peerya-main/src/lib/waitlist.ts#L4) schema to prevent type mismatches during parsing.
5. **Environment Variables**: Make sure to check or instruct the user to configure EmailJS keys in `.env.local` if email delivery fails.
