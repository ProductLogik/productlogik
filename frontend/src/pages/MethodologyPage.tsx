import { Database, Network, Cpu, FileText, ShieldCheck, Zap } from "lucide-react";

export function MethodologyPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">How ProductLogik Works</h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl text-justify">
                    A transparent look at how your feedback data moves through the system — from raw CSV upload to structured, evidence-backed insights.
                </p>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-10 mb-16">
                <Step step="01" title="Upload Your Feedback">
                    <p className="text-justify">
                        You start by uploading a CSV file containing any kind of raw text feedback — customer support tickets, NPS survey responses, app store reviews, user interviews, or sprint retrospective notes. ProductLogik accepts any single-column or multi-column CSV as long as at least one column contains feedback text. There is no required template or column naming convention.
                    </p>
                </Step>

                <Step step="02" title="Dual-LLM Theme Extraction">
                    <p className="text-justify">
                        Once uploaded, feedback rows are batched and sent to the AI engine. ProductLogik operates a <strong>dual-LLM architecture</strong>: <strong>Google Gemini</strong> acts as the primary extraction model, with <strong>OpenAI (GPT-4o)</strong> serving as an active fallback provider. If Gemini is unavailable or exhausted, the system automatically retries against OpenAI without any action required from the user — ensuring continuity of analysis across provider-level outages and quota limits.
                    </p>
                    <p className="mt-3 text-justify">
                        The extraction prompt instructs the model to identify recurring <strong>themes</strong> — the underlying problems, requests, or sentiments appearing repeatedly across the dataset. Each theme is returned with: a name, a short summary, a sentiment classification (Positive, Neutral, Negative, or Critical), a confidence score, a mention count, and direct evidence quotes pulled verbatim from your data.
                    </p>
                </Step>

                <Step step="03" title="Confidence Scoring">
                    <p className="text-justify">
                        Each theme is assigned a confidence score (0–100) by the model, reflecting how strongly the evidence supports the theme's presence and characterisation. An overall analysis confidence score is derived by averaging the theme-level scores, giving a single headline number representing signal quality across the full dataset.
                    </p>
                </Step>

                <Step step="04" title="Executive Summary Generation">
                    <p className="text-justify">
                        After theme extraction, the AI synthesises a concise executive summary — a two-to-four sentence paragraph that captures the dominant signal across the dataset. This is designed to be pasted directly into a Slack update, a sprint planning doc, or a stakeholder report with no editing required.
                    </p>
                </Step>

                <Step step="05" title="Agile Anti-Pattern Detection (Pro & Team)">
                    <p className="text-justify">
                        For Pro and Team tier users, a second analysis pass evaluates feedback for structural product health risks. The system checks for known Agile anti-patterns — scope creep, over-engineering, stakeholder misalignment, technical debt accumulation, and delivery pressure — scoring each risk by severity. The output is a <strong>Product Health Score</strong> (0–100) with plain-language reasoning justifying the assessment. This pass is only meaningful for internal team feedback (retrospectives, internal surveys); for external customer data, the score is explicitly suppressed with an explanation.
                    </p>
                </Step>

                <Step step="06" title="Evidence-Backed, Not a Black Box">
                    <p className="text-justify">
                        Every insight surfaced by ProductLogik links directly to original customer quotes from your CSV. Any theme can be expanded to view the exact evidence rows that contributed to it. If you disagree with a classification, the evidence is right there for you to evaluate. The goal is to give you a structured starting point — not an answer you have to accept on faith.
                    </p>
                </Step>
            </div>

            {/* Tech Stack Grid */}
            <div className="mb-10">
                <h2 className="text-xl font-display font-bold tracking-tight text-text-primary mb-2">Technical Architecture</h2>
                <p className="text-sm text-text-secondary mb-6 text-justify">
                    The core stack powering the analysis pipeline from upload through delivery.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <TechCard
                        icon={<Cpu className="h-5 w-5 text-brand-600" />}
                        title="AI Engine"
                        description="Dual-provider LLM pipeline: Gemini (primary) + OpenAI GPT-4o (fallback). Automatic failover with no user interruption."
                    />
                    <TechCard
                        icon={<Database className="h-5 w-5 text-brand-600" />}
                        title="Data Layer"
                        description="PostgreSQL via Supabase for persistent analysis storage. SQLAlchemy ORM with session-scoped access control."
                    />
                    <TechCard
                        icon={<Network className="h-5 w-5 text-brand-600" />}
                        title="API Layer"
                        description="FastAPI backend with async request handling, JWT authentication, and structured JSON response contracts."
                    />
                    <TechCard
                        icon={<FileText className="h-5 w-5 text-brand-600" />}
                        title="Report Generation"
                        description="ReportLab-powered PDF export with per-tier rendering: watermarked for Demo, full-fidelity for Pro and Team."
                    />
                    <TechCard
                        icon={<ShieldCheck className="h-5 w-5 text-brand-600" />}
                        title="Auth & Security"
                        description="Supabase Auth with email verification. Bearer token sessions, CORS policy, and per-upload access control for sharing."
                    />
                    <TechCard
                        icon={<Zap className="h-5 w-5 text-brand-600" />}
                        title="Frontend"
                        description="React 18 with Vite, TypeScript, and Tailwind CSS. Deployed as a static SPA with PM2 process management in production."
                    />
                </div>
            </div>

            {/* Stack Pills */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-4">Full Stack</p>
                <div className="flex flex-wrap gap-2">
                    {[
                        "Python 3.11", "FastAPI", "SQLAlchemy", "Supabase", "PostgreSQL",
                        "React 18", "TypeScript", "Vite", "Tailwind CSS",
                        "Gemini AI", "OpenAI GPT-4o", "ReportLab", "Resend", "PM2"
                    ].map(pill => (
                        <span key={pill} className="inline-flex items-center text-xs font-medium text-text-secondary bg-white border border-slate-200 rounded-full px-3 py-1">
                            {pill}
                        </span>
                    ))}
                </div>
                <div className="mt-5 pt-5 border-t border-slate-200">
                    <p className="text-xs text-slate-400 leading-relaxed text-justify">
                        <strong className="text-text-secondary">Data handling note:</strong> Your CSV data is processed in-memory during the AI analysis call and is not retained by Google or OpenAI for model training under standard API usage terms. Uploaded files and results are stored in Supabase solely for retrieval by your account. See the <a href="/privacy-policy" className="text-brand-600 hover:text-brand-700">Privacy Policy</a> for full details.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Step({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-6">
            <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-display font-bold text-sm">
                    {step}
                </span>
            </div>
            <div>
                <h2 className="text-xl font-display font-bold tracking-tight text-text-primary mb-3">{title}</h2>
                <div className="text-text-secondary leading-relaxed text-sm">{children}</div>
            </div>
        </div>
    );
}

function TechCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <p className="text-sm font-semibold text-text-primary">{title}</p>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
        </div>
    );
}
