import { Link } from "react-router";
import { Button } from "@/app/components/ui/button";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, CheckCircle, AlertTriangle } from "lucide-react";

export function LandingPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              ProductLogik
            </h1>
            <p className="text-xs text-gray-500">
              Logic-Driven Product Intelligence
            </p>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - Split Screen */}
      <section className="container mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight text-gray-900">
              Turn 500 Jira tickets
              <br />
              into 3 priorities.
            </h2>
            <p className="text-lg text-gray-600">
              AI-powered product intelligence that cuts through the noise and
              tells you exactly what to build next.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Drag & Drop Zone */}
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
                ${
                  isDragActive
                    ? "border-indigo-600 bg-indigo-50"
                    : uploadedFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                {uploadedFile ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        File uploaded successfully!
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {uploadedFile.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FileUp className="w-12 h-12 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isDragActive
                          ? "Drop your CSV here"
                          : "Drag & drop your CSV"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to browse
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Supports Jira exports, customer feedback CSVs, and more
            </p>
          </div>
        </div>
      </section>

      {/* Warning Section - Black Background */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">
                  Are you stuck in an Agile Feature Factory?
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Shipping fast doesn't mean shipping smart. ProductLogik
                  detects anti-patterns in your development process — like
                  building features that tank user satisfaction — before they
                  become problems.
                </p>
                <div className="pt-2">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-400">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>High velocity, low impact</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-400">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Declining customer satisfaction despite releases</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-400">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Building what's easy, not what matters</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-8 text-center text-sm text-gray-500">
          © 2026 ProductLogik. Logic-Driven Product Intelligence.
        </div>
      </footer>
    </div>
  );
}
