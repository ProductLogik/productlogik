import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";

import { ExpandableThemeList } from "../components/ExpandableThemeList";
import { AgileHealth } from "../components/AgileHealth";
import { ProductHealthScore } from "../components/ProductHealthScore";
import { ShareModal } from "../components/ShareModal";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, Share2, Link2, RefreshCw, Clock } from "lucide-react";
import { getAnalysis, exportAnalysis, retryAnalysis } from "../lib/api";
import type { AnalysisResult } from "../lib/api";
import { toast } from "sonner";

export function ResultsPage() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Retry state
    const [isRetrying, setIsRetrying] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const handleDownload = async () => {
        if (!id) return;
        try {
            setExporting(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token");

            const blob = await exportAnalysis(id, token);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ProductLogik_Report_${id.substring(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to export PDF:", err);
            toast.error("Failed to download PDF. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        let intervalId: any;

        async function fetchAnalysis() {
            if (!id) return;
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No auth token");

                const data = await getAnalysis(id, token);
                setAnalysis(data);

                // If still pending, poll again in 3 seconds
                if (data.status === "pending") {
                    intervalId = setTimeout(fetchAnalysis, 3000);
                }
            } catch (err) {
                console.error("Failed to fetch analysis:", err);
                setError("Failed to load analysis results");
                toast.error("Failed to load analysis results");
            } finally {
                setLoading(false);
            }
        }

        fetchAnalysis();

        return () => {
            if (intervalId) clearTimeout(intervalId);
        };
    }, [id]);

    // Handle Retry Countdown Logic
    useEffect(() => {
        if (!analysis || analysis.status !== "failed" || !analysis.created_at) return;

        const RETRY_DELAY_MS = 60 * 60 * 1000; // 1 hour
        const creationTime = new Date(analysis.created_at).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const timePassed = now - creationTime;
            const timeRemaining = RETRY_DELAY_MS - timePassed;

            if (timeRemaining > 0) {
                setCountdown(timeRemaining);
            } else {
                setCountdown(null);
            }
        };

        // Initial check
        updateCountdown();

        // Only run timer if we have time remaining
        const timerId = setInterval(() => {
            updateCountdown();
        }, 1000);

        return () => clearInterval(timerId);
    }, [analysis]);

    const formatCountdown = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const handleRetry = async () => {
        if (!id || countdown !== null) return;

        try {
            setIsRetrying(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token");

            await retryAnalysis(id, token);
            toast.success("Analysis re-queued successfully.");

            // Re-trigger fetching loop by artificially setting it to pending
            setAnalysis({
                ...(analysis || {}), // appeassing strict null checks
                upload_id: id,
                filename: analysis?.filename || "Unknown File",
                row_count: analysis?.row_count || 0,
                status: "pending",
                message: "Starting analysis...",
                themes: [],
                executive_summary: "",
                confidence_score: 0,
                processing_time_ms: 0,
                has_themes: false
            } as AnalysisResult);

        } catch (err: any) {
            console.error("Retry failed:", err);
            toast.error(err.message || "Failed to restart analysis.");
        } finally {
            setIsRetrying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="container mx-auto py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{error || "Analysis not found"}</h2>
                <Button asChild variant="outline">
                    <Link to="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    if (analysis.status === "pending" || analysis.status === "failed") {
        const isFailed = analysis.status === "failed";
        const isExhausted = isFailed && analysis.message && analysis.message.includes("Exhausted");

        return (
            <div className="container mx-auto py-8 text-center max-w-2xl">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 shadow-sm border ${isFailed ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
                    }`}>
                    {isFailed ? (
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    ) : (
                        <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                    )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {isFailed ? 'Analysis Incomplete' : 'Analysis in Progress'}
                </h2>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 text-left max-w-lg mx-auto">
                    <p className={`text-base font-medium mb-3 ${isFailed ? 'text-red-700' : 'text-gray-700'}`}>
                        {isFailed ? "Status Update:" : "Current Status:"}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {analysis.message || (isFailed
                            ? "An unexpected system error occurred during processing."
                            : "Your file is being processed by the AI engine. Please check back in a few moments.")}
                    </p>

                    {isFailed && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <strong>Credits Protected:</strong> Your usage limit is only impacted by successful analyses. You will not lose a scan credit for this failure.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild variant="outline" className="w-full sm:w-auto h-11 px-6">
                        <Link to="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Link>
                    </Button>

                    {isFailed && (
                        <div className="w-full sm:w-auto flex items-center justify-center">
                            {countdown !== null && isExhausted ? (
                                <Button disabled variant="secondary" className="w-full sm:w-auto h-11 px-6 bg-slate-100 text-slate-500 border border-slate-200">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Retry inside {formatCountdown(countdown)}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                    className="w-full sm:w-auto h-11 px-6 bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                                >
                                    {isRetrying ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Restarting...</>
                                    ) : (
                                        <><RefreshCw className="w-4 h-4 mr-2" /> Retry Analysis</>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Button variant="ghost" className="pl-0 mb-4 text-text-secondary hover:text-brand-600 hover:bg-transparent -ml-2 transition-colors group" asChild>
                    <Link to="/dashboard" className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-text-primary mb-3">
                            Analysis Results
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                                {analysis.filename}
                            </span>
                            <span className="text-xs text-text-secondary">
                                Generated {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Column 1: The Priorities (Merged with Theme Explorer) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <div className="mb-2">
                            <h2 className="text-xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2">
                                The Priorities
                            </h2>
                            <p className="text-sm text-text-secondary mt-1">
                                Executive summary and key themes extracted from feedback.
                            </p>
                        </div>

                        {/* Executive Summary Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <h3 className="text-base font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-brand-500"></span>
                                Executive Summary
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed text-justify">
                                {analysis.executive_summary}
                            </p>
                        </div>

                        {/* Expandable Theme List */}
                        <div>
                            <ExpandableThemeList
                                themes={analysis.themes}
                                uploadId={id}
                                token={localStorage.getItem("token") ?? undefined}
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2: Agile Health & Metadata (Sidebar) */}
                <div className="space-y-6">
                    <div>
                        <ProductHealthScore planTier={analysis.plan_tier || 'demo'} agileRisks={analysis.agile_risks} />

                        <h2 className="text-xl font-display font-bold tracking-tight text-text-primary mb-4 flex items-center gap-2">
                            Anti-Pattern Detector
                        </h2>
                        <AgileHealth planTier={analysis.plan_tier || 'demo'} agileRisks={analysis.agile_risks} />
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-base font-display font-semibold text-text-primary mb-4">Analysis Metadata</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Feedback</span>
                                    <span className="font-medium">{analysis.row_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Themes Found</span>
                                    <span className="font-medium">{analysis.themes.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Confidence</span>
                                    <span className="font-medium">{(analysis.confidence_score || 0).toFixed(0)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Processing Time</span>
                                    <span className="font-medium">{((analysis.processing_time_ms || 0) / 1000).toFixed(2)}s</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            size="lg"
                            className="w-full h-12 text-base shadow-sm"
                            onClick={handleDownload}
                            disabled={exporting}
                        >
                            {exporting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                            {exporting ? "Exporting..." : "Download Report (PDF)"}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start h-auto py-3 whitespace-normal text-left"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Analysis
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start h-auto py-3 whitespace-normal text-left"
                            onClick={() => {
                                const url = `${window.location.origin}/shared/${id}`;
                                navigator.clipboard.writeText(url);
                                toast.success("Public link copied to clipboard!");
                            }}
                        >
                            <Link2 className="mr-2 h-4 w-4" />
                            Copy Public Link
                        </Button>
                    </div>
                </div>
            </div>

            {analysis && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    uploadId={analysis.upload_id}
                    filename={analysis.filename}
                />
            )}
        </div>
    );
}
