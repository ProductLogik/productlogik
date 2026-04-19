import { ExternalLink, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function AboutPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">About ProductLogik</h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                    A solo-built decision intelligence tool for product teams who are serious about understanding their feedback data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                <div>
                    <h2 className="text-xl font-display font-bold tracking-tight text-text-primary mb-4">Why It Exists</h2>
                    <div className="space-y-3 text-sm text-text-secondary leading-relaxed text-justify">
                        <p>
                            ProductLogik is crafted with complete transparency. As an independent, solo-built MVP, there are no corporate hierarchies or venture capital quotas here—just a strict focus on delivering a clean, functional tool that bridges the gap between raw customer feedback and agile execution.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-5">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-brand-600/20 flex-shrink-0">
                            H
                        </div>
                        <div>
                            <p className="font-display font-bold text-text-primary text-base">Hamza Latif</p>
                            <p className="text-sm text-text-secondary">Solo Developer & MVP Builder</p>
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-5 text-justify">
                        I built ProductLogik out of a personal frustration with how disjointed feedback analysis had become. True product validation requires extracting thematic urgency, not just reading support tickets. ProductLogik utilizes dual-LLM redundancy (Gemini + ChatGPT) to prevent AI hallucination, providing Product Managers with true, data-backed feature roadmaps.
                    </p>
                    <div className="flex flex-col gap-2">
                        <a href="https://www.hamzalatif.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" /> hamzalatif.com
                        </a>
                        <a href="https://www.linkedin.com/in/mhlatif207/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
                            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                        </a>
                    </div>
                </div>
            </div>

            <div className="mb-14">
                <h2 className="text-xl font-display font-bold tracking-tight text-text-primary mb-4">What This Is (and Isn't)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">What it is</p>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            {["A free tool for solo PMs and small teams", "An AI-assisted starting point for prioritisation conversations", "Evidence-backed — every theme links to real quotes", "A one-person side project, maintained in good faith"].map(item => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0 mt-1.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">What it isn't</p>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            {["A replacement for talking to users", "A venture-backed product with an SLA", "A consultancy or advisory service", "A substitute for professional data analysis"].map(item => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0 mt-1.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/upload"
                    className="inline-flex items-center gap-2 bg-brand-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
                >
                    Try it Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border border-slate-200 text-text-primary rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                    Get in Touch
                </Link>
            </div>
        </div>
    );
}
