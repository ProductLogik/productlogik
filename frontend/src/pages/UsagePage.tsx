import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";

export function UsagePage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-3xl font-bold text-text-primary">Usage & Limits</h1>
                <p className="mt-2 text-text-secondary">Monitor your usage and plan limits.</p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Analysis Credits</CardTitle>
                        <CardDescription>Resets on Feb 1, 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Used: 450 credits</span>
                            <span>Limit: 1,000 credits</span>
                        </div>
                        <Progress value={45} className="h-2 w-full bg-slate-100" indicatorClassName="bg-brand-600" />
                        <p className="text-xs text-text-secondary">
                            You have <strong>550 credits</strong> remaining for this billing cycle.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan: Pro</CardTitle>
                        <CardDescription>
                            $49/month • Billed monthly
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary">
                            <li>Up to 5 data sources (Jira, Zendesk connected)</li>
                            <li>Unlimited team members</li>
                            <li>Priority email support</li>
                        </ul>
                        <div className="mt-6 flex gap-4">
                            <Button variant="outline">Manage Subscription</Button>
                            <Button>Upgrade Plan</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
