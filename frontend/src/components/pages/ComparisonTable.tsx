import React from 'react';
import { Check, Minus } from 'lucide-react';

const ComparisonTable: React.FC = () => {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-text-secondary">
                <thead className="bg-slate-50 text-xs uppercase text-text-secondary">
                    <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">Feature</th>
                        <th className="px-6 py-4 font-bold text-center tracking-wider">Demo</th>
                        <th className="px-6 py-4 font-bold text-center text-brand-600 tracking-wider">Pro</th>
                        <th className="px-6 py-4 font-bold text-center text-purple-600 tracking-wider">Team</th>
                        <th className="px-6 py-4 font-bold text-center text-slate-700 tracking-wider">Enterprise</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <Row label="CSV Uploads" demo="3/mo" pro="50/mo" team="Unlimited" ent="Unlimited" />
                    <Row label="Max Rows per File" demo="100" pro="Unlimited" team="Unlimited" ent="Unlimited" />
                    <Row label="AI Theme Extraction" demo={true} pro={true} team={true} ent={true} />
                    <Row label="Sentiment Analysis" demo={true} pro={true} team={true} ent={true} />
                    <Row label="Evidence Quotes" demo={true} pro={true} team={true} ent={true} />
                    <Row label="Anti-Pattern Detection" demo={false} pro={true} team={true} ent={true} />
                    <Row label="Product Health Score" demo={false} pro={true} team={true} ent={true} />
                    <Row label="Trend Analytics" demo={false} pro={true} team={true} ent={true} />
                    <Row label="Integrations" demo={false} pro={false} team={<span className="text-text-primary font-medium">Slack, Jira</span>} ent={<span className="text-text-primary font-medium">Custom</span>} />
                    <Row label="Team Collaboration" demo={false} pro="Limited" team="Full" ent="Full" />
                    <Row label="API Access" demo={false} pro={false} team={true} ent={true} />
                    <Row label="Impact Estimation" demo={false} pro={false} team={false} ent={true} />
                </tbody>
            </table>
        </div>
    );
};

const Row = ({ label, demo, pro, team, ent }: { label: string, demo: any, pro: any, team: any, ent: any }) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-4 font-medium text-text-primary">{label}</td>
        <td className="px-6 py-4 text-center"><ValueVal v={demo} /></td>
        <td className="px-6 py-4 text-center"><ValueVal v={pro} /></td>
        <td className="px-6 py-4 text-center"><ValueVal v={team} /></td>
        <td className="px-6 py-4 text-center"><ValueVal v={ent} /></td>
    </tr>
);

const ValueVal = ({ v }: { v: any }) => {
    if (v === true) return <Check className="mx-auto w-5 h-5 text-brand-500" />;
    if (v === false) return <Minus className="mx-auto w-5 h-5 text-slate-300" />;
    return <span className="text-text-secondary font-medium">{v}</span>;
};

export default ComparisonTable;
