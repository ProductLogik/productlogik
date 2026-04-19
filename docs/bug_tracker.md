# ProductLogik Active Bug Tracker

This document tracks UI boundaries, routing anomalies, and UX polish items that need to be resolved. 

*Instructions for User: Add new issues to the bottom of this list. When you are ready, hand this exact file to your AI Coding Agent to execute the fixes as an isolated batch.*

---

## 🐛 BUGS & Polish Items

- [x] **Issue 1: React Router Scroll Retention**
  - **Description**: When navigating to a new page via the Footer links (e.g., Methodology, Privacy Policy), the browser viewport remains anchored at the bottom of the screen instead of automatically resetting to the top of the new page.
  - **Fix Applied**: Added a `ScrollToTop` component to `App.tsx` that binds to `useLocation` pathname and calls `window.scrollTo(0, 0)` on every route change.

- [x] **Issue 2: Methodology Text Accuracy (LLM Fallback)**
  - **Description**: The layout on the Methodology page claimed AI Theme Extraction was performed exclusively via Gemini. The backend architecture uses OpenAI GPT-4o as an active fallback.
  - **Fix Applied**: MethodologyPage.tsx rewritten to explicitly describe the dual-LLM architecture (Gemini primary, OpenAI fallback with automatic failover).

- [x] **Issue 3: Global Text Typography**
  - **Description**: Body text across informational pages was aligned left and ragged.
  - **Fix Applied**: `text-justify` applied to all major paragraph containers across PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage, IntegrationsPage, HelpCenterPage, BlogPage, MethodologyPage, and AboutPage.

- [x] **Issue 4: Footer Cleanup & Consolidation**
  - **Description**: Footer contained social icons, inactive newsletter, incorrect terminology, and wrong branding.
  - **Fix Applied**: Social icons removed. Newsletter column removed. Footer re-layouted to 3-column grid. "Cookie Settings" renamed "Cookie Policy". Copyright updated from "Productlogik AI" to "ProductLogik".

- [x] **Issue 5: Missing "About" Page**
  - **Description**: No About page existed.
  - **Fix Applied**: Created `AboutPage.tsx`, added `/about` route in `App.tsx`, linked in Navbar (logged-out state) and Footer.

- [x] **Issue 6: Contact Form Accessibility**
  - **Description**: Form inputs in ContactPage.tsx were missing semantic label bindings.
  - **Fix Applied**: Added `htmlFor` to all `<label>` tags and matching `id` attributes to all `<input>` and `<textarea>` elements (`contact-name`, `contact-email`, `contact-message`).

- [x] **Issue 7: Bloat Removal (Enterprise, Pricing, Case Studies)**
  - **Description**: Placeholder routes for Enterprise, Pricing, and Case Studies were not applicable to a free hobbyist MVP.
  - **Fix Applied**: Deleted `EnterprisePage.tsx`, `CaseStudiesPage.tsx`, and the entire `components/pages/` directory (PricingPage + ComparisonTable + FAQ). Removed their routes from `App.tsx` and all links from Footer.

- [x] **Issue 8: NavBar Redundancy & Wording**
  - **Description**: NavBar showed both "Sign In" and "Get Started". Auth terminology was inconsistent.
  - **Fix Applied**: Removed "Sign In" ghost button. Renamed "Get Started" to "Log In" pointing to `/login`. Added "About" nav link for logged-out users.

- [x] **Issue 9: Methodology Page Evolution (Tech Grid)**
  - **Description**: MethodologyPage lacked visual technical depth.
  - **Fix Applied**: Complete rewrite. Added numbered pipeline steps (including dual-LLM extraction and confidence scoring mechanics), a 6-card TechCard grid with lucide-react icons (Cpu, Database, Network, FileText, ShieldCheck, Zap), and a capability pill grid listing the full tech stack. *Note: Z-Score standardization is not implemented in the backend (confidence is a simple average); the page accurately describes the actual confidence scoring mechanism instead.*

---

## 🛠️ PHASE 2: Structural UI Enhancements

- [x] **Issue 10: About Page Content Update**
  - **Description**: The current DOM layout and CSS styling of `AboutPage.tsx` is perfect as-is. DO NOT alter the structural layout or components. Only the text content needs to be updated.
  - **Expected Fix**: 
    1. **WARNING**: Do NOT build a new `TeamMember` component or rewrite the Tailwind layout grid. Leave the visual design exactly as you find it.
    2. Find the existing text blocks inside `AboutPage.tsx` and **replace them precisely with the following static content:**
       - **Mission Statement**: "ProductLogik is crafted with complete transparency. As an independent, solo-built MVP, there are no corporate hierarchies or venture capital quotas here—just a strict focus on delivering a clean, functional tool that bridges the gap between raw customer feedback and agile execution."
       - **Name**: Hamza Latif
       - **Role**: Solo Developer & MVP Builder
       - **Bio**: "I built ProductLogik out of a personal frustration with how disjointed feedback analysis had become. True product validation requires extracting thematic urgency, not just reading support tickets. ProductLogik utilizes dual-LLM redundancy (Gemini + ChatGPT) to prevent AI hallucination, providing Product Managers with true, data-backed feature roadmaps."
       - **Links**: Update the existing dummy link `href` attributes to point accurately to LinkedIn (`https://www.linkedin.com/in/mhlatif207/`) and Portfolio (`https://www.hamzalatif.com`).

- [x] **Issue 11: NavBar Expansion**
  - **Description**: The NavBar lacks a direct path to the Contact Page.
  - **Expected Fix**: Add a `Contact Us` link to the main navigation bar menu.

- [x] **Issue 12: Authentication Terminology Standardization**
  - **Description**: The app inconsistently swaps between "Sign Up", "Sign In", "Log In", and "Get Started", causing UX friction.
  - **Expected Fix**: Standardize auth messaging globally. Use exclusively "Log In" for returning users and "Create Account" (or "Get Started") for new users. Purge any remaining instances of "Sign In" or "Sign Up" from headers and buttons.

- [x] **Issue 13: Footer Re-Architecture & Titles**
  - **Description**: The footer layout is unbalanced, column titles are inaccurate ("Product & Resources"), and the author attribution looks out of place.
  - **Expected Fix**:
    1. Move the `Privacy Policy`, `Terms of Service`, and `Cookie Policy` links into their own distinct third column.
    2. Audit and correct the column headers (e.g., rename the columns realistically to match their nested links, such as "Product", "Support", and "Legal").
    3. Shift the text `Built by Hamza Latif` so it aligns dynamically on the same row as the `© 2026 ProductLogik` copyright string at the extreme bottom edge of the footer.

- [x] **Issue 14: Landing Page Copy Hallucinations**
  - **Description**: The `LandingPage.tsx` hero section contains hallucinated enterprise marketing data ("Join 500+ product leaders", "Free Demo Plan", "No credit card required"). This falsely implies a massive SaaS with paid tiers.
  - **Expected Fix**: Delete all numeric user-count claims. Delete the "Free Demo Plan" sub-text. Replace the hero sub-text with an honest tag: "A 100% Free, Solo-built MVP tool for Product Managers."

- [x] **Issue 15: Landing Page Feature Hallucination**
  - **Description**: The `LandingPage.tsx` feature grids illegally claim "New: AI-Powered Agile Anti-Pattern Detection" which does not functionally exist in the app yet.
  - **Expected Fix**: Delete this specific feature claim entirely. If necessary to maintain grid symmetry, replace the text with an accurate reflection of the current MVP capabilities (e.g., "Thematic Feedback Extraction" or "Dual-LLM AI Redundancy").
