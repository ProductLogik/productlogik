import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/Accordion";
import { Quote, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { submitThemeFeedback } from "../lib/api";

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
    uploadId?: string;
    token?: string;
}

export function ExpandableThemeList({ themes, uploadId, token }: ExpandableThemeListProps) {
    const [feedbackState, setFeedbackState] = useState<Record<string, boolean | null>>({});

    const handleFeedback = async (themeName: string, isHelpful: boolean) => {
        if (!uploadId || !token) return;
        setFeedbackState((prev) => ({ ...prev, [themeName]: isHelpful }));
        try {
            await submitThemeFeedback(uploadId, themeName, isHelpful, token);
        } catch {
            setFeedbackState((prev) => ({ ...prev, [themeName]: null }));
        }
    };

    return (
        <Accordion type="single" collapsible className="space-y-4">
            {themes.map((theme, index) => {
                const themeName = theme.name || theme.title || "Untitled Theme";
                const feedback = feedbackState[themeName];

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
                                        {themeName}
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

                                {uploadId && token && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-xs text-gray-400">Was this theme helpful?</span>
                                        <button
                                            onClick={() => handleFeedback(themeName, true)}
                                            className={cn(
                                                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                                                feedback === true
                                                    ? "bg-green-100 text-green-700"
                                                    : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                                            )}
                                        >
                                            <ThumbsUp className="h-3 w-3" />
                                            Helpful
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(themeName, false)}
                                            className={cn(
                                                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                                                feedback === false
                                                    ? "bg-red-100 text-red-700"
                                                    : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            )}
                                        >
                                            <ThumbsDown className="h-3 w-3" />
                                            Not Helpful
                                        </button>
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
