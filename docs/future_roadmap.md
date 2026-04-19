# AGENT SYSTEM DIRECTIVE: Future ProductLogik Roadmap

**CONTEXT**: 
This document outlines complex feature integrations that require dedicated architectural planning. Do not execute these alongside simple UI bug fixes. Execute them systematically when prompted.

---

## ROADMAP PHASE 1: Google OAuth Authentication
**TARGETS**: `backend/auth.py` (or similar Auth router), `frontend/src/components/auth/`
- **Goal**: Implement "Continue with Google" SSO.
- **Effort**: High | **Time**: ~5-6 AI Prompts | **Cost**: Free (Google Cloud OAuth limits) | **Dependencies**: Google Cloud Console App Verification | **Requirements**: Valid HTTPS callback domains for testing.
- **Backend Architecture**: Requires integrating `google-auth` Python SDK, handling OAuth2 callbacks, creating/matching user sessions in Supabase via email, and securely returning JWT tokens.
- **Frontend Architecture**: Requires adding a prominent Google SSO `<Button>` on the Auth pages, handling the redirect URI, and securely parsing the JWT authorization hand-off.

## ROADMAP PHASE 2: Third-Party Ecosystem Integrations
**TARGETS**: `frontend/src/pages/IntegrationsPage.tsx`, `backend/services/`
- **Goal**: Transition "Planned Integrations" from a static list to functional bi-directional API pipelines.
- **Effort**: Extreme | **Time**: ~8-10 AI Prompts per Tool | **Cost**: Tool API Tiers | **Dependencies**: User OAuth token handling | **Requirements**: Dedicated Python background workers and rigorous API quota management.
- **Scope**: Identify key external tools (e.g., Jira, Slack, Trello, GitHub). Build isolated Python service workers to handle API handshakes, webhooks, and data synchronization for each supported tool.

## ROADMAP PHASE 3: AI-Driven Blog / Content Engine
**TARGETS**: `frontend/src/pages/BlogPage.tsx`, `backend/services/blog_service.py`
- **Goal**: Automate content marketing.
- **Effort**: Medium | **Time**: ~3-4 AI Prompts | **Cost**: Automated LLM Token Overhead | **Dependencies**: None | **Requirements**: Supabase `pg_cron` setup and structured database schemas for MDX/HTML content.
- **Scope**: Develop a background cron/scheduler in Python that periodically queries Gemini to generate SEO-optimized articles comparing Product Management practices or Agile anti-patterns. Store generated HTML/Markdown in Supabase, and dynamically render them within the React `BlogPage.tsx` interface.

## ROADMAP PHASE 4: Browser Extension Clippers (Data Ingestion)
**TARGETS**: `backend/api/router.py`, Chrome Extension Structure
- **Goal**: Remove friction from uploading customer feedback via CSVs.
- **Effort**: High | **Time**: ~6-8 AI Prompts | **Cost**: Chrome Web Store Dev Fee ($5) | **Dependencies**: ProductLogik Core API | **Requirements**: Separate codebase (Manifest V3) communicating with the FastAPI endpoint via secure CORS boundaries.
- **Scope**: Build a minimalist Chrome/Firefox browser extension that allows Product Managers to highlight text in Zendesk, Intercom, or email and push it directly into their ProductLogik datasets via an authenticated REST API endpoint.

## ROADMAP PHASE 5: Notion & Confluence Exporting
**TARGETS**: `backend/services/export_service.py`, `frontend/src/pages/ResultsPage.tsx`
- **Goal**: Push analyzed PRDs (Product Requirement Documents) directly to company wikis.
- **Effort**: High | **Time**: ~5-6 AI Prompts | **Cost**: Free (Notion API Limits) | **Dependencies**: End-user Notion integration tokens | **Requirements**: Complex JSON block construction mapped perfectly to the rigid Notion Block API schema.
- **Scope**: Integrate the Notion API to allow users to generate structured databases or pages straight from the Gemini thematic extraction engine, serving as the digital twin to the static PDF exporter.

## ROADMAP PHASE 6: Multi-Tenant Workspaces (Team Sharing)
**TARGETS**: `supabase_schema.sql`, `backend/auth.py`, `frontend/src/context/`
- **Goal**: Allow product teams to collaborate.
- **Effort**: Extreme | **Time**: ~10+ AI Prompts | **Cost**: Free | **Dependencies**: System-wide Database Rewrite | **Requirements**: `organization_id` foreign keys injected into every Postgres table, rigorous invitation token flows, and strict updated RLS policies.
- **Scope**: Refactor Supabase Row-Level Security (RLS) to support an `organizations` or `workspaces` table where multiple authenticated users can be invited to view and analyze identical dataset flows securely.

## ROADMAP PHASE 7: Interactive Public Feature Portals
**TARGETS**: `frontend/src/pages/PublicPortal.tsx`, `backend/main.py`
- **Goal**: Serve as a customer-facing, AI-verified public roadmap.
- **Effort**: Medium | **Time**: ~4-5 AI Prompts | **Cost**: Small Supabase Bandwidth | **Dependencies**: Magic Links Phase | **Requirements**: Anti-bot mechanisms (rate limiting or cookie session validation) to prevent upvote-spam on unauthenticated read-routes.
- **Scope**: Expose an authenticated read-only parameterized route allowing external end-users to view the extracted AI feature themes and actively "upvote" them, writing telemetry directly back into the Supabase Postgres instance.
