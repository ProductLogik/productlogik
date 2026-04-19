export function CookiePolicyPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary mb-3">Cookie Policy</h1>
                <p className="text-sm text-text-secondary">Last updated: April 2026</p>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-10">
                <p className="text-sm text-brand-800 font-medium leading-relaxed">
                    <strong>The short version:</strong> ProductLogik uses exactly one type of cookie — the authentication session cookie that keeps you logged in. No tracking, no advertising, no analytics cookies.
                </p>
            </div>

            <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
                <Section title="What Are Cookies?">
                    <p>
                        Cookies are small text files stored by your browser when you visit a website. They can serve a wide variety of purposes — from keeping you logged in, to tracking your behaviour across sites for advertising. This policy describes exactly which cookies ProductLogik uses and why.
                    </p>
                </Section>

                <Section title="Cookies We Use">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse mt-2">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-2 pr-4 font-semibold text-text-primary">Cookie</th>
                                    <th className="text-left py-2 pr-4 font-semibold text-text-primary">Purpose</th>
                                    <th className="text-left py-2 font-semibold text-text-primary">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                <tr className="border-b border-slate-100">
                                    <td className="py-2.5 pr-4 font-mono">sb-*-auth-token</td>
                                    <td className="py-2.5 pr-4">Supabase authentication session — keeps you logged in</td>
                                    <td className="py-2.5">Session / 1 week</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4">That's the complete list. There are no analytics cookies (no Google Analytics, no Hotjar, no Mixpanel), no advertising cookies, and no third-party tracking pixels.</p>
                </Section>

                <Section title="Cookies We Do NOT Use">
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Advertising or retargeting cookies</li>
                        <li>Analytics or behaviour tracking cookies</li>
                        <li>Social media tracking pixels</li>
                        <li>Third-party cookies of any kind</li>
                    </ul>
                </Section>

                <Section title="Managing Cookies">
                    <p>
                        You can control cookies through your browser settings. However, disabling the authentication cookie will log you out and prevent you from accessing your account — it is strictly necessary for the app to function.
                    </p>
                    <p className="mt-3">
                        Instructions for managing cookies in common browsers: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">Chrome</a>,{" "}
                        <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">Firefox</a>,{" "}
                        <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">Safari</a>.
                    </p>
                </Section>

                <Section title="Changes to This Policy">
                    <p>
                        If the cookie usage changes (for example, if analytics are added in the future), this page will be updated and registered users will be notified. The date at the top of this page reflects the last revision.
                    </p>
                </Section>

                <Section title="Contact">
                    <p>
                        Questions about this policy? Email <a href="mailto:contact@hamzalatif.com" className="text-brand-600 hover:text-brand-700">contact@hamzalatif.com</a>.
                    </p>
                </Section>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-base font-display font-bold text-text-primary mb-3">{title}</h2>
            <div className="space-y-2 text-justify">{children}</div>
        </div>
    );
}
