import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { UploadCloud, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router";

export function UploadPage() {
    const [file, setFile] = useState<File | null>(null);

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
                            Supported formats: CSV, Excel exports (Jira, Zendesk, SurveyMonkey).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                        <p className="text-sm font-medium text-text-primary">{file.name}</p>
                                        <p className="text-xs text-text-secondary">{(file.size / 1024).toFixed(2)} KB</p>
                                        <Button variant="ghost" size="sm" className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}>Remove</Button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-text-primary">
                                            Drag & drop files here, or click to select
                                        </p>
                                        <p className="mt-1 text-xs text-text-secondary">
                                            Max file size: 10MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Preview Placeholder */}
                        {file && (
                            <div className="rounded-md border p-4 bg-slate-50">
                                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                                    <FileText className="h-4 w-4" />
                                    <span>Previewing first 3 rows...</span>
                                </div>
                                {/* Mock Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-text-secondary">
                                        <thead className="border-b bg-slate-100">
                                            <tr>
                                                <th className="p-2">ID</th>
                                                <th className="p-2">Source</th>
                                                <th className="p-2">Feedback</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-100">
                                                <td className="p-2">1</td>
                                                <td className="p-2">Jira</td>
                                                <td className="p-2">Customer wants dark mode...</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <td className="p-2">2</td>
                                                <td className="p-2">Zendesk</td>
                                                <td className="p-2">Login is slow on mobile...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="rounded-md bg-blue-50 p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium">Estimated Cost</p>
                                    <p>This analysis will use approximately 15 credits from your monthly quota.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button disabled={!file} asChild>
                            <Link to="/dashboard">Run Analysis</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
