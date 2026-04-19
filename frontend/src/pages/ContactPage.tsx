import { useState } from "react";
import { toast } from "sonner";
import { submitContactForm } from "../lib/api";
import { Loader2, Mail, MessageSquare, User } from "lucide-react";

export function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitContactForm(name, email, message);
            toast.success("Message sent! I'll get back to you soon.");
            setName("");
            setEmail("");
            setMessage("");
        } catch (err: any) {
            toast.error(err.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
            <div className="max-w-2xl">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">Get in Touch</h1>
                <p className="text-text-secondary text-lg leading-relaxed mb-10">
                    Have a question, found a bug, or want to share feedback? I'd love to hear from you. Messages go directly to the builder.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-text-secondary" /> Name
                        </label>
                        <input
                            id="contact-name"
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={loading}
                            placeholder="Your full name"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-text-secondary" /> Email
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-text-secondary" /> Message
                        </label>
                        <textarea
                            id="contact-message"
                            required
                            rows={6}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            disabled={loading}
                            placeholder="What's on your mind?"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-brand-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-brand-600/20"
                    >
                        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-100">
                    <p className="text-sm text-text-secondary">
                        Prefer email? Reach out directly at{" "}
                        <a href="mailto:contact@hamzalatif.com" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
                            contact@hamzalatif.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
