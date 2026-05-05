---
description: Workflow for clean project
---

## Engineering Philosophy (apply to every layer)

These five principles govern every decision in this build.
When in doubt, choose the option that best satisfies them in order.

### 1. Clean Code
- Single responsibility per function, component, and module
- No function longer than 40 lines; extract helpers aggressively
- Explicit naming: `deriveTypeFromScores()` not `getType()`
- No magic numbers — all constants live in `/lib/constants.ts`
- Every public function has a JSDoc comment with param + return types
- TypeScript strict mode, no `any`
- Tests for all scoring and compatibility logic (Jest or Vitest)

### 2. Infrastructure
- Supabase as the sole backend (DB + Auth + Edge Functions + Realtime)
- Gemini Flash (`gemini-1.5-flash`) for AI excerpt generation — free tier, fast
- All AI calls happen in Supabase Edge Functions, never from the client
- Secrets (Gemini API key) stored in Supabase Vault — never in `.env` committed to repo
- Row-Level Security (RLS) enabled on every table from day one
- DB migrations tracked with Supabase CLI (`supabase/migrations/`)
- No serverless functions outside Supabase — keep infra in one place

### 3. Product Design
- Mobile-first layout; test flow must work perfectly on 375px screens
- Progress bar always visible during test
- Results screen loads in under 2 seconds after test submission
- Dimension score bars animate in on results load (CSS transition, no JS libs)
- Typography: system font stack, minimum 16px body, high contrast
- No dark patterns — retake CTA is visible but not pushed


### 4. Iteration
- Ship the smallest working slice first: test → results screen → no matching yet
- Feature flags for everything not in MVP (matching feed, retake flow, feedback widget)
- Excerpt prompts live in a Supabase table (`excerpt_prompts`), not hardcoded —
  update them without a deploy
- Compatibility map lives in a Supabase table (`compatibility_map`), not hardcoded
- Version every PersonalityProfile (`schema_version` column) so old profiles stay valid
  when scoring logic changes