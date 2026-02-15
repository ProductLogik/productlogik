import { cn } from "../lib/utils";

interface PriorityCardProps {
    title: string;
    sentiment: string;
    count: number;
    className?: string;
}

export function PriorityCard({ title, sentiment, count, className }: PriorityCardProps) {
    // Determine style based on sentiment
    let badgeStyle = "bg-slate-100 text-slate-800 border-slate-200";

    if (sentiment === 'Negative' || sentiment === 'Critical') {
        badgeStyle = "bg-rose-100 text-rose-700 border-rose-200";
    } else if (sentiment === 'Positive') {
        badgeStyle = "bg-blue-100 text-blue-700 border-blue-200";
    } else if (sentiment === 'Neutral') {
        badgeStyle = "bg-orange-100 text-orange-700 border-orange-200";
    }

    return (
        <div className={cn("bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors shadow-sm", className)}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                    {title}
                </h3>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap", badgeStyle)}>
                    {sentiment}
                </span>
            </div>
            <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">{count}</span> mentions
            </p>
        </div>
    );
}
