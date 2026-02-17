import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export function AgileHealth() {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-white mb-4">
                Team Health Check
            </h2>

            <div className="space-y-6">
                {/* Warning Alert */}
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

                {/* Metrics */}
                <div className="pt-4 border-t border-slate-800">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Story Points Shipped</span>
                            <span className="text-slate-200 font-medium">42</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">User Satisfaction</span>
                            <div className="flex items-center text-rose-400 font-medium bg-rose-400/10 px-1.5 rounded">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                -12%
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Customer Churn</span>
                            <div className="flex items-center text-rose-400 font-medium bg-rose-400/10 px-1.5 rounded">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-500 italic text-center">
                        AI-detected pattern based on recent velocity vs. sentiment trends.
                    </p>
                </div>
            </div>
        </div>
    );
}
