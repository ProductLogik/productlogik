import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem
                question="Can I cancel anytime?"
                answer="Yes. There are no lock-in contracts. You can cancel your subscription at any time via the billing portal, and your access will continue until the end of the billing period."
            />
            <FAQItem
                question="Is my data used to train AI models?"
                answer="No. Your data remains private and isolated. We do not use your customer feedback to train public AI models. Data privacy is a core tenet of ProductLogik."
            />
            <FAQItem
                question="What happens if I hit my upload limit?"
                answer="If you reach your monthly upload limit (3 for Demo, 50 for Pro), you'll need to upgrade to the next tier to continue analyzing files. Your existing data remains accessible."
            />
            <FAQItem
                question="Do you support enterprise security (SSO, Audit Logs)?"
                answer="Yes, but only on the Enterprise plan. Please contact our sales team to discuss custom security requirements, Single Sign-On (SSO), and SLA guarantees."
            />
            <FAQItem
                question="Can I upgrade later?"
                answer="Absolutely. You can start with the Demo plan to get a feel for the tool, then upgrade to Pro or Team as your product organization grows."
            />
        </div>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200/60 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <button
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-text-primary">{question}</span>
                {isOpen ? <ChevronUp className="text-brand-500 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 text-text-secondary leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default FAQ;
