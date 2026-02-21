import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { login, getUserUploads } from "../lib/api";
import { toast } from "sonner";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.access_token);
            // Notify navbar of login state change
            window.dispatchEvent(new Event("loginStateChanged"));

            // Check if user has existing uploads
            try {
                const uploadsData = await getUserUploads(data.access_token);
                if (uploadsData.uploads && uploadsData.uploads.length > 0) {
                    navigate("/dashboard");
                } else {
                    navigate("/upload");
                }
            } catch (uploadError) {
                console.warn("Failed to check uploads, defaulting to dashboard", uploadError);
                navigate("/dashboard");
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Log in</CardTitle>
                    <CardDescription>
                        Enter your email to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-bg-paper px-2 text-text-secondary">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                        Google (Coming Soon)
                    </Button>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-text-secondary">
                        Don't have an account? <Link to="/signup" className="text-brand-600 hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
