import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  Info,
  X,
  Sparkles,
  ShieldCheck,
  Search,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import aifaLogo from "../../../assets/aifa-logo.png";

/**
 * LoginPage Component
 * AIFA GEN LABS Admin Portal
 *
 * Minimal, Calm & Effective Enterprise Design:
 * - Left: Ambient cinematic background reflecting the company motto "Career Optimization",
 *   clean typography, balanced whitespace, and 3 minimal value highlights.
 * - Right: Crisp, pure white authentication card with vibrant orange accents,
 *   clear micro-interactions, and convenient demo auto-fill helper.
 */
export default function LoginPage({ onLoginSuccess }) {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation and error states
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [noticeModal, setNoticeModal] = useState(null);

  // Email format regex validation
  const validateEmailFormat = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(val) || val.includes("@");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (authError) setAuthError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    if (authError) setAuthError("");
  };

  const handleQuickFill = () => {
    setEmail("admin@aifagen@gmail.com");
    setPassword("admin@123");
    setErrors({});
    if (authError) setAuthError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedEmail = email.trim();
    const newErrors = {};

    if (!trimmedEmail) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmailFormat(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setAuthError("");

    const result = await login({
      email: trimmedEmail,
      password,
      rememberMe,
    });

    if (result.success) {
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
    } else {
      setAuthError(
        result.error ||
          "Invalid email address or password. Please verify your administrator credentials."
      );
    }
  };

  const handleForgotPassword = () => {
    setNoticeModal({
      title: "Reset Administrator Password",
      message:
        "For security compliance, primary administrator credentials can only be reset via the server configuration or by contacting system administration at admin@aifagen.com.",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#080C14] text-slate-100 font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden overflow-y-auto">
      {/* ======================================================== */}
      {/* 1. LEFT SECTION: CALM CINEMATIC SHOWCASE & MOTTO         */}
      {/* ======================================================== */}
      <section
        aria-label="AIFA GEN LABS Brand Showcase"
        className="relative w-full lg:w-[56%] xl:w-[58%] min-h-auto lg:min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10 border-b lg:border-b-0 lg:border-r border-white/5"
      >
        {/* Ambient Video Background (Calm, low opacity, clean blend) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-25 mix-blend-luminosity"
          aria-hidden="true"
        >
          <source src="/assets/career-optimization-bg.mp4" type="video/mp4" />
        </video>

        {/* Calm Cinematic Gradient Tint */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/70 to-[#080C14]/90 z-1 pointer-events-none"
          aria-hidden="true"
        />

        {/* Delicate Architectural Grid */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B18_1px,transparent_1px),linear-gradient(to_bottom,#1E293B18_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-1"
          aria-hidden="true"
        />

        {/* Top: AIFA Logo & Company Motto */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/80 backdrop-blur-md border border-orange-500/30 p-2 flex items-center justify-center shadow-lg shadow-black/80 shrink-0">
            <img
              src={aifaLogo}
              alt="AIFA GEN LABS"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] sm:text-[17px] font-black tracking-wider text-white uppercase font-sans">
                AIFA GEN LABS
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Core
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#EA580C] tracking-[0.2em] uppercase font-mono">
              Career Optimization
            </p>
          </div>
        </div>

        {/* Center: Minimal, Powerful Headline & Supporting Context */}
        <div className="relative z-10 my-auto py-6 sm:py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono mb-4 sm:mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span>Intelligent Recruitment Operations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.15]">
            Better intelligence.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Better decisions.
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-300/80 leading-relaxed font-normal max-w-lg">
            Your command center for intelligent recruitment operations, job discovery, and platform performance.
          </p>

          {/* 3 Minimal, Effective Value Highlights */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5 max-w-lg">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/25 text-[#EA580C] flex items-center justify-center shrink-0">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span>
                <strong className="text-white font-semibold">AI Talent Discovery</strong> — Automated candidate ranking & career optimization
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/25 text-[#EA580C] flex items-center justify-center shrink-0">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span>
                <strong className="text-white font-semibold">Unified Job Feeds</strong> — Multi-source automated ingestion across LinkedIn & ATS
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/25 text-[#EA580C] flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span>
                <strong className="text-white font-semibold">Recruiter Telemetry</strong> — Placement analytics and conversion benchmarking
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Clean Subtitle & Encrypted Badge */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono border-t border-white/5">
          <span>Global Career Optimization Console</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Administrative Access</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. RIGHT SECTION: CRISP, MINIMAL SIGN-IN PANEL           */}
      {/* ======================================================== */}
      <section
        aria-label="Sign In"
        className="w-full lg:w-[44%] xl:w-[42%] min-h-auto lg:min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative bg-[#0B101D] z-10 border-t lg:border-t-0"
      >
        <div className="w-full max-w-[400px] mx-auto my-auto py-4">
          {/* Floating Pure White Card */}
          <div
            style={{ backgroundColor: "#ffffff" }}
            className="rounded-[20px] sm:rounded-[28px] p-5 sm:p-9 shadow-2xl shadow-black/70 border border-slate-100 text-slate-900 transition-all"
          >
            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-[#EA580C] block mb-1">
                Career Optimization
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                Sign in to your AIFA workspace.
              </p>
            </div>

            {/* Inline Error Alert */}
            {authError && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{authError}</div>
              </div>
            )}

            {/* Sign-In Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Email address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="admin@aifagen@gmail.com"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full h-11 pl-10 pr-4 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                      errors.email
                        ? "border-rose-400 bg-rose-50/20 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-[#EA580C] focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={`w-full h-11 pl-10 pr-11 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                      errors.password
                        ? "border-rose-400 bg-rose-50/20 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-[#EA580C] focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#EA580C] focus:ring-[#EA580C] accent-[#EA580C] cursor-pointer"
                  />
                  <span className="text-slate-600 font-medium">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-semibold text-[#EA580C] hover:text-orange-700 transition cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl text-sm font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] active:scale-[0.99] transition-all shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="truncate">Demo: admin@aifagen@gmail.com</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[#EA580C] hover:underline font-semibold ml-2 shrink-0 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center pb-2 text-[11px] text-slate-500 font-mono">
          <span>AIFA GEN LABS • Career Optimization Console</span>
        </footer>

        {/* Forgot Password Modal */}
        {noticeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-modal-title"
          >
            <div
              style={{ backgroundColor: "#ffffff" }}
              className="rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 relative"
            >
              <button
                type="button"
                onClick={() => setNoticeModal(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
                  <Info className="w-5 h-5" />
                </div>
                <h3
                  id="notice-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {noticeModal.title}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {noticeModal.message}
              </p>

              <button
                type="button"
                onClick={() => setNoticeModal(null)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
