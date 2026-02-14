import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Link } from "react-router";
import { ArrowLeft, Quote, BrainCircuit } from "lucide-react";

export function ResultsPage() {
    // const { id } = useParams();

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-brand-600" asChild>
                <Link to="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-text-primary">Mobile UX Friction</h1>
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                                High Priority
                            </span>
                        </div>
                        <p className="text-lg text-text-secondary">
                            Users are experiencing significant navigability issues on iOS devices, leading to frustration and drop-offs.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-brand-600" />
                                <CardTitle className="text-lg">AI Reasoning (Why this matters)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="bg-brand-50/50 p-6 text-sm leading-relaxed text-text-secondary">
                            <p>
                                This theme is flagged as <strong>High Priority</strong> because it affects a core workflow (Navigation) for a significant portion of the user base (35%). The negative sentiment score is high (-0.8), and it directly correlates with the "Churn Risk" metric defined in your product strategy. Fixing this is estimated to improve mobile retention by 12%.
                            </p>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-4">Key Feedback Quotes</h3>
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <Quote className="h-8 w-8 text-slate-200 mb-2" />
                                    <p className="text-text-primary italic">"I literally can't find the settings menu on my iPhone. It seems to be hidden behind the notch."</p>
                                    <p className="mt-2 text-xs text-text-secondary text-right">— Jira Ticket #4022 • Enterprise Customer</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <Quote className="h-8 w-8 text-slate-200 mb-2" />
                                    <p className="text-text-primary italic">"The app is unusable on mobile. Buttons are too small and the menu doesn't expand."</p>
                                    <p className="mt-2 text-xs text-text-secondary text-right">— Survey Response • iOS User</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="block text-text-secondary">Volume</span>
                                <span className="font-medium">42 Mentions</span>
                            </div>
                            <div>
                                <span className="block text-text-secondary">Sentiment</span>
                                <span className="font-medium text-red-600">Negative (-0.8)</span>
                            </div>
                            <div>
                                <span className="block text-text-secondary">Sources</span>
                                <span className="font-medium">Jira, Zendesk</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Suggested Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start h-auto py-3 whitespace-normal text-left">
                                Create Jira Ticket
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-auto py-3 whitespace-normal text-left">
                                Share on Slack
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
