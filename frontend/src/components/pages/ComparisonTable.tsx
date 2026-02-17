import React from 'react';
import { Check, Minus } from 'lucide-react';

const ComparisonTable: React.FC = () => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-300">
                    <tr>
                        <th className="px-6 py-4 font-bold">Feature</th>
                        <th className="px-6 py-4 font-bold text-center">Demo</th>
                        <th className="px-6 py-4 font-bold text-center text-emerald-400">Pro</th>
                        <th className="px-6 py-4 font-bold text-center text-purple-400">Team</th>
                        <th className="px-6 py-4 font-bold text-center">Enterprise</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    <Row label="CSV Uploads" demo="3/mo" pro="50/mo" team="Unlimited" ent="Unlimited" />
                    <Row label="Max Rows per File" demo="100" pro="Unlimited" team="Unlimited" ent="Unlimited" />
                    <Row label="AI Theme Extraction" demo={true} pro={true} team={true} ent={true} />
                    <Row label="Sentiment Analysis" demo={true} pro={true} team={true} ent={true} />
                    <Row label="Evidence Quotes" demo={true} pro={true} team={true} ent={true} />
                    <Row label="Anti-Pattern Detection" demo={false} pro={true} team={true} ent={true} />
                    <Row label="Product Health Score" demo={false} pro={true} team={true} ent={true} />
                    <Row label="Trend Analytics" demo={false} pro={true} team={true} ent={true} />
                    <Row label="Integrations" demo={false} pro={false} team={<span className="text-white">Slack, Jira</span>} ent={<span className="text-white">Custom</span>} />
                    <Row label="Team Collaboration" demo={false} pro="Limited" team="Full" ent="Full" />
                    <Row label="API Access" demo={false} pro={false} team={true} ent={true} />
                    <Row label="Impact Estimation" demo={false} pro={false} team={false} ent={true} />
                </tbody>
            </table>
        </div>
    );
};

const Row = ({ label, demo, pro, team, ent }: { label: string, demo: any, pro: any, team: any, ent: any }) => (
    <tr className="hover:bg-slate-800/50 transition-colors">
        <td className="px-6 py-4 font-medium text-slate-200">{label}</td>
        <td className="px-6 py-4 text-center"><ValueVal v={demo} /></td>
        <td className="px-6 py-4 text-center"><ValueVal v={pro} /></td>
        <td className="px-6 py-4 text-center"><ValueVal v={team} /></td>
        <td className="px-6 py-4 text-center"><ValueVal v={ent} /></td>
    </tr>
);

const ValueVal = ({ v }: { v: any }) => {
    if (v === true) return <Check className="mx-auto w-5 h-5 text-emerald-500" />;
    if (v === false) return <Minus className="mx-auto w-5 h-5 text-slate-600" />;
    return <span className="text-slate-300">{v}</span>;
};

export default ComparisonTable;
