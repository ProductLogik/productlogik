# 💰 ProductLogik Pricing Page Copy

------------------------------------------------------------------------

# Hero Section

## Pricing Built for Product Leaders

From solo PMs to enterprise product organizations ---\
unlock actionable intelligence from customer feedback.

**No credit card required. Cancel anytime.**

\[ Start Free \] \[ View Plans \]

------------------------------------------------------------------------

# 🟢 Explorer

### €0 / month

For individual PMs & early-stage builders

Turn raw feedback into structured insight.

## Includes:

-   3 CSV uploads per month\
-   AI Theme Extraction\
-   Sentiment Analysis (Positive → Critical)\
-   Confidence Scores\
-   Direct Customer Evidence Quotes\
-   The Compass Dashboard (3-Column View)\
-   Watermarked PDF Export\
-   1 User

**Best for:** Learning, side projects, interview prep, MVPs.

\[ Start Free \]

------------------------------------------------------------------------

# 🔵 Product Leader *(Most Popular)*

### €59 / month

For serious PMs and growing startups

Go beyond themes. Detect systemic product risks.

## Everything in Explorer +

-   50 uploads per month\
-   Agile Anti-Pattern Detection\
-   Agile Health Dashboard\
-   Product Health Score (0--100)\
-   Theme Trend Graphs\
-   AI Executive Summary Generator\
-   Clean, Branded PDF Export\
-   Email Sharing\
-   Continuous Monitoring Alerts\
-   Jira Export (Basic)\
-   Up to 3 Team Members

**Best for:** Startups, scale-ups, weekly shipping teams.

\[ Upgrade to Pro \]

------------------------------------------------------------------------

# 🟣 Growth Organization

### €199 / month

For product teams that need alignment & automation

Turn feedback into a continuous intelligence engine.

## Everything in Product Leader +

-   Unlimited uploads\
-   Multi-Source Integrations (Intercom, Zendesk, Slack, etc.)\
-   Scheduled Auto Sync\
-   Team Collaboration (Comments, Assign Owners)\
-   AI Roadmap Generator\
-   Advanced Trend Analytics\
-   Sentiment Heatmaps\
-   Role-Based Access\
-   API Access\
-   Priority Support\
-   10--20 Users

**Best for:** Multi-PM teams, SaaS companies, PLG orgs.

\[ Start Team Plan \]

------------------------------------------------------------------------

# 🟡 Enterprise

### Custom Pricing

The full Product Intelligence Platform.

## Everything in Growth +

-   Custom Anti-Pattern Models\
-   Industry Benchmarking\
-   Revenue & Churn Impact Estimation\
-   Dedicated Customer Success Manager\
-   SSO & Advanced Security\
-   SLA Guarantees\
-   Custom Integrations\
-   Data Residency Options\
-   Advanced Audit Logs\
-   Custom PDF & Board Reporting Templates

**Best for:** Scaling SaaS and enterprise organizations.

\[ Contact Sales \]

------------------------------------------------------------------------

# 📊 Feature Comparison Table

  Feature                  Explorer   Product Leader   Growth      Enterprise
  ------------------------ ---------- ---------------- ----------- ------------
  CSV Upload               3/mo       50/mo            Unlimited   Unlimited
  AI Theme Extraction      ✓          ✓                ✓           ✓
  Sentiment Analysis       ✓          ✓                ✓           ✓
  Evidence Quotes          ✓          ✓                ✓           ✓
  Anti-Pattern Detection   ---        ✓                ✓           ✓
  Product Health Score     ---        ✓                ✓           ✓
  Trend Analytics          ---        ✓                ✓           ✓
  Integrations             ---        ---              ✓           Custom
  Collaboration            ---        Limited          Full        Full
  API Access               ---        ---              ✓           ✓
  Benchmarking             ---        ---              ---         ✓
  Impact Estimation        ---        ---              ---         ✓

------------------------------------------------------------------------

# 🔒 Enterprise-Grade Security

-   JWT Authentication\
-   Email Verification\
-   Secure PostgreSQL\
-   Isolated AI Processing

------------------------------------------------------------------------

# 💡 Why ProductLogik?

Unlike traditional product management tools that organize feedback ---\
ProductLogik diagnoses your product strategy.

We don't just show themes.\
We detect systemic risk.

------------------------------------------------------------------------

# ❓ FAQ

### Can I cancel anytime?

Yes. No lock-in contracts.

### Is my data used to train AI models?

No. Your data remains private and isolated.

### Do you support enterprise security?

Yes. SSO, SLA, audit logs, and custom hosting available.

### Can I upgrade later?

Yes. Plans scale as your product organization grows.

------------------------------------------------------------------------

# ⚙ Stripe Implementation Strategy

## Stripe Structure

-   Product: ProductLogik
    -   Price_Explorer (Free)
    -   Price_Pro_Monthly
    -   Price_Team_Monthly
    -   Enterprise (Manual Billing)

## Technical Notes

-   Usage-based metering for uploads\
-   Stripe Webhook → FastAPI → Enforce quotas\
-   Grace period before downgrade lock

------------------------------------------------------------------------

End of Document.
