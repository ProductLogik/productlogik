import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";

import { ExpandableThemeList } from "../components/ExpandableThemeList";
import { AgileHealth } from "../components/AgileHealth";
import { ShareModal } from "../components/ShareModal";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, Share2 } from "lucide-react";
import { getAnalysis, exportAnalysis } from "../lib/api";
import type { AnalysisResult } from "../lib/api";

export function ResultsPage() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
            alert("Failed to download PDF. Please try again.");
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
            } finally {
                setLoading(false);
            }
        }

        fetchAnalysis();

        return () => {
            if (intervalId) clearTimeout(intervalId);
        };
    }, [id]);

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
        return (
            <div className="container mx-auto py-8 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${analysis.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                    {analysis.status === 'failed' ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : (
                        <Loader2 className="h-6 w-6 text-yellow-600 animate-spin" />
                    )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {analysis.status === 'failed' ? 'Analysis Failed' : 'Analysis in Progress'}
                </h2>
                <p className="text-gray-600 mb-6">
                    {analysis.message || (analysis.status === 'failed'
                        ? "Something went wrong during analysis."
                        : "Your file is being processed. Please check back in a few moments.")}
                </p>
                <Button asChild variant="outline">
                    <Link to="/dashboard">Back to Dashboard</Link>
                </Button>
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
                            <ExpandableThemeList themes={analysis.themes} />
                        </div>
                    </div>
                </div>

                {/* Column 2: Agile Health & Metadata (Sidebar) */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-display font-bold tracking-tight text-text-primary mb-4 flex items-center gap-2">
                            Anti-Pattern Detector
                        </h2>
                        <AgileHealth />
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
