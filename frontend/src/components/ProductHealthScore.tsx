import { Lock, Activity } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/Button";

interface ProductHealthScoreProps {
    planTier: string;
    agileRisks?: any;
}

export function ProductHealthScore({ planTier, agileRisks }: ProductHealthScoreProps) {
    const isDemo = planTier === "demo";

    // Default to a mock score of 85 for purely aesthetic reasons if the blur is active
    // Otherwise use the real score, and if the data is missing, default to 0
    const score = isDemo ? 85 : (agileRisks?.product_health_score ?? 0);

    const reasoning = isDemo
        ? "AI-generated health score based on organizational alignment and dysfunction patterns."
        : (agileRisks?.product_health_reasoning ?? "Generating organizational health score...");

    // Determine color based on score
    let strokeColor = "text-emerald-500";
    let bgColor = "text-emerald-500/20";
    let statusText = "Excellent Alignment";

    if (score < 50) {
        strokeColor = "text-rose-500";
        bgColor = "text-rose-500/20";
        statusText = "Critical Risk";
    } else if (score < 80) {
        strokeColor = "text-amber-500";
        bgColor = "text-amber-500/20";
        statusText = "Monitor Closely";
    }

    // Circular progress math
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-hidden mb-6">
            {isDemo && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[4px]">
                    <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-xl text-center max-w-[280px] shadow-2xl">
                        <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6 text-brand-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Pro Feature</h3>
                        <p className="text-slate-400 text-sm mb-4 leading-tight">
                            Upgrade to unlock your AI Product Health Score.
                        </p>
                        <Button asChild size="sm" className="w-full bg-brand-600 hover:bg-brand-700">
                            <Link to="/pricing">View Plans</Link>
                        </Button>
                    </div>
                </div>
            )}

            <div className={`transition-all duration-300 ${isDemo ? "opacity-30 select-none blur-sm pointer-events-none" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-brand-400" />
                    <h2 className="text-sm font-semibold text-white">
                        Product Health Score
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    {/* Ring */}
                    <div className="relative flex-shrink-0 flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                                className={`${bgColor}`}
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx="48"
                                cy="48"
                            />
                            <circle
                                className={`${strokeColor} transition-all duration-1000 ease-out`}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx="48"
                                cy="48"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold tracking-tighter text-white">
                                {score}
                            </span>
                        </div>
                    </div>

                    {/* Reasoning */}
                    <div className="flex-1 mt-1">
                        <h3 className="text-base font-semibold text-white mb-2">
                            {statusText}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {reasoning}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
