import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Link } from "react-router";
import { ArrowRight, FileText, Loader2, Plus, Zap } from "lucide-react";
import { getUserUploads, getUserProfile } from "../lib/api";
import { Progress } from "../components/ui/Progress";
import type { Upload } from "../lib/api";

export function DashboardPage() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const [uploadsData, profileData] = await Promise.all([
                    getUserUploads(token),
                    getUserProfile(token)
                ]);

                setUploads(uploadsData.uploads);
                setUserProfile(profileData);
            } catch (err: any) {
                console.error("Failed to fetch uploads:", err);
                if (err.message && (err.message.includes("401") || err.message.includes("Unauthorized") || err.message.includes("permissions"))) {
                    // Token expired or invalid
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return;
                }
                setError("Failed to load dashboard data. Please try logging in again.");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary">Your recent feedback analyses.</p>
                </div>
                <Button asChild>
                    <Link to="/upload">
                        <Plus className="mr-2 h-4 w-4" /> New Analysis
                    </Link>
                </Button>
            </div>

            {userProfile?.usage_quota && (
                <Card className="mb-8 border-brand-100 bg-brand-50/30 overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">
                                        <span className="capitalize">{userProfile.usage_quota.plan_tier}</span> Plan Usage
                                    </h3>
                                    <p className="text-sm text-text-secondary">
                                        {userProfile.usage_quota.analyses_used} of {userProfile.usage_quota.analyses_limit === 999999 ? "∞" : userProfile.usage_quota.analyses_limit} analyses used
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 max-w-xs">
                                <Progress
                                    value={Math.min(100, (userProfile.usage_quota.analyses_used / userProfile.usage_quota.analyses_limit) * 100)}
                                    className="h-2 mb-2"
                                    indicatorClassName="bg-brand-600"
                                />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-secondary">
                                        {userProfile.usage_quota.analyses_limit === 999999
                                            ? "Unlimited credits"
                                            : `${userProfile.usage_quota.analyses_limit - userProfile.usage_quota.analyses_used} credits left`}
                                    </span>
                                    <Link to="/usage" className="text-brand-600 font-medium hover:underline">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                </div>
            ) : error ? (
                <div className="rounded-lg bg-red-50 p-4 text-red-800 border border-red-200">
                    {error}
                </div>
            ) : uploads.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">No analyses yet</h3>
                    <p className="text-text-secondary mt-1 mb-6">Upload your first CSV file to get AI insights.</p>
                    <Button asChild>
                        <Link to="/upload">Start Analysis</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {uploads.map((upload) => (
                        <Link key={upload.upload_id} to={`/results/${upload.upload_id}`} className="block group">
                            <Card className="h-full transition-all hover:shadow-md hover:border-brand-200 border-l-4 border-l-brand-500">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg text-text-primary truncate pr-2" title={upload.filename}>
                                            {upload.filename}
                                        </CardTitle>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${upload.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            upload.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {upload.status === 'completed' ? 'Ready' :
                                                upload.status === 'failed' ? 'Failed' : 'Processing'}
                                        </span>
                                    </div>
                                    <CardDescription>
                                        {new Date(upload.created_at).toLocaleDateString()} • {upload.row_count} rows
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-text-secondary">
                                            {upload.status === 'completed'
                                                ? `${upload.theme_count} themes identified`
                                                : "Analysis in progress..."
                                            }
                                        </p>

                                        {upload.shared_at && (
                                            <div className="flex items-center text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded w-fit">
                                                Shared with you
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center text-sm font-medium text-brand-600 group-hover:text-brand-700">
                                        View Insights <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
