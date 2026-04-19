import { FileText, Upload, AlertCircle } from "lucide-react";
import { Link } from "react-router";

export function IntegrationsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">Integrations</h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                    How to get your feedback data into ProductLogik today, and what's planned next.
                </p>
            </div>

            <div className="mb-12">
                <h2 className="text-xl font-display font-bold text-text-primary mb-6">Currently Supported</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IntegrationCard
                        icon={<FileText className="h-5 w-5 text-brand-600" />}
                        title="CSV / Spreadsheet Upload"
                        status="Live"
                        description="Export from any tool that produces a CSV and upload directly. Jira, Zendesk, Intercom, Typeform, Google Forms, App Store reviews — anything exportable works."
                    />
                    <IntegrationCard
                        icon={<Upload className="h-5 w-5 text-brand-600" />}
                        title="Manual Paste"
                        status="Live"
                        description="Copy feedback text into a spreadsheet, save as CSV, and upload. No specific column format is required — just make sure your feedback text is in one column."
                    />
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-xl font-display font-bold text-text-primary mb-2">CSV Format Guide</h2>
                <p className="text-sm text-text-secondary mb-5">ProductLogik looks for text-heavy columns in your CSV. Here's what works well:</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-700 overflow-x-auto">
                    <div className="text-slate-400 mb-2"># Example: single-column feedback</div>
                    <div>feedback</div>
                    <div>"The onboarding flow is confusing and I couldn't find the export button"</div>
                    <div>"Love the product but it crashes every time I filter by date"</div>
                    <div>"Would be great to have a Slack integration"</div>
                    <div className="mt-3 text-slate-400"># Multi-column also works — text columns are detected automatically</div>
                    <div>ticket_id,source,feedback_text</div>
                    <div>1001,zendesk,"Response times have gotten worse over the last month"</div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-display font-bold text-text-primary mb-6">Planned Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Notion Database", "Airtable", "Zendesk Direct Pull", "Intercom Export", "Linear Issues", "Google Sheets"].map(name => (
                        <div key={name} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-white">
                            <AlertCircle className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                            <span className="text-sm text-text-secondary">{name}</span>
                            <span className="ml-auto text-xs text-slate-400 font-medium">Planned</span>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-text-secondary mt-6">
                    Want a specific integration prioritised? <Link to="/contact" className="text-brand-600 hover:text-brand-700 font-medium">Let me know.</Link>
                </p>
            </div>
        </div>
    );
}

function IntegrationCard({ icon, title, status, description }: { icon: React.ReactNode; title: string; status: string; description: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-text-primary">{title}</p>
                    <span className="inline-flex items-center text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-2 py-0.5">{status}</span>
                </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed text-justify">{description}</p>
        </div>
    );
}
