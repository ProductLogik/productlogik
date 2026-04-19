import { Link } from "react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
    {
        q: "What file format do I need to upload?",
        a: "A standard CSV file. Any spreadsheet software (Excel, Google Sheets, Numbers) can export to CSV. You don't need a specific column layout — ProductLogik scans for text-heavy columns automatically."
    },
    {
        q: "How many rows can I upload?",
        a: "There's no hard row limit enforced at upload. For best results, aim for 50–2000 rows. Very large datasets (5000+ rows) may take longer to process and could hit AI token limits — splitting into batches is recommended for those."
    },
    {
        q: "What does the Demo tier include?",
        a: "Demo accounts get 5 analyses per month. All core features are available: theme extraction, sentiment analysis, executive summaries, evidence quotes, and PDF export. The PDF export includes a 'Demo' watermark."
    },
    {
        q: "What does Pro add over Demo?",
        a: "Pro removes the watermark, increases your monthly analysis quota, and unlocks the Agile Anti-Pattern Detector and Product Health Score — a scored assessment of structural risks in your feedback."
    },
    {
        q: "Why did my analysis fail?",
        a: "The most common cause is a CSV without any readable text columns — for example, a file with only numeric IDs or dates. If your file has text content and the analysis still fails, check the error message on the results page; it will describe what went wrong. Failed analyses do not consume a usage credit."
    },
    {
        q: "Can I share an analysis with a colleague?",
        a: "Yes. From any completed analysis, click 'Share Analysis' and enter their email address. If they already have a ProductLogik account, they'll get immediate access. If not, they'll receive an invitation link."
    },
    {
        q: "Is my data used to train AI models?",
        a: "No. Your data is sent to Google Gemini via the standard API under terms that do not permit your submissions to be used for model training. ProductLogik itself does not perform any training on user data."
    },
    {
        q: "How do I delete my account?",
        a: "Email contact@hamzalatif.com with a deletion request. Your account, uploaded files, and all associated analysis results will be permanently removed."
    },
    {
        q: "How do I export my results?",
        a: "From any completed analysis page, click 'Download Report (PDF)'. The report includes the executive summary, all themes with evidence quotes, and — for Pro/Team tiers — the Product Health Score."
    },
];

export function HelpCenterPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">Help Center</h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                    Answers to the most common questions about using ProductLogik.
                </p>
            </div>

            <div className="space-y-2 mb-12">
                {FAQS.map(faq => (
                    <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
                ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-display font-bold text-text-primary mb-2">Still need help?</h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    If your question isn't answered above, reach out directly. Response time is typically within 24–48 hours.
                </p>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-brand-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
            >
                <span className="text-sm font-semibold text-text-primary">{question}</span>
                <ChevronDown className={`h-4 w-4 text-text-secondary flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="px-5 pb-4">
                    <p className="text-sm text-text-secondary leading-relaxed text-justify">{answer}</p>
                </div>
            )}
        </div>
    );
}
