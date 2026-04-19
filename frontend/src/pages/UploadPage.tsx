import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { UploadCloud, FileText, AlertCircle, Loader2 } from "lucide-react";
import { uploadCSV } from "../lib/api";
import { toast } from "sonner";

const PERSONA_OPTIONS = [
    { value: "", label: "Default — Balanced Analysis" },
    { value: "strict_agile", label: "Strict Agile Validation" },
    { value: "blue_sky", label: "Blue-Sky Ideation" },
    { value: "risk_churn", label: "Risk & Churn Analysis" },
];

export function UploadPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [ignoredWords, setIgnoredWords] = useState("");
    const [persona, setPersona] = useState("");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!file) return;

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setUploading(true);

        try {
            const result = await uploadCSV(file, token, ignoredWords, persona);
            toast.success(`Successfully uploaded ${result.row_count} feedback entries!`);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err: any) {
            if (err.message === "LIMIT_REACHED") {
                toast.error("Usage limit reached. Redirecting to contact support.");
                navigate("/contact");
            } else {
                toast.error(err.message || "Upload failed. Please try again.");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Start New Analysis</h1>
                    <p className="mt-2 text-text-secondary">Upload your product feedback to generate insights.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload Data</CardTitle>
                        <CardDescription>
                            Supported formats: CSV exports from Jira, Zendesk, SurveyMonkey, or any CSV with feedback text.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Upload Area */}
                        <div
                            {...getRootProps()}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${isDragActive ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="mb-4 rounded-full bg-slate-100 p-4">
                                <UploadCloud className="h-8 w-8 text-brand-600" />
                            </div>
                            <div className="text-center">
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="h-8 w-8 text-brand-600 mb-2" />
                                        <p className="text-sm font-medium text-text-primary">{file.name}</p>
                                        <p className="text-xs text-text-secondary">{(file.size / 1024).toFixed(2)} KB</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-text-primary">
                                            Drag & drop files here, or click to select
                                        </p>
                                        <p className="mt-1 text-xs text-text-secondary">
                                            Max file size: 25MB | Max rows: 5,000
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Analysis Lens */}
                        <div className="grid gap-2">
                            <label htmlFor="persona" className="text-sm font-medium text-text-primary">
                                Analysis Lens <span className="text-text-secondary font-normal">(optional)</span>
                            </label>
                            <select
                                id="persona"
                                value={persona}
                                onChange={(e) => setPersona(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                {PERSONA_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <p className="text-xs text-text-secondary">The AI will use this perspective when clustering themes.</p>
                        </div>

                        {/* Ignored Words */}
                        <div className="grid gap-2">
                            <label htmlFor="ignored-words" className="text-sm font-medium text-text-primary">
                                Ignored Topics <span className="text-text-secondary font-normal">(optional)</span>
                            </label>
                            <input
                                id="ignored-words"
                                type="text"
                                placeholder="e.g. pricing, login, bug"
                                value={ignoredWords}
                                onChange={(e) => setIgnoredWords(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                            <p className="text-xs text-text-secondary">Comma-separated topics to exclude from theme clustering.</p>
                        </div>

                        {/* Info Box */}
                        <div className="rounded-md bg-blue-50 p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium">What happens next?</p>
                                    <ul className="mt-2 space-y-1 list-disc list-inside">
                                        <li>Your CSV will be validated and parsed</li>
                                        <li>Feedback entries will be extracted and stored</li>
                                        <li>AI analysis will identify themes and insights</li>
                                        <li>Results will appear in your dashboard</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard")}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={!file || uploading}
                            onClick={handleUpload}
                            className="gap-2 bg-brand-600 hover:bg-brand-700"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Run Analysis"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
