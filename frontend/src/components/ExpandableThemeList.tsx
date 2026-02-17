import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/Accordion";
import { Quote } from "lucide-react";
import { cn } from "../lib/utils";

interface Theme {
    name?: string;
    title?: string;
    description?: string;
    summary?: string;
    confidence: number;
    sentiment: "Positive" | "Neutral" | "Negative" | "Critical";
    count: number;
    evidence: string[];
}

interface ExpandableThemeListProps {
    themes: Theme[];
}

export function ExpandableThemeList({ themes }: ExpandableThemeListProps) {
    return (
        <Accordion type="single" collapsible className="space-y-4">
            {themes.map((theme, index) => {
                // Determine badge style based on sentiment
                let badgeStyle = "bg-slate-100 text-slate-800 border-slate-200";
                if (theme.sentiment === 'Negative' || theme.sentiment === 'Critical') {
                    badgeStyle = "bg-rose-100 text-rose-700 border-rose-200";
                } else if (theme.sentiment === 'Positive') {
                    badgeStyle = "bg-blue-100 text-blue-700 border-blue-200";
                } else if (theme.sentiment === 'Neutral') {
                    badgeStyle = "bg-orange-100 text-orange-700 border-orange-200";
                }

                return (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="bg-white border border-slate-200 rounded-lg shadow-sm px-4 data-[state=open]:border-brand-200 transition-colors"
                    >
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex flex-col w-full text-left gap-2 pr-4">
                                <div className="flex items-start justify-between w-full">
                                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                                        {theme.name || theme.title || "Untitled Theme"}
                                    </h3>
                                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ml-2", badgeStyle)}>
                                        {theme.sentiment}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-900">{theme.count}</span> mentions
                                    </p>
                                    <span className="text-xs text-gray-400 font-normal">
                                        {theme.confidence.toFixed(0)}% Conf.
                                    </span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4">
                            <div className="pt-2 border-t border-gray-100 space-y-3">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {theme.summary || theme.description}
                                </p>

                                {theme.evidence && theme.evidence.length > 0 && (
                                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Evidence</h4>
                                        {theme.evidence.map((quote, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-2 text-xs text-gray-600 italic"
                                            >
                                                <Quote className="h-3 w-3 text-brand-400 flex-shrink-0 mt-0.5" />
                                                <span>"{quote}"</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
