# JP Track — SJPIICD OJT Tracker

A centralized personal tool for **St. John Paul II College of Davao** (SJPIICD) students to track their CHED-mandated OJT hours with maximum flexibility and zero friction.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)

## Overview

JP Track helps 4th-year OJT students track their required hours (e.g., 486 hours for BSIT) through a clean, mobile-first interface. Students can rapidly log hours via a timesheet form or a live start/stop timer, visualize progress through a dashboard ring, and export their DTR history for school submission.

### Planned Features

- **Dashboard Progress Ring** — Visual tracker showing hours completed vs. remaining
- **Quick Log (Timesheet Mode)** — Calendar-based rapid entry with smart defaults (8AM–12PM, 1PM–5PM)
- **Live Tracker** — Start/stop timer for real-time hour logging
- **DTR History** — Paginated table with CSV export for school submission
- **Dark Mode** — Class-based toggle with system preference detection
- **SJPIICD-Only Access** — Google OAuth restricted to `@sjp2cd.edu.ph` email domain

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript (strict mode) |
| Database | [Supabase](https://supabase.com) PostgreSQL |
| Auth | Supabase Auth via `@supabase/ssr` (cookie-based) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first, OKLCH tokens) |
| Components | [shadcn/ui](https://ui.shadcn.com) + Lucide React |
| Forms | React Hook Form + Zod |
| State | Zustand (UI state only) |
| Time | date-fns |

## Architecture Decisions

- **Server Components by default** — Client Components only for interactive elements
- **Server Actions for mutations** — No API route handlers except OAuth callback
- **Zod as single source of truth** — Types inferred via `z.infer<>`; no duplicate definitions
- **Mobile-first design** — `dvh` viewport units, 44px touch targets, bottom nav on mobile
- **Feature-based folder structure** — Components organized by feature, not by type

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group (login)
│   ├── (dashboard)/            # Dashboard route group
│   │   ├── dashboard/          # Progress ring + stats
│   │   ├── log/                # Quick Log & Live Tracker
│   │   ├── history/            # DTR history table
│   │   └── settings/           # Profile & target hours
│   └── api/auth/callback/      # OAuth code exchange
├── actions/                    # Server Actions (mutations)
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── dashboard/              # ProgressRing, StatsCards
│   ├── time-entry/             # QuickLogForm, LiveTracker
│   ├── history/                # DTRTable, ExportActions
│   ├── auth/                   # GoogleSignInButton
│   └── layout/                 # Header, Sidebar, BottomNav, ThemeToggle
├── hooks/                      # Custom React hooks
├── lib/
│   ├── supabase/               # Server/client/middleware clients
│   ├── validations/            # Zod schemas
│   ├── constants.ts            # Target hours, time constraints
│   └── utils.ts                # cn() utility
├── stores/                     # Zustand (UI state only)
├── types/                      # TypeScript types
└── proxy.ts                    # Auth guard + session refresh (Next.js 16 proxy convention)
```

## Validation Rules

| Rule | Constraint |
|------|-----------|
| Time window | 7:00 AM – 9:00 PM only |
| Chronology | `time_out` must be after `time_in` |
| Daily max | 12 hours per day |
| Overlaps | Block or merge overlapping sessions |
| Session types | Morning · Afternoon · Overtime |

---

Built by **Kenneth Bulaga** for SJPIICD OJT Students.
