import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { Toaster } from "sonner";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UploadPage } from "./pages/UploadPage";
import { ResultsPage } from "./pages/ResultsPage";
import { UsagePage } from "./pages/UsagePage";
import { AccountPage } from "./pages/AccountPage";
import { TrendsPage } from "./pages/TrendsPage";
import { MethodologyPage } from "./pages/MethodologyPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { BlogPage } from "./pages/BlogPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";

import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { SharedResultsPage } from "./pages/SharedResultsPage";
import { ComparePage } from "./pages/ComparePage";

function App() {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Home - Productlogik",
      "/login": "Login - Productlogik",
      "/signup": "Signup - Productlogik",
      "/verify-email": "Verify Email - Productlogik",
      "/dashboard": "Dashboard - Productlogik",
      "/upload": "Upload Data - Productlogik",
      "/results": "Analysis Results - Productlogik",
      "/usage": "Usage & Billing - Productlogik",
      "/account": "Account Settings - Productlogik",
      "/trends": "Trend Analytics - ProductLogik",
      "/methodology": "Methodology - ProductLogik",
      "/about": "About - ProductLogik",
      "/contact": "Contact - ProductLogik",
      "/privacy-policy": "Privacy Policy - ProductLogik",
      "/terms-of-service": "Terms of Service - ProductLogik",
      "/integrations": "Integrations - ProductLogik",
      "/blog": "Blog - ProductLogik",
      "/help-center": "Help Center - ProductLogik",
      "/cookie-policy": "Cookie Policy - ProductLogik",
      "/compare": "A/B Comparison - ProductLogik",
    };

    const title = titles[location.pathname] || "Productlogik";
    // Handle dynamic routes like /results/:id roughly
    if (location.pathname.startsWith("/results")) {
      document.title = "Analysis Results - Productlogik";
    } else if (location.pathname.startsWith("/shared")) {
      document.title = "Shared Analysis - ProductLogik";
    } else {
      document.title = title;
    }
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          className: 'shadow-lg rounded-xl font-sans'
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/usage" element={<UsagePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/shared/:id" element={<SharedResultsPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
