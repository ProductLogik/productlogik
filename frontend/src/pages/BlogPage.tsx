import { ExternalLink } from "lucide-react";

export function BlogPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">From the Builder</h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                    Notes on building ProductLogik, product thinking, and decisions made along the way. Written by <a href="https://www.hamzalatif.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 font-medium">Hamza Latif</a>.
                </p>
            </div>

            <div className="space-y-5 mb-12">
                <BlogPost
                    date="April 2026"
                    title="Why I Built ProductLogik"
                    excerpt="I kept watching product teams make roadmap decisions based on whoever shouted loudest in Slack. Feedback data existed — it just wasn't being read systematically. ProductLogik is my attempt to fix that with a CSV upload and an AI model that doesn't lie about what it found."
                    tag="Origin"
                />
                <BlogPost
                    date="April 2026"
                    title="Evidence-First AI: Why Every Theme Needs a Quote"
                    excerpt="The first version of the analysis output didn't show evidence quotes. It felt clean. It also felt completely untrustworthy. If an AI tells you that 'onboarding is the top problem' with no backup, why would you act on it? Quotes aren't a UX feature — they're the entire argument for why you should trust the output."
                    tag="Design Decision"
                />
                <BlogPost
                    date="March 2026"
                    title="Building an Agile Anti-Pattern Detector"
                    excerpt="The Product Health Score started as a weekend experiment. I gave Gemini a set of retrospective notes and asked it to reason about whether the team was working well. The output was surprisingly coherent. Three iterations later, it became the Anti-Pattern Detector. Here's what I learned about prompting for structured risk assessment."
                    tag="Feature Build"
                />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-text-primary mb-1">Want more context on the build?</p>
                    <p className="text-sm text-text-secondary">My portfolio has more detail on the technical decisions behind this project.</p>
                </div>
                <a
                    href="https://www.hamzalatif.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors flex-shrink-0"
                >
                    hamzalatif.com <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>
        </div>
    );
}

function BlogPost({ date, title, excerpt, tag }: { date: string; title: string; excerpt: string; tag: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-2.5 py-0.5">{tag}</span>
                <span className="text-xs text-text-secondary">{date}</span>
            </div>
            <h2 className="text-lg font-display font-bold text-text-primary mb-2">{title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed text-justify">{excerpt}</p>
        </div>
    );
}
