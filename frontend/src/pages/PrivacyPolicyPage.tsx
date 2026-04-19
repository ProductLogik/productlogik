export function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">Privacy Policy</h1>
                <p className="text-sm text-text-secondary">Last updated: April 2026</p>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-10">
                <p className="text-sm text-brand-800 font-medium leading-relaxed">
                    <strong>The short version:</strong> Your data is never sold, shared, rented, or used for advertising. It exists solely to make the app work for you.
                </p>
            </div>

            <div className="prose prose-slate max-w-none space-y-8 text-sm text-text-secondary leading-relaxed">
                <PolicySection title="Who We Are">
                    <p>
                        ProductLogik is an independent, solo-built web application created by Hamza Latif. There is no corporation, no venture-backed company, and no team behind this — it's a single developer project. Questions about this policy can be directed to <a href="mailto:contact@hamzalatif.com" className="text-brand-600 hover:text-brand-700">contact@hamzalatif.com</a>.
                    </p>
                </PolicySection>

                <PolicySection title="What Data We Collect">
                    <p>When you create an account, we collect:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Your email address and name (used for authentication and to address you personally)</li>
                        <li>Your company name (optional, for display purposes only)</li>
                        <li>CSV files you upload for analysis</li>
                        <li>The AI-generated analysis results linked to your uploaded files</li>
                    </ul>
                    <p className="mt-3">We do not collect browsing history, device fingerprints, or any data beyond what is strictly required for the app to function.</p>
                </PolicySection>

                <PolicySection title="How Your Data Is Used">
                    <p>Your data is used exclusively for the following purposes:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Authentication</strong> — Supabase manages secure login and session handling.</li>
                        <li><strong>AI Analysis</strong> — Your CSV data is sent to Google Gemini to extract themes and insights. Gemini processes the data in-request and does not use your submissions to train its models under standard API usage terms.</li>
                        <li><strong>Analysis Storage</strong> — Results are stored in a Supabase-managed PostgreSQL database so you can retrieve them later.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="Data Sharing">
                    <p className="font-semibold text-text-primary">Your data is never sold, rented, or shared with any third party for commercial purposes — period.</p>
                    <p className="mt-3">The only third-party services that interact with your data are:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Supabase</strong> — database and authentication infrastructure</li>
                        <li><strong>Google Gemini API</strong> — AI model for feedback analysis</li>
                        <li><strong>Resend</strong> — transactional email delivery (verification and share notifications only)</li>
                    </ul>
                    <p className="mt-3">Each of these services operates under their own privacy policies. We use them solely for their stated technical function.</p>
                </PolicySection>

                <PolicySection title="Data Retention">
                    <p>
                        Your account data, uploaded files, and analysis results are retained for as long as your account is active. If you delete your account, your data will be removed from the database. You can request deletion at any time by emailing <a href="mailto:contact@hamzalatif.com" className="text-brand-600 hover:text-brand-700">contact@hamzalatif.com</a>.
                    </p>
                </PolicySection>

                <PolicySection title="Cookies">
                    <p>
                        ProductLogik uses only the cookies necessary for authentication — specifically, the session token stored by Supabase to keep you logged in. No advertising cookies, no third-party tracking pixels, and no analytics cookies are used.
                    </p>
                </PolicySection>

                <PolicySection title="Your Rights">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your account and associated data</li>
                    </ul>
                    <p className="mt-3">To exercise any of these rights, email <a href="mailto:contact@hamzalatif.com" className="text-brand-600 hover:text-brand-700">contact@hamzalatif.com</a>.</p>
                </PolicySection>

                <PolicySection title="Changes to This Policy">
                    <p>
                        If this policy changes materially, registered users will be notified via email. The date at the top of this page will always reflect the last revision.
                    </p>
                </PolicySection>
            </div>
        </div>
    );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-base font-display font-bold text-text-primary mb-3">{title}</h2>
            <div className="text-text-secondary leading-relaxed text-sm space-y-2 text-justify">{children}</div>
        </div>
    );
}
