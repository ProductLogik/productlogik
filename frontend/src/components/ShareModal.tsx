import { useState } from "react";
import { Dialog } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Share2, Mail, Loader2, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { shareUpload } from "../lib/api";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadId: string;
    filename: string;
}

export function ShareModal({ isOpen, onClose, uploadId, filename }: ShareModalProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState<boolean | null>(null);
    const [shareId, setShareId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);
        setEmailSent(null);
        setShareId(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            const response = await shareUpload(uploadId, email, token);

            // Check if email was actually sent
            if (typeof response.email_sent === 'boolean') {
                setEmailSent(response.email_sent);
            } else {
                setEmailSent(true); // Default to true if not specified (legacy behavior)
            }

            if (response.share_id) {
                setShareId(response.share_id);
            }

            setSuccess(true);
            // Don't clear email yet if we might need it for the manual link display
            if (response.email_sent !== false) {
                setEmail("");
            }
        } catch (err: any) {
            setError(err.message || "Failed to share upload");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError(null);
        setEmail("");
        setEmailSent(null);
        setShareId(null);
        setCopied(false);
        onClose();
    };

    const copyLink = () => {
        if (!shareId) return;
        // Construct link based on current location but pointing to signup
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/signup?email=${encodeURIComponent(email)}&invite=${shareId}`;

        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Share Analysis"
            description={`Invite others to view the analysis for "${filename}"`}
        >
            {success ? (
                <div className="py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    {emailSent === false ? (
                        <>
                            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-900">Access Granted</h3>
                                <p className="text-sm text-slate-500 mt-1 px-4">
                                    {email} has been given access, but we couldn't send the invitation email. Please verify the email address is correct or share the link manually.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-4 mx-2">
                                <p className="text-xs font-medium text-slate-500 mb-1">Manual Invitation Link</p>
                                <div className="flex gap-2">
                                    <code className="text-xs bg-white border border-slate-200 rounded p-2 flex-1 overflow-x-auto whitespace-nowrap text-slate-600">
                                        {window.location.origin}/signup?email={email}&invite={shareId}
                                    </code>
                                    <Button size="sm" variant="outline" onClick={copyLink} className="h-full">
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-900">Invitation Sent!</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    An email has been sent to {email} to invite them to view this analysis.
                                </p>
                            </div>
                        </>
                    )}

                    <Button onClick={handleClose} className="w-full mt-4">
                        Done
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleShare} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 h-10 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !email} className="flex-1">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Send Invite
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </Dialog>
    );
}

