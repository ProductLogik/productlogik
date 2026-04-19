import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { getPublicAnalysis } from "../lib/api";
import type { Theme } from "../lib/api";
import { ExpandableThemeList } from "../components/ExpandableThemeList";
import { Button } from "../components/ui/Button";

export function SharedResultsPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{
        filename: string;
        row_count: number;
        themes: Theme[];
        executive_summary: string;
        confidence_score: number;
        created_at?: string;
    } | null>(null);

    useEffect(() => {
        if (!id) return;
        getPublicAnalysis(id)
            .then(setData)
            .catch((err) => setError(err.message || "Analysis not found"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto py-16 px-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">Analysis Not Found</h1>
                <p className="text-text-secondary mb-6">{error || "This shared link may be invalid or expired."}</p>
                <Button asChild>
                    <Link to="/">Go to ProductLogik</Link>
                </Button>
            </div>
        );
    }

    const formattedDate = data.created_at
        ? new Date(data.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : null;

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="mb-8 p-4 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-between gap-4">
                <p className="text-sm text-brand-700">
                    You are viewing a <strong>read-only shared analysis</strong> from ProductLogik.
                </p>
                <Button size="sm" asChild>
                    <Link to="/signup">
                        Try it free <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </Button>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">{data.filename}</h1>
                <p className="text-sm text-text-secondary mt-1">
                    {data.row_count} feedback entries
                    {formattedDate && ` · Analysed ${formattedDate}`}
                    {` · ${(data.confidence_score ?? 0).toFixed(0)}% overall confidence`}
                </p>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand-500"></span>
                        Executive Summary
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed text-justify">
                        {data.executive_summary}
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-text-primary mb-4">Extracted Themes</h2>
                    <ExpandableThemeList themes={data.themes} />
                </div>
            </div>
        </div>
    );
}
