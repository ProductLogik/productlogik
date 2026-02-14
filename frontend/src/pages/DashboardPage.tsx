import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Link } from "react-router";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function DashboardPage() {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary">Overview of product feedback insights.</p>
                </div>
                <Button asChild>
                    <Link to="/upload">New Analysis</Link>
                </Button>
            </div>

            {/* Anti-Pattern Alert */}
            <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-yellow-900">Agile Anti-Pattern Detected: "Feature Factory"</h3>
                        <p className="text-sm text-yellow-800 mt-1">High volume of output-focused tickets without clear outcome metrics linked. Consider reviewing OKR alignment.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Theme Card 1 - High Priority */}
                <Link to="/results/1" className="block group">
                    <Card className="h-full transition-shadow hover:shadow-md border-l-4 border-l-brand-500">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-brand-700">Mobile UX Friction</CardTitle>
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                    High Priority
                                </span>
                            </div>
                            <CardDescription>Affects 35% of recent feedback</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-secondary line-clamp-3">
                                Users are reporting significant difficulty navigating the main menu on iOS devices. This correlates with a drop in mobile conversion rates.
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-brand-600">
                                See Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Theme Card 2 - Medium Priority */}
                <Link to="/results/2" className="block group">
                    <Card className="h-full transition-shadow hover:shadow-md border-l-4 border-l-yellow-400">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-text-primary">Reporting Export</CardTitle>
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                    Medium Priority
                                </span>
                            </div>
                            <CardDescription>Affects 15% of recent feedback</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-secondary line-clamp-3">
                                Enterprise customers are requesting PDF exports for quarterly reports. Current CSV export is insufficient for executive presentations.
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-brand-600">
                                See Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Theme Card 3 - Low Priority */}
                <Link to="/results/3" className="block group">
                    <Card className="h-full transition-shadow hover:shadow-md border-l-4 border-l-slate-300">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-text-primary">Dark Mode Support</CardTitle>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                    Low Priority
                                </span>
                            </div>
                            <CardDescription>Affects 5% of recent feedback</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-secondary line-clamp-3">
                                Nice-to-have request from developer user base. Does not block core workflows but is frequently mentioned as a preference.
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-brand-600">
                                See Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
