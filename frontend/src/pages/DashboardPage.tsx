import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Link } from "react-router";
import { ArrowRight, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { getUserUploads, getUserProfile, deleteAnalysis } from "../lib/api";
import { Progress } from "../components/ui/Progress";
import type { Upload } from "../lib/api";
import { toast } from "sonner";

import demoIcon from '@/assets/demo-outline.svg';
import proIcon from '@/assets/pro-outline.svg';
import teamIcon from '@/assets/team-outline.svg';
import entIcon from '@/assets/enterprise-outline.svg';

export function DashboardPage() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [uploadToDelete, setUploadToDelete] = useState<{ id: string, name: string } | null>(null);

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
                setError(true);
                toast.error("Failed to load dashboard data. Please try logging in again.");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const confirmDelete = async () => {
        if (!uploadToDelete) return;

        const uploadId = uploadToDelete.id;

        try {
            setDeletingId(uploadId);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            await deleteAnalysis(uploadId, token);

            // Remove from local state
            setUploads(uploads.filter(u => u.upload_id !== uploadId));

            toast.success("Analysis deleted successfully");

            // Re-fetch profile to update quota
            const profileData = await getUserProfile(token);
            setUserProfile(profileData);

        } catch (err) {
            console.error("Failed to delete:", err);
            toast.error("Failed to delete analysis");
        } finally {
            setDeletingId(null);
            setUploadToDelete(null);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, uploadId: string, filename: string) => {
        e.preventDefault();
        setUploadToDelete({ id: uploadId, name: filename });
    };

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
                                <div className="p-2 bg-brand-100 rounded-xl flex items-center justify-center">
                                    {userProfile.usage_quota.plan_tier === "demo" && <img src={demoIcon} alt="" className="w-6 h-6" />}
                                    {userProfile.usage_quota.plan_tier === "pro" && <img src={proIcon} alt="" className="w-6 h-6" />}
                                    {userProfile.usage_quota.plan_tier === "team" && <img src={teamIcon} alt="" className="w-6 h-6" />}
                                    {userProfile.usage_quota.plan_tier === "enterprise" && <img src={entIcon} alt="" className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">
                                        <span className="capitalize">{userProfile.usage_quota.plan_tier}</span> Plan Usage
                                    </h3>
                                    <p className="text-sm text-text-secondary">
                                        {userProfile.usage_quota.analyses_used} of {userProfile.usage_quota.analyses_limit >= 9999 ? "∞" : userProfile.usage_quota.analyses_limit} analyses used
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 max-w-xs">
                                <Progress
                                    value={Math.min(100, (userProfile.usage_quota.analyses_used / userProfile.usage_quota.analyses_limit) * 100)}
                                    className="h-2 mb-2 bg-slate-200"
                                    indicatorClassName="bg-brand-600"
                                />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-secondary">
                                        {userProfile.usage_quota.analyses_limit >= 9999
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
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <p className="text-text-secondary">Unable to load dashboard data.</p>
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

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center text-sm font-medium text-brand-600 group-hover:text-brand-700">
                                            View Insights <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteClick(e, upload.upload_id, upload.filename)}
                                            disabled={deletingId === upload.upload_id}
                                            className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded bg-red-50 border border-red-200 shadow-sm transition-colors relative z-10"
                                            title="Delete Analysis"
                                        >
                                            {deletingId === upload.upload_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {uploadToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 text-red-600">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">Delete Analysis</h2>
                            <p className="text-sm text-slate-500 mb-4">
                                Are you sure you want to permanently delete "<strong>{uploadToDelete.name}</strong>"?
                            </p>
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-800 mb-6">
                                <p className="font-semibold mb-1">Warning:</p>
                                <ul className="list-disc pl-4 space-y-1 text-red-700">
                                    <li>This action cannot be undone. All insights and raw data will be purged.</li>
                                    <li><strong>Deleting this record will not restore your analysis credit.</strong> It is permanently consumed.</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setUploadToDelete(null)}
                                    disabled={deletingId !== null}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={confirmDelete}
                                    disabled={deletingId !== null}
                                >
                                    {deletingId ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : "Confirm Delete"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
