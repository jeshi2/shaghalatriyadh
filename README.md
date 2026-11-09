# Domestic Services Qatar

Bilingual (Arabic-first) marketing website for a domestic services company in
Qatar, built with Next.js, TypeScript and Tailwind CSS.

> Full documentation — setup, configuration and deployment — is added in the
> final milestone. This README grows with the project.

## Requirements

- Node.js 20.9+ (developed on Node 22)
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the real business details
npm run dev
```

The site runs on http://localhost:3000.

## Scripts

| Script                 | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the development server          |
| `npm run build`        | Production build                      |
| `npm start`            | Serve the production build            |
| `npm run lint`         | ESLint (Next.js core-web-vitals + TS) |
| `npm run typecheck`    | TypeScript, no emit                   |
| `npm test`             | Vitest unit tests                     |
| `npm run format`       | Prettier write                        |
| `npm run format:check` | Prettier check                        |

## Configuration

All business details (WhatsApp number, phone, email, address, opening hours,
service areas) live in [`src/config/business.ts`](src/config/business.ts) and
can be overridden through the environment variables documented in
[`.env.example`](.env.example). Values still marked `PLACEHOLDER` must be
replaced before launch.
