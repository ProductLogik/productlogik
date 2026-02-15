import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/Accordion";
import { Quote } from "lucide-react";

interface Theme {
    name?: string;
    title?: string;
    confidence: number;
    sentiment: string;
    summary?: string;
    description?: string;
    evidence?: string[];
    count: number;
}

interface ThemeExplorerProps {
    themes: Theme[];
}

export function ThemeExplorer({ themes }: ThemeExplorerProps) {
    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Theme Explorer
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
                {themes.map((theme, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-gray-200 rounded-lg bg-white px-4 data-[state=open]:bg-gray-50"
                    >
                        <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center justify-between w-full pr-2">
                                <span className="text-sm font-medium text-gray-900 text-left">
                                    {theme.name || theme.title}
                                </span>
                                <span className="text-xs text-gray-500 font-normal ml-2 whitespace-nowrap">
                                    {theme.confidence.toFixed(0)}% Conf.
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 pt-1">
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {theme.summary || theme.description}
                                </p>
                                {theme.evidence && theme.evidence.length > 0 && (
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        {theme.evidence.map((quote, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-2 text-xs text-gray-600 pl-2 border-l-2 border-brand-200 italic"
                                            >
                                                <Quote className="h-3 w-3 text-brand-300 flex-shrink-0 mt-0.5" />
                                                <span>"{quote}"</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
