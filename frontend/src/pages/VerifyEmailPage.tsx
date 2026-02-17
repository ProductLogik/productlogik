import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { API_URL } from "../lib/api";

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setMessage(data.message || "Email verified successfully!");
                } else {
                    setStatus("error");
                    setMessage(data.detail || "Verification failed. The link may be invalid or expired.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred while verifying your email.");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-sm text-center">
                <CardHeader>
                    <div className={`mx-auto rounded-full p-3 mb-4 w-16 h-16 flex items-center justify-center ${status === "success" ? "bg-green-100 text-green-600" :
                            status === "error" ? "bg-red-100 text-red-600" :
                                "bg-blue-100 text-blue-600"
                        }`}>
                        {status === "success" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        ) : status === "error" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 animate-spin">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === "verifying" ? "Verifying..." :
                            status === "success" ? "Email Verified" :
                                "Verification Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-text-secondary">
                        {message}
                    </p>
                </CardContent>
                <CardFooter className="justify-center flex-col gap-2">
                    {status === "success" && (
                        <Button className="w-full" onClick={() => navigate("/login")}>
                            Log in now
                        </Button>
                    )}
                    <Link to="/" className="text-sm font-medium text-brand-600 hover:underline">
                        Return to Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
