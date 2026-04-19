import { Button } from "../components/ui/Button";
import { Link } from "react-router";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Zap, Layers, Network } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";

export function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section with Mesh Gradient */}
            <section className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-32 bg-white">
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary sm:text-6xl lg:text-7xl mb-6">
                        Explainable AI for <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                            Product Decisions
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg sm:text-xl text-text-secondary mb-10 leading-relaxed">
                        A 100% free, solo-built MVP tool for Product Managers.
                    </p>

                    <div className="flex justify-center">
                        <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-brand-600/20">
                            <Link to="/upload">
                                Start Executive Analysis <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Social Proof Strip (Commented out for now)
                    <div className="mt-16 pt-8 border-t border-slate-200/60">
                        <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-6">Trusted by Product Teams at</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="font-display font-bold text-xl">Acme Corp</span>
                            <span className="font-display font-bold text-xl">GlobalBank</span>
                            <span className="font-display font-bold text-xl">TechFlow</span>
                            <span className="font-display font-bold text-xl">DataSystems</span>
                            <span className="font-display font-bold text-xl">FutureScale</span>
                        </div>
                    </div>
                    */}
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -ml-[40rem] -mt-16 w-[80rem] h-[40rem] bg-brand-200/20 blur-3xl rounded-full -z-10 animate-float" />
            </section>

            {/* Features Grid with Glassmorphism */}
            <section className="py-24 bg-slate-50 border-y border-slate-200/60 relative">
                {/* Subtle decoration for the features section */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/30 blur-3xl rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/30 blur-3xl rounded-full -z-10" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl mb-4">
                            Intelligence, not just Analytics
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Most tools count keywords. We understand context, intent, and strategic alignment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="CSV Upload & Instant Analysis"
                            description="Upload any CSV containing feedback text — support tickets, reviews, retro notes. No template required."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-6 w-6" />}
                            title="Explainable & Trusted"
                            description="Every AI insight links back to original customer quotes from your CSV. No fabricated claims, just evidence."
                        />
                        <FeatureCard
                            icon={<Network className="h-6 w-6" />}
                            title="Dual-LLM Redundancy"
                            description="Gemini AI runs as the primary engine with OpenAI as an automatic fallback — analysis continues even if one provider is down."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-6 w-6" />}
                            title="Thematic Extraction"
                            description="The AI identifies recurring themes across your dataset, each scored by sentiment, confidence, and mention count."
                        />
                        <FeatureCard
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            title="Confidence Scoring"
                            description="Each theme carries a confidence score reflecting how strongly the evidence supports the classification."
                        />
                        <FeatureCard
                            icon={<Layers className="h-6 w-6" />}
                            title="PDF Export"
                            description="Download a formatted PDF report of your analysis, including the executive summary, themes, and evidence quotes."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials (Commented out for now)
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="bg-brand-900 rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-20"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-8">"Finally, a tool that helps me explain <br /><i>why</i> we are building this."</h2>
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-white/10 border border-white/20 overflow-hidden">
                                    <div className="w-full h-full bg-brand-200"></div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Sarah Jenkins</div>
                                    <div className="text-brand-200">CPO at TechFlow</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            */}

            {/* Premium CTA */}
            <section className="py-24 bg-brand-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-4xl font-display font-bold tracking-tight text-white mb-6">Ready to read your feedback properly?</h2>
                    <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto opacity-90">
                        Upload a CSV and get structured themes, evidence quotes, and an executive summary in under a minute. Completely free.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" asChild className="h-14 px-10 text-lg shadow-xl shadow-brand-600/30">
                            <Link to="/upload">Start Free Analysis</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="glass border-white/40 hover:border-brand-200/50 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
                <p className="text-text-secondary leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
