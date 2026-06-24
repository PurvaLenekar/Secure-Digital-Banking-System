// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgotPassword"
import OtpVerificationPage from "./pages/OtpVerification";
import Accounts from "./pages/Accounts"
import TransfersPage from './pages/Transfers';
import Transactions from "./pages/Transactions";
import Security from "./pages/SecurityPage";
import AnalyticsDashboard from "./pages/Analytics";
import FraudDetection from "./pages/FraudDetection";
import Settings from "./pages/Settings";
import { useTranslation } from 'react-i18next';



function App() {
  const { t, i18n } = useTranslation();
  console.log("Current Language is:", i18n.language);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Onboarding Screens (No header layout needed) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpasword" element={<ForgetPassword/>}/>
        <Route path="/otpverification" element={<OtpVerificationPage />} />

        {/* Protected Core Application Screens (Wrapped in Finova Layout) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/accounts" element={<Layout><Accounts /></Layout>} />
        <Route path="/transfers" element={<Layout><TransfersPage /></Layout>} />
        <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
        <Route path="/security" element={<Layout><Security /></Layout>} />
        <Route path="/analytics" element={<Layout><AnalyticsDashboard /></Layout>} />
        <Route path="/fraud-detection" element={<Layout><FraudDetection /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;