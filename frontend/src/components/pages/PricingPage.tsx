import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import ComparisonTable from './ComparisonTable';
import FAQ from './FAQ';
import { useAuth } from '@/hooks/useAuth';

const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleUpgrade = async (priceId: string) => {
        if (!user) {
            navigate('/login?redirect=/pricing');
            return;
        }

        // Call backend to create checkout session
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscription/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ priceId })
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.checkout_url;
            } else {
                console.error("Checkout failed");
                alert("Failed to start checkout. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    };

    return (
        <div className="container mx-auto py-16 px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                    Pricing Built for Product Leaders
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    From solo PMs to enterprise product organizations — unlock actionable intelligence from customer feedback.
                </p>
                <div className="mt-6 text-sm text-slate-500 font-medium">
                    No credit card required for Demo. Cancel anytime.
                </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

                {/* Demo Plan */}
                <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Demo</CardTitle>
                        <CardDescription>For individual PMs & early-stage builders</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-white">€0</span>
                            <span className="text-slate-400 text-sm"> / month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            <FeatureItem text="3 CSV uploads / month" />
                            <FeatureItem text="Max 100 rows per file" />
                            <FeatureItem text="AI Theme Extraction" />
                            <FeatureItem text="Sentiment Analysis" />
                            <FeatureItem text="The Compass Dashboard" />
                            <FeatureItem text="Watermarked PDF Export" />
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full border-slate-700 hover:bg-slate-800 text-white"
                            onClick={() => navigate('/upload')}
                        >
                            Start Demo
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="border-emerald-500 bg-slate-900/80 backdrop-blur-md relative transform scale-105 shadow-2xl shadow-emerald-900/20">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Pro</CardTitle>
                        <CardDescription>For serious PMs and growing startups</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-emerald-400">€59</span>
                            <span className="text-slate-400 text-sm"> / month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-slate-400 mb-2">Everything in Demo, plus:</div>
                        <ul className="space-y-3">
                            <FeatureItem text="50 uploads / month" highlight />
                            <FeatureItem text="Full Dataset Support" highlight />
                            <FeatureItem text="Agile Anti-Pattern Detection" highlight />
                            <FeatureItem text="Product Health Score" />
                            <FeatureItem text="Clean PDF Export" />
                            <FeatureItem text="Email Sharing" />
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleUpgrade('price_PLACEHOLDER_PRO')}
                        >
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>

                {/* Team Plan */}
                <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Team</CardTitle>
                        <CardDescription>For product teams needing alignment</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-purple-400">€199</span>
                            <span className="text-slate-400 text-sm"> / month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-slate-400 mb-2">Everything in Pro, plus:</div>
                        <ul className="space-y-3">
                            <FeatureItem text="Unlimited Uploads" highlight />
                            <FeatureItem text="Multi-Source Integrations" />
                            <FeatureItem text="Team Collaboration" />
                            <FeatureItem text="Role-Based Access" />
                            <FeatureItem text="API Access" />
                            <FeatureItem text="Priority Support" />
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleUpgrade('price_PLACEHOLDER_TEAM')}
                        >
                            Start Team Plan
                        </Button>
                    </CardFooter>
                </Card>

            </div>

            {/* Feature Comparison */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center text-white mb-10">Compare Plans</h2>
                <ComparisonTable />
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-3xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
                <FAQ />
            </div>

        </div>
    );
};

const FeatureItem = ({ text, highlight = false }: { text: string, highlight?: boolean }) => (
    <li className="flex items-center gap-3">
        <div className={`p-1 rounded-full ${highlight ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
            <Check className={`w-4 h-4 ${highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
        </div>
        <span className={`${highlight ? 'text-white font-medium' : 'text-slate-300'}`}>{text}</span>
    </li>
);

export default PricingPage;
