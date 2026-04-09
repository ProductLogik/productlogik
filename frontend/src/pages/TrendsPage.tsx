import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Lock, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { getAnalysisTrends, getUserProfile } from "../lib/api";
import { Button } from "../components/ui/Button";

interface TrendData {
    upload_id: string;
    date: string;
    filename: string;
    health_score: number | null;
    themes: Record<string, number>;
}

export function TrendsPage() {
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tier, setTier] = useState<string>("demo");

    useEffect(() => {
        async function fetchTrends() {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No auth token");

                // Fetch live profile to get accurate tier
                const profile = await getUserProfile(token);
                setTier(profile.usage_quota?.plan_tier || "demo");

                const data = await getAnalysisTrends(token);
                setTrends(data.trends || []);
            } catch (err: any) {
                console.error("Failed to load trends:", err);
                setError(err.message || "Failed to load trends data");
            } finally {
                setLoading(false);
            }
        }
        fetchTrends();
    }, []);

    const isDemo = tier === "demo" || tier === "free";

    // Format data for Recharts
    const formatChartData = () => {
        // If demo, return mock data
        if (isDemo) {
            return [
                { name: "Jan 1", Health: 60, "Pricing Issues": 15, "Bugs": 20 },
                { name: "Jan 15", Health: 55, "Pricing Issues": 25, "Bugs": 10 },
                { name: "Feb 1", Health: 70, "Pricing Issues": 10, "Bugs": 5 },
                { name: "Feb 15", Health: 85, "Pricing Issues": 5, "Bugs": 2 },
            ];
        }

        // Real data processing
        return trends.map(t => {
            const date = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            // Recharts needs a flat object
            const dataPoint: any = {
                name: date,
                Health: t.health_score || 0,
                filename: t.filename
            };

            // Map themes into the flat object
            Object.keys(t.themes).forEach(themeName => {
                dataPoint[themeName] = t.themes[themeName];
            });

            return dataPoint;
        });
    };

    const chartData = formatChartData();
    const hasEnoughData = chartData.length >= 2;

    // Collect all unique theme names from the dataset to generate Line components dynamically
    const allThemes = new Set<string>();
    if (!isDemo) {
        trends.forEach(t => {
            Object.keys(t.themes).forEach(theme => allThemes.add(theme));
        });
    } else {
        allThemes.add("Pricing Issues");
        allThemes.add("Bugs");
    }

    const themeColors = ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#3b82f6"];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (error && !isDemo) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load Trends</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <Button asChild>
                    <Link to="/dashboard">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Trend Analytics</h1>
                <p className="text-slate-600">Visualize how your product health and user problems evolve over time.</p>
            </div>

            {(!hasEnoughData && !isDemo) ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                    <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Not Enough Data Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">
                        Trend charts require at least two successful AI analyses. Upload more CSV datasets over time to watch your metrics plot here automatically.
                    </p>
                    <Button asChild>
                        <Link to="/analyzer">Upload New Dataset</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-8 relative">
                    {/* DEMO OVERLAY */}
                    {isDemo && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-sm rounded-xl">
                            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center max-w-sm shadow-2xl">
                                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-brand-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Feature</h3>
                                <p className="text-slate-600 mb-6">
                                    Upgrade to plot historical trends across all your past analyses and track feature impact over time.
                                </p>
                                <Button asChild className="w-full h-12 text-base">
                                    <Link to="/pricing">Upgrade Plan</Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className={isDemo ? "opacity-30 pointer-events-none select-none" : ""}>
                        {/* CHART 1: Product Health */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="w-5 h-5 text-emerald-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Product Health Score Over Time</h2>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Area type="monotone" dataKey="Health" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CHART 2: Theme Volume */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Feedback Theme Volume</h2>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                        {Array.from(allThemes).map((themeName, idx) => (
                                            <Line
                                                key={themeName}
                                                type="monotone"
                                                dataKey={themeName}
                                                stroke={themeColors[idx % themeColors.length]}
                                                strokeWidth={3}
                                                dot={{ r: 4, strokeWidth: 2 }}
                                                activeDot={{ r: 6 }}
                                                connectNulls
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
