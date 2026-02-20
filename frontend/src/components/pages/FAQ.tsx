import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem
                question="What kind of data can I upload?"
                answer="Any unstructured text feedback! This includes app store reviews, customer support tickets (Zendesk/Intercom exports), survey responses (NPS/CSAT verbatim text), user interview notes, or sales win/loss transcripts. As long as it's in a CSV format with a text column, ProductLogik can analyze it."
            />
            <FAQItem
                question="Do I need to format my CSVs in a specific way?"
                answer="Not strictly. During the upload process, ProductLogik's intelligent column mapper will help you identify which column contains the feedback text and which contains the date or source. It's built to handle messy exports directly from your tools."
            />
            <FAQItem
                question="Are non-English languages supported?"
                answer="Yes! Our AI engine natively understands and analyzes feedback in over 50 languages. It will automatically detect the language of the feedback and can extract themes and sentiments accurately, even if your dataset contains mixed languages."
            />
            <FAQItem
                question="Is my data used to train AI models?"
                answer="No. Your data remains private and isolated. We do not use your customer feedback to train public AI models. Data privacy is a core tenet of ProductLogik."
            />
            <FAQItem
                question="If it's not used for training, how is my data stored and kept accessible?"
                answer="Your uploaded CSVs and analysis results are securely stored in our private, encrypted database. This allows you to log in and view past reports anytime on your dashboard. We only share the text contextually with our AI providers (like Google or OpenAI) via secure enterprise APIs for the sole purpose of generating your report. Their strict terms prohibit them from logging your data or using it to train their models."
            />
            <FAQItem
                question="What happens if I hit my upload limit?"
                answer="If you reach your monthly upload limit (3 for Demo, 50 for Pro), you'll need to upgrade to the next tier to continue analyzing files. Your existing data remains accessible in your dashboard."
            />
            <FAQItem
                question="Can I share my reports with my team?"
                answer="Yes. Even on the Demo and Pro plans, you can export a beautifully formatted PDF report containing all your strategic themes, evidence, and risk factors to present to stakeholders. The Team plan adds native in-app collaboration."
            />
            <FAQItem
                question="Will I get a receipt for my company's finance team?"
                answer="Yes. All subscriptions are processed securely through Stripe. A full VAT/GST compliant invoice and receipt will be automatically emailed to you upon every successful charge, which you can easily expense."
            />
            <FAQItem
                question="Do you support enterprise security (SSO, Audit Logs)?"
                answer="Yes, but only on the Enterprise plan. Please contact our sales team to discuss custom security requirements, Single Sign-On (SSO), and SLA guarantees."
            />
            <FAQItem
                question="Can I cancel anytime?"
                answer="Yes. There are no lock-in contracts. You can cancel your subscription at any time via the billing portal, and your access will continue until the end of the billing period."
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
