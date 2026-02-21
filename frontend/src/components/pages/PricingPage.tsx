import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import ComparisonTable from './ComparisonTable';
import FAQ from './FAQ';
import { useAuth } from '@/hooks/useAuth';

// Import SVGs explicitly so Vite bundles them correctly in production
import demoIcon from '@/assets/demo-outline.svg';
import proIcon from '@/assets/pro-outline.svg';
import teamIcon from '@/assets/team-outline.svg';
import entIcon from '@/assets/enterprise-outline.svg';

const PricingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleUpgrade = async (priceId: string) => {
        if (!user) {
            navigate('/login?redirect=/pricing');
            return;
        }

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
        <div className="flex flex-col">
            {/* Header Section */}
            <section className="pt-24 pb-16 relative bg-white overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[40rem] -mt-16 w-[80rem] h-[40rem] bg-brand-100/50 blur-3xl rounded-full -z-10 animate-float" />

                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 text-text-primary">
                        Pricing Built for Product Leaders
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-6">
                        From solo PMs to enterprise product organizations — unlock actionable intelligence from customer feedback.
                    </p>
                    <div className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-12 lg:mb-16">
                        No credit card required for Demo. Cancel anytime.
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-24 pt-8 bg-slate-50 relative">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto -mt-20">

                        {/* Demo Plan */}
                        <Card className="glass border-white/40 hover:border-brand-200/50 hover:shadow-lg transition-all duration-300 mt-8">
                            <CardHeader>
                                <CardTitle className="text-2xl text-text-primary flex items-center gap-3">
                                    <div className="p-2 bg-brand-50 rounded-xl">
                                        <img src={demoIcon} alt="Demo Tier" className="w-7 h-7" />
                                    </div>
                                    Demo
                                </CardTitle>
                                <CardDescription>Test the AI engine on your data</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-text-primary">€0</span>
                                    <span className="text-text-secondary text-sm"> / month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <FeatureItem text="3 CSV uploads / month" />
                                    <FeatureItem text="Max 100 rows per file" />
                                    <FeatureItem text="AI Theme Extraction" />
                                    <FeatureItem text="Sentiment Analysis" />
                                    <FeatureItem text="The Intelligence Dashboard" />
                                    <FeatureItem text="Watermarked PDF Export" />
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    className="w-full border-slate-200 hover:bg-slate-50 text-text-primary"
                                    onClick={() => navigate('/upload')}
                                >
                                    Start Demo
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="border border-brand-300 bg-white relative transform scale-105 shadow-2xl shadow-brand-600/10 z-10">
                            <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-md">
                                MOST POPULAR
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl text-text-primary flex items-center gap-3">
                                    <img src={proIcon} alt="Pro Tier" className="w-8 h-8" />
                                    Pro
                                </CardTitle>
                                <CardDescription>For serious PMs and growing startups</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-brand-600">€59</span>
                                    <span className="text-text-secondary text-sm"> / month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm font-medium text-brand-600 mb-2">Everything in Demo, plus:</div>
                                <ul className="space-y-3">
                                    <FeatureItem text="50 uploads / month" />
                                    <FeatureItem text="Full Dataset Support" />
                                    <FeatureItem text="Agile Anti-Pattern Detection" />
                                    <FeatureItem text="Product Health Score" />
                                    <FeatureItem text="Clean PDF Export" />
                                    <FeatureItem text="Email Sharing" />
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20"
                                    onClick={() => handleUpgrade('price_1Qps15Rvy0938U5eIsqD64lV')} // Live Pro Price ID
                                >
                                    Upgrade to Pro
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Team Plan */}
                        <Card className="glass border-white/40 hover:border-brand-200/50 hover:shadow-lg transition-all duration-300 mt-8">
                            <CardHeader>
                                <CardTitle className="text-2xl text-text-primary flex items-center gap-3">
                                    <div className="p-2 bg-brand-50 rounded-xl">
                                        <img src={teamIcon} alt="Team Tier" className="w-7 h-7" />
                                    </div>
                                    Team
                                </CardTitle>
                                <CardDescription>For product teams needing alignment</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-brand-600">€199</span>
                                    <span className="text-text-secondary text-sm"> / month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm font-semibold text-brand-700 tracking-wide uppercase mb-2">Everything in Pro, plus:</div>
                                <ul className="space-y-3">
                                    <FeatureItem text="Unlimited Uploads" />
                                    <FeatureItem text="Multi-Source Integrations" />
                                    <FeatureItem text="Team Collaboration" />
                                    <FeatureItem text="Role-Based Access" />
                                    <FeatureItem text="API Access" />
                                    <FeatureItem text="Priority Support" />
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20"
                                    onClick={() => handleUpgrade('price_1Qps1dRvy0938U5exWp6GfFv')} // Live Team Price ID
                                >
                                    Start Team Plan
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card className="glass border-white/40 hover:border-brand-200/50 hover:shadow-lg transition-all duration-300 mt-8">
                            <CardHeader>
                                <CardTitle className="text-2xl text-text-primary flex items-center gap-3">
                                    <div className="p-2 bg-brand-50 rounded-xl">
                                        <img src={entIcon} alt="Enterprise Tier" className="w-7 h-7" />
                                    </div>
                                    Enterprise
                                </CardTitle>
                                <CardDescription>For massive scale and custom security</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-brand-600">Custom</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm font-semibold text-brand-700 tracking-wide uppercase mb-2">Everything in Team, plus:</div>
                                <ul className="space-y-3">
                                    <FeatureItem text="Custom Data Pipelines" />
                                    <FeatureItem text="Dedicated ML Models" />
                                    <FeatureItem text="Single Sign-On (SSO)" />
                                    <FeatureItem text="On-Premise Deployment" />
                                    <FeatureItem text="Dedicated Success Mgr." />
                                    <FeatureItem text="Custom Contracts & SLA" />
                                </ul>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button
                                    variant="outline"
                                    className="w-full border-brand-200 text-brand-700 hover:bg-brand-50"
                                    onClick={() => window.location.href = 'mailto:hello@productlogik.com?subject=Enterprise Inquiry'}
                                >
                                    Contact Sales
                                </Button>
                            </CardFooter>
                        </Card>

                    </div>
                </div>
            </section>

            {/* Remaining Sections */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-display font-bold text-center text-text-primary mb-12">Compare Plans</h2>
                    <ComparisonTable />
                </div>
            </section>

            <section className="py-24 bg-slate-50 border-t border-slate-200/60">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-display font-bold text-center text-text-primary mb-12">Frequently Asked Questions</h2>
                    <FAQ />
                </div>
            </section>

        </div>
    );
};

const FeatureItem = ({ text }: { text: string }) => {
    return (
        <li className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-slate-100 text-slate-500">
                <Check className="w-4 h-4" />
            </div>
            <span className="text-text-secondary text-sm leading-tight">{text}</span>
        </li>
    );
};

export default PricingPage;

