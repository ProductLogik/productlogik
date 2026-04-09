import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { getUserProfile } from "../lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function UsagePage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

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
                setError(true);
                toast.error("Failed to load usage information.");
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
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-lg border border-slate-200">
                    <AlertCircle className="h-5 w-5" />
                    <span>Unable to load usage data.</span>
                </div>
            </div>
        );
    }

    const quota = userData?.usage_quota || { analyses_used: 0 };
    const LIMIT = 3;
    const remaining = Math.max(0, LIMIT - quota.analyses_used);
    const usagePercent = Math.min(100, (quota.analyses_used / LIMIT) * 100);

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-3xl font-bold text-text-primary">Usage & Limits</h1>
                <p className="mt-2 text-text-secondary">Monitor your usage limits.</p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Analysis Quota</CardTitle>
                        <CardDescription>
                            Usage for the current account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-text-secondary">Analyses Used: <span className="text-text-primary">{quota.analyses_used}</span></span>
                            <span className="text-text-secondary">Limit: <span className="text-text-primary">{LIMIT}</span></span>
                        </div>
                        <Progress
                            value={usagePercent}
                            className="h-2 w-full bg-slate-100"
                            indicatorClassName={usagePercent > 90 ? "bg-red-500" : "bg-brand-600"}
                        />
                        <p className="text-xs text-text-secondary">
                            You have {remaining} analyses remaining.
                        </p>
                        {remaining === 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-sm text-text-secondary mb-4">You have reached the maximum number of analyses allowed. If you need more usage or have a special use case, please contact support.</p>
                                <Button className="bg-brand-600 hover:bg-brand-700 w-full" onClick={() => navigate("/contact")}>
                                    Contact Support
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
