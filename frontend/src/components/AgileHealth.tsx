import { AlertTriangle, TrendingUp, Lock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/Button";

interface AgileHealthProps {
    planTier: string;
    agileRisks?: any;
}

export function AgileHealth({ planTier, agileRisks }: AgileHealthProps) {
    const isDemo = planTier === "demo";
    const patterns = agileRisks?.detected_patterns || [];
    const summary = agileRisks?.analysis_summary || "AI-detected pattern based on recent velocity vs. sentiment trends.";

    return (
        <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-hidden">
            {isDemo && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[4px]">
                    <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-xl text-center max-w-[280px] shadow-2xl">
                        <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6 text-brand-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Pro Feature</h3>
                        <p className="text-slate-400 text-sm mb-4 leading-tight">
                            Upgrade to unlock AI-powered organizational dysfunction detection.
                        </p>
                        <Button asChild size="sm" className="w-full bg-brand-600 hover:bg-brand-700">
                            <Link to="/pricing">View Plans</Link>
                        </Button>
                    </div>
                </div>
            )}

            <div className={`transition-all duration-300 ${isDemo ? "opacity-30 select-none blur-sm pointer-events-none" : ""}`}>
                <h2 className="text-sm font-semibold text-white mb-4">
                    Team Health Check
                </h2>

                <div className="space-y-6">
                    {/* Render Mock for Demo users so the blur has nice content under it */}
                    {isDemo && (
                        <>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-rose-500 text-xs font-bold uppercase tracking-wide bg-rose-500/10 px-2 py-0.5 rounded">
                                            Risk Detected
                                        </span>
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-2">
                                        Feature Factory
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        High output but declining satisfaction suggests the team is optimizing for delivery over value.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-500 italic text-center">
                                    AI-detected pattern based on recent velocity vs. sentiment trends.
                                </p>
                            </div>
                        </>
                    )}

                    {/* Render Real Data for Pro Users */}
                    {!isDemo && patterns.length === 0 && (
                        <div className="flex gap-4 items-center bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-slate-400" />
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300">No Patterns Detected</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    We didn't find any agile anti-patterns in this dataset. <br />
                                    <span className="italic">Note: This feature works best with internal team updates, sprint retrospectives, and stakeholder communications.</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {!isDemo && patterns.length > 0 && patterns.map((p: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-amber-500 text-xs font-bold uppercase tracking-wide bg-amber-500/10 px-2 py-0.5 rounded">
                                        Risk Detected
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold text-white mb-2">
                                    {p.name}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    {p.evidence?.length ? `"${p.evidence[0]}"` : "Pattern detected in feedback."}
                                </p>
                                <div className="bg-slate-800/50 p-3 rounded text-sm text-brand-200 border border-brand-500/20">
                                    <strong>Recommendation:</strong> {p.recommendation}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!isDemo && (
                        <div className="pt-4 border-t border-slate-800">
                            <p className="text-xs text-slate-500 italic text-center">
                                {summary}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
