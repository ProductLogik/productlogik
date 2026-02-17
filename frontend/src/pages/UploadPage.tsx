import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { UploadCloud, FileText, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { uploadCSV } from "../lib/api";

export function UploadPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
        setError(null);
        setSuccess(null);
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
        setError(null);
        setSuccess(null);

        try {
            const result = await uploadCSV(file, token);
            setSuccess(`Successfully uploaded ${result.row_count} feedback entries!`);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Upload failed. Please try again.");
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
                                                setError(null);
                                                setSuccess(null);
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
                                            Max file size: 10MB | Max rows: 10,000
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                    <div className="text-sm text-red-700">
                                        <p className="font-medium">Upload Failed</p>
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="rounded-md bg-green-50 p-4 border border-green-200">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <div className="text-sm text-green-700">
                                        <p className="font-medium">Upload Successful!</p>
                                        <p>{success}</p>
                                        <p className="mt-1 text-xs">Redirecting to dashboard...</p>
                                    </div>
                                </div>
                            </div>
                        )}

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
                            className="gap-2"
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
