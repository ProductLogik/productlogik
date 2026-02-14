import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

interface ThemeItem {
  id: string;
  title: string;
  confidence: number;
  quotes: string[];
}

const themes: ThemeItem[] = [
  {
    id: "1",
    title: "Billing Issues",
    confidence: 98,
    quotes: [
      "I can't find the invoice.",
      "The payment page keeps timing out.",
      "Where do I update my credit card?",
    ],
  },
  {
    id: "2",
    title: "Performance Problems",
    confidence: 94,
    quotes: [
      "Dashboard takes forever to load.",
      "Export feature is really slow.",
    ],
  },
  {
    id: "3",
    title: "Mobile Experience",
    confidence: 91,
    quotes: [
      "Can't login on my phone.",
      "Mobile UI is broken on iOS.",
      "Touch targets are too small.",
    ],
  },
  {
    id: "4",
    title: "Feature Requests",
    confidence: 87,
    quotes: [
      "Please add dark mode!",
      "Need better filtering options.",
    ],
  },
];

export function ThemeExplorer() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Theme Explorer
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {themes.map((theme) => (
          <AccordionItem
            key={theme.id}
            value={theme.id}
            className="border border-gray-200 rounded-lg bg-white px-4 data-[state=open]:bg-gray-50"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-sm font-medium text-gray-900">
                  {theme.title}
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  Confidence: {theme.confidence}%
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1">
              <div className="space-y-2">
                {theme.quotes.map((quote, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-gray-600 pl-3 border-l-2 border-gray-300 italic"
                  >
                    "{quote}"
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
