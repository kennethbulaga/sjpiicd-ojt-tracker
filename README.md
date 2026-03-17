# JP Track

<p align="center">
	<img src="public/sjpiicd-logo.png" alt="SJPIICD Logo" width="84" />
</p>

JP Track is a production-ready OJT tracking web app for St. John Paul II College of Davao students. It provides a complete workflow for logging internship sessions, monitoring hour progress, and preparing DTR-ready history records.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)

## Product Highlights

- Secure SJPIICD-first access with Google OAuth and Supabase session handling
- Dashboard with progress ring, statistics cards, and activity calendar
- Quick Log flow with smart defaults, validation, and same-day entry visibility
- Recent entries stream with delete actions and server-backed consistency
- DTR history table with filtering, grouping, and export actions
- Settings and onboarding flows with strict validation and required profile fields
- Mobile-first responsive shell with bottom navigation and desktop sidebar

## Experience Overview

### Dashboard
- Hour completion and remaining goals with estimated finish date logic
- Business-day progress cues and daily activity visualization

### Log Hours
- Date-driven logging with validated session windows and chronology checks
- Realtime-aware daily entry list scoped to the active user/date
- URL-synced date state for consistent navigation and refresh behavior

### History
- Server-fetched history with searchable/filterable records
- Export-ready actions for DTR workflows

### Settings & Onboarding
- Program/company profile capture with required company enforcement
- Typed server actions and schema-first validation boundaries

## Architecture (Current Canonical)

The codebase follows a server-first Next.js 16 App Router pattern with route-private colocation.

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/_components/*   # canonical dashboard route components
│   │   └── log/_components/*         # canonical log route components
│   └── api/auth/callback/
├── actions/                          # server actions
├── components/
│   ├── ui/                           # global shadcn/ui primitives
│   └── layout/                       # shared layout shell components
├── lib/
│   ├── supabase/
│   └── validations/
└── proxy.ts
```

## Engineering Standards Applied

- Next.js 16 + React 19 + TypeScript strict mode
- Server Components by default; Client Components only for interactivity
- Server Actions for mutations and route revalidation
- Zod-based validation contracts with inferred types
- Tailwind CSS v4 + shadcn/ui + cva wrapper composition
- Import-boundary lint rules to prevent deprecated architectural paths

## Quality Status

> [!NOTE]
> The repository has been migrated to route-colocated canonical components and validated with build, lint, and automated tests.

- Production build: successful
- Lint checks: passing
- Test suite: passing (includes route smoke test and focused utility/component tests)

---

Built by Kenneth Bulaga for the SJPIICD student community.
