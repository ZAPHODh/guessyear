# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application with Turbopack  
- `npm start` - Start production server
- `npx prisma migrate dev` - Apply database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma database browser

## Architecture Overview

This is a full-stack Next.js 15 application using the App Router with internationalization (i18n) support.

### Core Technologies
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: TailwindCSS with shadcn/ui components  
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Session-based auth with OAuth (GitHub, Google) and email verification
- **Email**: React Email with Resend
- **Internationalization**: next-international for i18n
- **State Management**: React Hook Form with Zod validation
- **Payments**: Stripe integration

### Key Architectural Patterns

**Parallel Routes & Intercepting Routes**: Uses Next.js parallel routes (`@loginDialog`) and intercepting routes (`(.)login`) for modal overlays.

**Internationalized Routing**: 
- All pages are under `src/app/[locale]/` 
- Supports English (`en`) and Portuguese (`pt`)
- Locale-specific translations in `src/locales/`

**Authentication System**:
- Session-based auth in `src/lib/server/auth/`
- Email verification with OTP codes
- OAuth providers (GitHub, Google) via Arctic library
- User sessions stored in database

**Database Models** (Prisma):
- `User` - Core user data with OAuth IDs and Stripe fields
- `Session` - User sessions with expiration
- `EmailVerificationCode` - OTP codes for email verification

**API Routes Structure**:
- Authentication endpoints in `src/app/api/auth/`
- OG image generation at `/api/og`

**Component Architecture**:
- UI components in `src/components/ui/` (shadcn/ui)
- Layout components in `src/components/layout/`
- Shared utilities in `src/components/shared/`
- TypeScript path aliases: `@/components`, `@/lib`, `@/config`

**Server Actions**: Uses next-safe-action for type-safe server actions with middleware for authentication.

### Environment Setup
Requires PostgreSQL database connection string in `DB_PRISMA_URL` environment variable.

## Development Standards

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, and Tailwind.

### Code Style and Structure
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

### Naming Conventions
- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

### TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.

### Syntax and Formatting
- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

### UI and Styling
- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

### Performance Optimization
- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.

### Key Conventions
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
  - Favor server components and Next.js SSR.
  - Use only for Web API access in small components.
  - Avoid for data fetching or state management.

Follow Next.js docs for Data Fetching, Rendering, and Routing.