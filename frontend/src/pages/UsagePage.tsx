import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { getUserProfile } from "../lib/api";
import { Loader2, AlertCircle } from "lucide-react";

export function UsagePage() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }
                const profile = await getUserProfile(token);
                setUserData(profile);
            } catch (err: any) {
                console.error("Failed to fetch usage data:", err);
                setError("Failed to load usage information.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const quota = userData?.usage_quota || { plan_tier: "demo", analyses_limit: 3, analyses_used: 0 };
    const remaining = Math.max(0, quota.analyses_limit - quota.analyses_used);
    const usagePercent = Math.min(100, (quota.analyses_used / quota.analyses_limit) * 100);

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-3xl font-bold text-text-primary">Usage & Limits</h1>
                <p className="mt-2 text-text-secondary">Monitor your usage and plan limits.</p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Analysis Quota</CardTitle>
                        <CardDescription>
                            Usage for the current billing cycle
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-text-secondary">Analyses Used: <span className="text-text-primary">{quota.analyses_used}</span></span>
                            <span className="text-text-secondary">Limit: <span className="text-text-primary">{quota.analyses_limit === 999999 ? "Unlimited" : quota.analyses_limit}</span></span>
                        </div>
                        <Progress
                            value={usagePercent}
                            className="h-2 w-full bg-slate-100"
                            indicatorClassName={usagePercent > 90 ? "bg-red-500" : "bg-brand-600"}
                        />
                        <p className="text-xs text-text-secondary">
                            {quota.analyses_limit === 999999
                                ? "You have unlimited analyses on the Team plan."
                                : `You have ${remaining} analyses remaining this month.`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan: <span className="capitalize text-brand-600">{quota.plan_tier}</span></CardTitle>
                        <CardDescription>
                            {quota.plan_tier === "pro" ? "€59/month • Billed monthly" :
                                quota.plan_tier === "team" ? "€199/month • Billed monthly" :
                                    "Free Tier"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary">
                            {quota.plan_tier === "demo" && (
                                <>
                                    <li>3 analyses per month</li>
                                    <li>Basic AI theme identification</li>
                                    <li>Watermarked PDF reports</li>
                                    <li className="text-brand-600 font-medium list-none -ml-5 mt-2">↑ Upgrade to Pro for 50 uploads and no watermarks!</li>
                                </>
                            )}
                            {quota.plan_tier === "pro" && (
                                <>
                                    <li>50 analyses per month</li>
                                    <li>Agile Anti-Pattern Detection</li>
                                    <li>Product Health Score</li>
                                    <li>Clean professional PDF exports</li>
                                </>
                            )}
                            {quota.plan_tier === "team" && (
                                <>
                                    <li>Unlimited feedback analyses</li>
                                    <li>Multi-source integrations</li>
                                    <li>AI Roadmap Generator</li>
                                    <li>Team collaboration features</li>
                                </>
                            )}
                        </ul>
                        <div className="mt-6 flex gap-4">
                            <Button variant="outline" asChild>
                                <a href="https://billing.stripe.com/p/login/test_91c01L5bV6O21vG3cc" target="_blank" rel="noopener noreferrer">
                                    Manage Billing
                                </a>
                            </Button>
                            {quota.plan_tier === "demo" && (
                                <Button asChild>
                                    <a href="/pricing">Upgrade Plan</a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
