import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  LogOut,
  Search,
  RefreshCw,
  AlertTriangle,
  Sun,
  Moon,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  X,
  Users,
  Briefcase,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { NAVIGATION_GROUPS } from "../constants/navigation";
import NotificationBell from "../features/notifications/components/NotificationBell";
import GlobalSearchBar from "../components/search/GlobalSearchBar";
import { useToast } from "../hooks/useToast";
import { mockStore } from "../mocks/mockStore";
import { recruiterService } from "../features/recruiters/services/recruiterService";
import aifaLogo from "../assets/aifa-logo.png";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../hooks/useAuth";
import AiAssistant from "../features/assistant/components/AiAssistant";

export default function AdminLayout({
  children,
  activePage,
  setActivePage,
  darkMode,
  setDarkMode,
  onSignOut,
}) {
  const { logout, user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncingFeeds, setIsSyncingFeeds] = useState(false);
  const { addToast } = useToast();
  const { settings } = useSettings();
  const currentLogo = settings?.general?.logoUrl || aifaLogo;
  const platformName = settings?.general?.platformName || "AIFA GEN LABS";
  const companyTagline = settings?.general?.companyTagline || "Global Career Optimization Console";
  const navigationGroups = NAVIGATION_GROUPS;

  const [collapsedSubmenus, setCollapsedSubmenus] = useState({});

  // Sidebar Search State
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sidebarSearchInputRef = useRef(null);
  const sidebarSearchContainerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarSearchContainerRef.current &&
        !sidebarSearchContainerRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute live search results across pages, candidates, jobs, recruiters
  const searchResults = useMemo(() => {
    const q = sidebarSearch.trim().toLowerCase();
    if (!q) return { pages: [], candidates: [], jobs: [], recruiters: [] };

    // 1. Pages
    const pages = [];
    navigationGroups.forEach((grp) => {
      grp.items.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            if (
              child.label.toLowerCase().includes(q) ||
              child.id.toLowerCase().includes(q)
            ) {
              pages.push({
                id: `page_${child.id}`,
                title: child.label,
                subtitle: `${grp.group} • Section`,
                page: child.id,
              });
            }
          });
        } else if (
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        ) {
          pages.push({
            id: `page_${item.id}`,
            title: item.label,
            subtitle: `${grp.group} • Section`,
            page: item.id,
          });
        }
      });
    });

    const storeState = mockStore.getState();

    // 2. Candidates
    const candidates = (storeState.candidates || [])
      .filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const country = (c.countryGoal || "").toLowerCase();
        return name.includes(q) || email.includes(q) || country.includes(q);
      })
      .slice(0, 3)
      .map((c) => ({
        id: `cand_${c.id}`,
        title: c.name,
        subtitle: `${c.email} • ${c.countryGoal || "Global"}`,
        page: "users",
        param: c.name,
      }));

    // 3. Jobs
    const allJobs = [...(storeState.publicJobs || []), ...(storeState.internalJobs || [])];
    const jobs = allJobs
      .filter((j) => {
        const title = (j.title || "").toLowerCase();
        const company = (j.company || "").toLowerCase();
        return title.includes(q) || company.includes(q);
      })
      .slice(0, 3)
      .map((j) => ({
        id: `job_${j.id}`,
        title: j.title,
        subtitle: `${j.company} • ${j.location || "Remote"}`,
        page: "jobs",
        param: j.title,
      }));

    // 4. Recruiters
    const recruiters = recruiterService
      .getRecruiters()
      .filter((r) => {
        const name = (r.name || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        const dept = (r.department || "").toLowerCase();
        return name.includes(q) || email.includes(q) || dept.includes(q);
      })
      .slice(0, 3)
      .map((r) => ({
        id: `rec_${r.id}`,
        title: r.name,
        subtitle: `${r.department || "Talent Partner"} • ${r.email}`,
        page: "recruiters",
        param: r.name,
      }));

    return { pages, candidates, jobs, recruiters };
  }, [sidebarSearch, navigationGroups]);

  const hasAnyResults =
    searchResults.pages.length > 0 ||
    searchResults.candidates.length > 0 ||
    searchResults.jobs.length > 0 ||
    searchResults.recruiters.length > 0;

  const handleSelectResult = (page, param = "") => {
    setActivePage(page, param);
    setSidebarSearch("");
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      sidebarSearchInputRef.current?.blur();
    } else if (e.key === "Enter") {
      const firstResult =
        searchResults.pages[0] ||
        searchResults.candidates[0] ||
        searchResults.jobs[0] ||
        searchResults.recruiters[0];
      if (firstResult) {
        handleSelectResult(firstResult.page, firstResult.param);
      }
    }
  };

  const displayedNavigationGroups = useMemo(() => {
    const q = sidebarSearch.trim().toLowerCase();
    if (!q) return navigationGroups;
    return navigationGroups
      .map((grp) => {
        const matchingItems = grp.items.filter((item) => {
          const itemMatches =
            item.label.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q);
          const childMatches = item.children?.some(
            (c) =>
              c.label.toLowerCase().includes(q) ||
              c.id.toLowerCase().includes(q)
          );
          return itemMatches || childMatches;
        });
        return { ...grp, items: matchingItems };
      })
      .filter((grp) => grp.items.length > 0);
  }, [navigationGroups, sidebarSearch]);

  const isCandidatesRecruitersActive = activePage === "users" || activePage === "recruiters";
  const isCandidatesOpen = isCandidatesRecruitersActive || !collapsedSubmenus["candidates-recruiters"];

  const toggleSubmenu = (menuId) => {
    setCollapsedSubmenus((prev) => ({
      ...prev,
      [menuId]: isCandidatesOpen,
    }));
  };

  return (
    <div
      data-theme={darkMode ? "dark" : "light"}
      className={`min-h-screen flex antialiased transition-colors duration-200 ${
        darkMode ? "bg-[#090D12] text-slate-100" : "bg-[#F5F7FB] text-slate-900"
      }`}
    >
      {/* 10% SLIM ICON RAIL WITH HOVER EXPANSION */}

      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed top-0 left-0 h-screen z-50 border-r transition-all duration-300 ease-in-out select-none flex flex-col justify-between ${
          darkMode
            ? "bg-[#0D1117] border-[#30363D]"
            : "bg-white border-slate-200"
        } ${isExpanded ? "w-64 shadow-2xl" : "w-16 shadow-xs"}`}
      >
        <div className="p-3 space-y-4">
          <div className="flex items-center gap-3 h-10 overflow-hidden">
            <div className="h-9 w-9 min-w-9 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-sm border border-slate-700/50">
              <img
                src={currentLogo}
                alt={platformName}
                className="h-full w-full object-contain p-1"
              />
            </div>

            {isExpanded && (
              <div className="truncate leading-tight animate-in fade-in">
                <div
                  className={`text-sm font-extrabold tracking-tight truncate ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {platformName}
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Console 2026
                </div>
              </div>
            )}
          </div>

          {/* Functional Sidebar Search */}
          <div ref={sidebarSearchContainerRef} className="relative">
            {isExpanded ? (
              <div className="relative animate-in fade-in">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  ref={sidebarSearchInputRef}
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => {
                    setSidebarSearch(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search portal..."
                  className={`w-full rounded-xl pl-8 pr-7 py-1.5 text-xs focus:outline-hidden transition-colors ${
                    darkMode
                      ? "bg-[#161B22] border border-[#30363D] text-white placeholder:text-slate-500 focus:border-amber-500"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
                  }`}
                />

                {sidebarSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSidebarSearch("");
                      setIsSearchOpen(false);
                      sidebarSearchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Instant Search Flyout Dropdown */}
                {isSearchOpen && sidebarSearch.trim() && (
                  <div
                    className={`absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl shadow-2xl border p-2 z-50 max-h-80 overflow-y-auto ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                  >
                    {!hasAnyResults ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        No results found for "{sidebarSearch}"
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Pages category */}
                        {searchResults.pages.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Pages
                            </div>
                            <div className="space-y-0.5">
                              {searchResults.pages.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleSelectResult(p.page)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                    darkMode
                                      ? "hover:bg-[#21262D]"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div>
                                    <div className="font-bold">{p.title}</div>
                                    <div className="text-[10px] text-slate-400">
                                      {p.subtitle}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Candidates category */}
                        {searchResults.candidates.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Candidates
                            </div>
                            <div className="space-y-0.5">
                              {searchResults.candidates.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => handleSelectResult(c.page, c.param)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                    darkMode
                                      ? "hover:bg-[#21262D]"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <div className="font-bold truncate">{c.title}</div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      {c.subtitle}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Jobs category */}
                        {searchResults.jobs.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              Jobs
                            </div>
                            <div className="space-y-0.5">
                              {searchResults.jobs.map((j) => (
                                <button
                                  key={j.id}
                                  type="button"
                                  onClick={() => handleSelectResult(j.page, j.param)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                    darkMode
                                      ? "hover:bg-[#21262D]"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <div className="font-bold truncate">{j.title}</div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      {j.subtitle}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recruiters category */}
                        {searchResults.recruiters.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              Recruiters
                            </div>
                            <div className="space-y-0.5">
                              {searchResults.recruiters.map((r) => (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => handleSelectResult(r.page, r.param)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                    darkMode
                                      ? "hover:bg-[#21262D]"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <div className="font-bold truncate">{r.title}</div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      {r.subtitle}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(true);
                  setIsSearchOpen(true);
                  setTimeout(() => sidebarSearchInputRef.current?.focus(), 150);
                }}
                className="w-10 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                title="Search portal"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Items */}

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-270px)] pr-0.5 custom-scrollbar">
            {displayedNavigationGroups.map((grp) => (
              <div key={grp.group} className="space-y-1">
                {isExpanded && (
                  <div className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {grp.group}
                  </div>
                )}

                {grp.items.map((item) => {
                  const Icon = item.icon;

                  // Nested category parent item
                  if (item.children && item.children.length > 0) {
                    const isAnyChildActive = item.children.some(
                      (child) => child.id === activePage
                    );
                    const isParentOpen =
                      item.id === "candidates-recruiters"
                        ? isCandidatesOpen
                        : !collapsedSubmenus[item.id];

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isExpanded) {
                              setIsExpanded(true);
                              setCollapsedSubmenus((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }));
                            } else {
                              toggleSubmenu(item.id);
                            }
                          }}
                          aria-expanded={isParentOpen}
                          aria-controls={`submenu-${item.id}`}
                          className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                            isExpanded ? "px-3" : "justify-center px-0"
                          } ${
                            isAnyChildActive
                              ? darkMode
                                ? "bg-amber-500/10 text-amber-300 font-bold border border-amber-500/25"
                                : "bg-amber-50/60 text-amber-800 font-bold border border-amber-200/60 shadow-2xs"
                              : darkMode
                              ? "text-slate-400 hover:bg-[#161B22] hover:text-white"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                          title={!isExpanded ? item.label : undefined}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isAnyChildActive ? "text-[#D97706]" : "text-slate-400"
                            }`}
                          />

                          {isExpanded && (
                            <span className="truncate flex-1 text-left font-semibold">
                              {item.label}
                            </span>
                          )}

                          {isExpanded && (
                            <span className="text-slate-400 shrink-0">
                              {isParentOpen ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}

                          {!isExpanded && isAnyChildActive && (
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-[#D97706]" />
                          )}
                        </button>

                        {/* Indented nested children */}
                        {isExpanded && isParentOpen && (
                          <div
                            id={`submenu-${item.id}`}
                            role="region"
                            aria-label={item.label}
                            className={`space-y-1 pl-3 ml-4.5 my-1 border-l transition-all animate-in fade-in duration-150 ${
                              darkMode ? "border-[#30363D]" : "border-slate-200"
                            }`}
                          >
                            {item.children.map((child) => {
                              const isChildActive = activePage === child.id;

                              return (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => setActivePage(child.id)}
                                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                                    isChildActive
                                      ? darkMode
                                        ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 shadow-xs"
                                        : "bg-amber-50 text-amber-800 font-bold border border-amber-300 shadow-xs"
                                      : darkMode
                                      ? "text-slate-400 hover:bg-[#161B22] hover:text-white"
                                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                        isChildActive
                                          ? "bg-[#D97706]"
                                          : darkMode
                                          ? "bg-slate-600"
                                          : "bg-slate-300"
                                      }`}
                                    />
                                    <span className="truncate">{child.label}</span>
                                  </div>

                                  {child.badge && (
                                    <span
                                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                                        isChildActive
                                          ? darkMode
                                            ? "bg-amber-500/30 text-amber-200"
                                            : "bg-amber-100 text-amber-800"
                                          : darkMode
                                          ? "bg-[#161B22] text-slate-400 border border-[#30363D]"
                                          : "bg-slate-100 text-slate-600 border border-slate-200"
                                      }`}
                                    >
                                      {child.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Standard top-level navigation item
                  const isActive =
                    activePage === item.id ||
                    (item.id === "jobs" &&
                      (activePage === "job-sources" || activePage === "internal-jobs"));

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                        isExpanded ? "px-3" : "justify-center px-0"
                      } ${
                        isActive
                          ? darkMode
                            ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30"
                            : "bg-amber-50/70 text-amber-700 font-bold border border-amber-200/80 shadow-xs"
                          : darkMode
                            ? "text-slate-400 hover:bg-[#161B22] hover:text-white"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                      title={!isExpanded ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? "text-[#D97706]" : "text-slate-400"
                        }`}
                      />

                      {isExpanded && (
                        <span className="truncate flex-1 text-left">
                          {item.label}
                        </span>
                      )}

                      {isExpanded && item.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            darkMode
                              ? "bg-[#161B22] text-slate-400 border border-[#30363D]"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {isExpanded && item.alert && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-2.5 h-2.5" /> {item.alert}
                        </span>
                      )}

                      {!isExpanded && isActive && (
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-[#D97706]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Theme Toggle Button & Profile Avatar */}

        <div
          className={`p-3 border-t space-y-2.5 ${
            darkMode
              ? "border-[#30363D] bg-[#090D12]"
              : "border-slate-200 bg-slate-50/40"
          }`}
        >
          {/* Light / Dark Mode Switch */}

          {isExpanded ? (
            <div
              className={`p-1 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D]"
                  : "bg-white border-slate-200"
              }`}
            >
              <button
                onClick={() => setDarkMode(false)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg transition-colors ${
                  !darkMode
                    ? "bg-slate-100 text-slate-900 font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />

                <span>Light</span>
              </button>

              <button
                onClick={() => setDarkMode(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-[#30363D] text-white font-bold"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />

                <span>Dark</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>
          )}

          {/* User Profile Card */}

          <div
            className={`flex items-center ${isExpanded ? "justify-between gap-2.5 px-1" : "justify-center"}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-8 w-8 min-w-8 rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-xs border border-slate-700/50"
                title={!isExpanded ? (user?.name || "Admin AIFA") : undefined}
              >
                <img
                  src={aifaLogo}
                  alt="AIFA GEN LABS"
                  className="h-full w-full object-cover"
                />
              </div>

              {isExpanded && (
                <div className="min-w-0 leading-tight flex-1 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {user?.name || "Admin AIFA"}
                    </span>

                    <CheckCircle2 className="w-3 h-3 text-[#16A34A] shrink-0" />
                  </div>

                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {user?.email || "admin@aifagen@gmail.com"}
                  </div>
                </div>
              )}
            </div>

            {isExpanded && (
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  if (typeof onSignOut === "function") {
                    onSignOut();
                  } else {
                    await logout();
                    if (typeof setActivePage === "function") {
                      setActivePage("login");
                    }
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0 animate-in fade-in duration-150"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* VIEWPORT: Padded 64px to clear persistent rail */}

      <div className="flex-1 w-full pl-16 flex flex-col min-w-0">
        <header
          className={`sticky top-0 z-30 border-b px-6 py-4 shadow-[0_1px_0_rgba(15,23,42,0.06)] flex items-center justify-between transition-colors backdrop-blur-md ${
            darkMode
              ? "bg-[#0D1117]/95 border-[#30363D]"
              : "bg-white/95 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-[15px] sm:text-xl font-extrabold uppercase tracking-[0.14em] text-[#D97706] whitespace-nowrap">
              {(activePage || "dashboard").replace(/-/g, " ")}
            </h2>

            <span className={darkMode ? "text-slate-600" : "text-slate-300"}>
              |
            </span>

            <span className="text-[11px] sm:text-xs text-slate-500 font-medium hidden md:inline truncate">
              {platformName} • {companyTagline}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <GlobalSearchBar onNavigate={setActivePage} darkMode={darkMode} />

            <button
              type="button"
              onClick={async () => {
                if (isSyncingFeeds) return;
                try {
                  setIsSyncingFeeds(true);
                  addToast("Initiating feed ingestion pipeline...", "info");
                  await new Promise((resolve) => setTimeout(resolve, 1200));
                  const result = mockStore.syncFeeds();
                  addToast(
                    `Feeds synchronized successfully. Discovered ${result.totalNew} new job vacancies across ${result.syncedCount} active feeds.`,
                    "success"
                  );
                } catch {
                  addToast("Failed to complete feed synchronization.", "error");
                } finally {
                  setIsSyncingFeeds(false);
                }
              }}
              disabled={isSyncingFeeds}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isSyncingFeeds
                  ? "opacity-75 cursor-not-allowed"
                  : "active:scale-95"
              } ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
              }`}
              title="Sync job scraper feeds"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isSyncingFeeds ? "animate-spin text-amber-400" : "text-slate-400"
                }`}
              />

              <span>{isSyncingFeeds ? "Syncing Feeds..." : "Sync Feeds"}</span>
            </button>

            {/* Centralized Notifications Bell */}
            <NotificationBell
              onNavigate={setActivePage}
              darkMode={darkMode}
            />
          </div>
        </header>

        <main className="flex-1 w-full px-6 py-6">{children}</main>
      </div>

      {/* Floating AI Admin Assistant across all portal pages */}
      <AiAssistant activePage={activePage} darkMode={darkMode} />
    </div>
  );
}
