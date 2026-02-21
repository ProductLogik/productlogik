import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
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
import PricingPage from "./components/pages/PricingPage";

import { VerifyEmailPage } from "./pages/VerifyEmailPage";

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
      "/pricing": "Pricing - Productlogik",
    };

    const title = titles[location.pathname] || "Productlogik";
    // Handle dynamic routes like /results/:id roughly
    if (location.pathname.startsWith("/results")) {
      document.title = "Analysis Results - Productlogik";
    } else {
      document.title = title;
    }
  }, [location]);

  return (
    <>
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
          <Route path="/usage" element={<UsagePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
