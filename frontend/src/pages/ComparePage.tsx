import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Loader2, GitCompareArrows } from "lucide-react";
import { getUserUploads, compareAnalyses } from "../lib/api";
import type { Upload } from "../lib/api";
import { toast } from "sonner";

export function ComparePage() {
    const navigate = useNavigate();
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loadingUploads, setLoadingUploads] = useState(true);
    const [selectedA, setSelectedA] = useState("");
    const [selectedB, setSelectedB] = useState("");
    const [comparing, setComparing] = useState(false);
    const [result, setResult] = useState<{
        upload_a: { filename: string; created_at: string | null };
        upload_b: { filename: string; created_at: string | null };
        synthesis: string;
    } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        getUserUploads(token)
            .then((data) => {
                const completed = data.uploads.filter((u) => u.has_analysis && u.theme_count > 0);
                setUploads(completed);
            })
            .catch(() => toast.error("Failed to load analyses"))
            .finally(() => setLoadingUploads(false));
    }, [navigate]);

    const handleCompare = async () => {
        if (!selectedA || !selectedB) {
            toast.error("Please select two different analyses to compare.");
            return;
        }
        if (selectedA === selectedB) {
            toast.error("Please select two different analyses.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        setComparing(true);
        setResult(null);
        try {
            const data = await compareAnalyses(selectedA, selectedB, token);
            setResult(data);
        } catch (err: any) {
            toast.error(err.message || "Comparison failed. Please try again.");
        } finally {
            setComparing(false);
        }
    };

    const formatDate = (iso: string | null | undefined) => {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">A/B Analysis Comparison</h1>
                <p className="mt-2 text-text-secondary">
                    Select two past analyses. The AI will synthesise what changed between them.
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Select Two Analyses</CardTitle>
                    <CardDescription>Only analyses with completed themes are shown.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loadingUploads ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                        </div>
                    ) : uploads.length < 2 ? (
                        <p className="text-sm text-text-secondary py-4 text-center">
                            You need at least 2 completed analyses to use this feature.{" "}
                            <span
                                className="text-brand-600 cursor-pointer hover:underline"
                                onClick={() => navigate("/upload")}
                            >
                                Upload more data
                            </span>.
                        </p>
                    ) : (
                        <>
                            <div className="grid gap-2">
                                <label htmlFor="dataset-a" className="text-sm font-medium text-text-primary">Dataset A (Baseline)</label>
                                <select
                                    id="dataset-a"
                                    value={selectedA}
                                    onChange={(e) => setSelectedA(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">— Select analysis —</option>
                                    {uploads.map((u) => (
                                        <option key={u.upload_id} value={u.upload_id}>
                                            {u.filename} · {u.theme_count} themes · {formatDate(u.created_at)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="dataset-b" className="text-sm font-medium text-text-primary">Dataset B (Comparison)</label>
                                <select
                                    id="dataset-b"
                                    value={selectedB}
                                    onChange={(e) => setSelectedB(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">— Select analysis —</option>
                                    {uploads.map((u) => (
                                        <option key={u.upload_id} value={u.upload_id}>
                                            {u.filename} · {u.theme_count} themes · {formatDate(u.created_at)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                onClick={handleCompare}
                                disabled={comparing || !selectedA || !selectedB}
                                className="w-full gap-2 bg-brand-600 hover:bg-brand-700"
                            >
                                {comparing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Comparing…
                                    </>
                                ) : (
                                    <>
                                        <GitCompareArrows className="h-4 w-4" />
                                        Run Comparison
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">AI Synthesis</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary">
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                            <p className="font-semibold text-text-primary text-sm mb-0.5">Dataset A</p>
                            <p>{result.upload_a.filename}</p>
                            {result.upload_a.created_at && <p>{formatDate(result.upload_a.created_at)}</p>}
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                            <p className="font-semibold text-text-primary text-sm mb-0.5">Dataset B</p>
                            <p>{result.upload_b.filename}</p>
                            {result.upload_b.created_at && <p>{formatDate(result.upload_b.created_at)}</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line text-justify">
                            {result.synthesis}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
