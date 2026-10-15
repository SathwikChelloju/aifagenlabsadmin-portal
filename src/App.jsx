import React, { useState, useEffect, useRef, Component } from "react";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./features/dashboard/pages/Dashboard";
import UsersPage from "./features/users/pages/Users";
import PaymentsPage from "./features/payments/pages/Payments";
import JobsPage from "./features/jobs/pages/Jobs";
import JobSourcesPage from "./features/job-sources/pages/JobSources";
import AuditLogsPage from "./features/audit-logs/pages/AuditLogsPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import AiUsagePage from "./features/ai-usage/pages/AiUsagePage";
import RecruitersPage from "./features/recruiters/pages/Recruiters";
import OverviewPage from "./features/overview/pages/OverviewPage";
import LoginPage from "./features/auth/pages/LoginPage";
import { ToastProvider } from "./components/feedback/ToastNotification";
import { SettingsProvider } from "./context/SettingsProvider";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { authClient } from "./features/auth/services/authClient";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090D12] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 font-extrabold text-xl font-mono">
              !
            </div>
            <h2 className="text-xl font-extrabold mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-400 mb-6 font-mono break-words">
              {this.state.error?.message || "An unexpected error occurred while rendering the view."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const VALID_PAGES = [
  "overview",
  "dashboard",
  "users",
  "recruiters",
  "payments",
  "jobs",
  "internal-jobs",
  "job-sources",
  "ai-usage",
  "audit-logs",
  "audit-log",
  "settings",
];

const getInitialPageFromUrl = (isAuth = false) => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    if (path === "login" || path === "signin") {
      return "login";
    }
    if (!isAuth) {
      return "login";
    }
    if (path && VALID_PAGES.includes(path)) {
      return path === "audit-log" ? "audit-logs" : path;
    }
  }
  return isAuth ? "dashboard" : "login";
};

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [activePage, setActivePage] = useState(() =>
    getInitialPageFromUrl(authClient.isAuthenticated())
  );
  const [darkMode, setDarkMode] = useState(false);
  const redirectTargetRef = useRef(null);

  // Synchronize browser history and URL path
  useEffect(() => {
    const handlePopState = () => {
      const isAuth = authClient.isAuthenticated();
      if (!isAuth) {
        setActivePage("login");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signin"
        ) {
          window.history.replaceState(null, "", "/login");
        }
      } else {
        const page = getInitialPageFromUrl(true);
        if (page === "login" || page === "signin") {
          setActivePage("dashboard");
          window.history.replaceState(null, "", "/");
        } else {
          setActivePage(page);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const currentPage = !isAuthenticated ? "login" : activePage;

  // Route protection effect: enforce /login in URL for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname
          .replace(/^\/+|\/+$/g, "")
          .toLowerCase();
        if (
          currentPath &&
          currentPath !== "login" &&
          currentPath !== "signin" &&
          VALID_PAGES.includes(currentPath)
        ) {
          redirectTargetRef.current = currentPath;
        }
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signin"
        ) {
          window.history.replaceState(null, "", "/login");
        }
      }
    } else {
      // If authenticated and currently on login page, redirect to target or dashboard
      if (
        activePage === "login" ||
        (typeof window !== "undefined" &&
          (window.location.pathname === "/login" ||
            window.location.pathname === "/signin"))
      ) {
        const target = redirectTargetRef.current || "dashboard";
        redirectTargetRef.current = null;
        setActivePage(target);
        const targetPath = target === "dashboard" ? "/" : `/${target}`;
        window.history.replaceState(null, "", targetPath);
      }
    }
  }, [isAuthenticated, activePage]);

  const handlePageChange = (newPage, searchParam = "") => {
    if (!isAuthenticated) {
      setActivePage("login");
      return;
    }
    setActivePage(newPage);
    if (typeof window !== "undefined") {
      const targetBase = newPage === "dashboard" ? "/" : `/${newPage}`;
      const targetPath = searchParam
        ? `${targetBase}?q=${encodeURIComponent(searchParam)}`
        : targetBase;
      if (window.location.pathname + window.location.search !== targetPath) {
        window.history.pushState(null, "", targetPath);
      }
    }
  };

  const handleLoginSuccess = () => {
    const target = redirectTargetRef.current || "dashboard";
    redirectTargetRef.current = null;
    setActivePage(target);
    if (typeof window !== "undefined") {
      const targetPath = target === "dashboard" ? "/" : `/${target}`;
      window.history.replaceState(null, "", targetPath);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setActivePage("login");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/login");
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "overview":
        return <OverviewPage darkMode={darkMode} onNavigate={handlePageChange} />;

      case "dashboard":
        return <DashboardPage darkMode={darkMode} onNavigate={handlePageChange} />;

      case "users":
        return <UsersPage darkMode={darkMode} />;

      case "recruiters":
        return <RecruitersPage darkMode={darkMode} />;

      case "payments":
        return <PaymentsPage darkMode={darkMode} />;

      case "jobs":
        return <JobsPage darkMode={darkMode} onNavigate={handlePageChange} />;

      case "internal-jobs":
        return (
          <JobsPage
            darkMode={darkMode}
            defaultJobType="Internal Jobs"
            onNavigate={handlePageChange}
          />
        );

      case "job-sources":
        return <JobSourcesPage darkMode={darkMode} onNavigate={handlePageChange} />;

      case "ai-usage":
        return <AiUsagePage darkMode={darkMode} />;

      case "audit-logs":
      case "audit-log":
        return <AuditLogsPage darkMode={darkMode} />;

      case "settings":
        return <SettingsPage darkMode={darkMode} />;

      default:
        return <DashboardPage darkMode={darkMode} onNavigate={handlePageChange} />;
    }
  };

  // If unauthenticated or on login view, render the dedicated sign-in page
  if (!isAuthenticated || currentPage === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      activePage={currentPage}
      setActivePage={handlePageChange}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      onSignOut={handleSignOut}
    >
      {renderActivePage()}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
