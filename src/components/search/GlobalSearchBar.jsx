import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  Users,
  Briefcase,
  UserCheck,
  CreditCard,
  FileText,
  CornerDownLeft,
  ArrowUpDown,
} from "lucide-react";
import { mockStore } from "../../mocks/mockStore";
import { recruiterService } from "../../features/recruiters/services/recruiterService";

/**
 * Highlighting helper for search matches
 */
function HighlightMatch({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const lowerText = String(text);
  const index = lowerText.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <>{text}</>;

  const before = lowerText.slice(0, index);
  const match = lowerText.slice(index, index + query.length);
  const after = lowerText.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold px-0.5 rounded-xs">
        {match}
      </mark>
      {after}
    </>
  );
}

export default function GlobalSearchBar({ onNavigate, darkMode = false }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Keyboard shortcut listener: Cmd + K (Mac) / Ctrl + K (Windows/Linux)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeEl = document.activeElement;
      const tag = activeEl?.tagName?.toLowerCase();
      const isInputFocused =
        tag === "input" ||
        tag === "textarea" ||
        activeEl?.isContentEditable ||
        activeEl?.closest?.("[role='dialog']");

      if (isInputFocused && activeEl !== inputRef.current) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute live search results across all modules
  const groupedResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        candidates: [],
        users: [],
        jobs: [],
        recruiters: [],
        invoices: [],
      };
    }

    const state = mockStore.getState();

    // 1. Candidates
    const candidates = (state.candidates || [])
      .filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const country = (c.countryGoal || "").toLowerCase();
        const domain = (c.domain || "").toLowerCase();
        const plan = (c.plan || "").toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          country.includes(q) ||
          domain.includes(q) ||
          plan.includes(q)
        );
      })
      .slice(0, 4)
      .map((c) => ({
        id: `cand_${c.id}`,
        category: "Candidates",
        title: c.name,
        subtitle: `${c.email} • ${c.countryGoal || "Global"} (${c.domain || "Candidate"})`,
        badge: c.plan || "Candidate",
        badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
        icon: Users,
        onSelect: () => onNavigate?.("users", c.name),
      }));

    // 2. Users
    const users = (state.users || [])
      .filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const role = (u.role || "").toLowerCase();
        const status = (u.status || "").toLowerCase();
        const location = (u.location || "").toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          role.includes(q) ||
          status.includes(q) ||
          location.includes(q)
        );
      })
      .slice(0, 4)
      .map((u) => ({
        id: `user_${u.id}`,
        category: "Users",
        title: u.name,
        subtitle: `${u.email} • ${u.role} (${u.location || "Remote"})`,
        badge: u.status,
        badgeColor:
          u.status === "Active"
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        icon: Users,
        onSelect: () => onNavigate?.("users", u.name),
      }));

    // 3. Jobs (Public & Internal)
    const allJobs = [...(state.publicJobs || []), ...(state.internalJobs || [])];
    const jobs = allJobs
      .filter((j) => {
        const title = (j.title || "").toLowerCase();
        const company = (j.company || "").toLowerCase();
        const location = (j.location || "").toLowerCase();
        const id = (j.id || "").toLowerCase();
        return (
          title.includes(q) ||
          company.includes(q) ||
          location.includes(q) ||
          id.includes(q)
        );
      })
      .slice(0, 4)
      .map((j) => ({
        id: `job_${j.id}`,
        category: "Jobs",
        title: j.title,
        subtitle: `${j.company} • ${j.location} • ${j.type === "internal" ? "Internal Vacancy" : "Abroad Feed"}`,
        badge: j.status,
        badgeColor:
          j.status === "Active"
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: Briefcase,
        onSelect: () => onNavigate?.("jobs", j.title),
      }));

    // 4. Recruiters
    const allRecruiters = recruiterService.getRecruiters();
    const recruiters = (allRecruiters || [])
      .filter((r) => {
        const name = (r.name || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        const dept = (r.department || "").toLowerCase();
        const role = (r.role || "").toLowerCase();
        const empId = (r.employeeId || "").toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          dept.includes(q) ||
          role.includes(q) ||
          empId.includes(q)
        );
      })
      .slice(0, 4)
      .map((r) => ({
        id: `rec_${r.id}`,
        category: "Recruiters",
        title: r.name,
        subtitle: `${r.email} • ${r.role} (${r.department})`,
        badge: r.employeeId || "Recruiter",
        badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
        icon: UserCheck,
        onSelect: () => onNavigate?.("recruiters", r.name),
      }));

    // 5. Invoices & Payments
    const invoices = (state.transactions || [])
      .filter((t) => {
        const invNum = (t.invoiceNumber || "").toLowerCase();
        const id = (t.id || "").toLowerCase();
        const customer = (t.userName || "").toLowerCase();
        const email = (t.userEmail || "").toLowerCase();
        const amount = String(t.amount || "");
        return (
          invNum.includes(q) ||
          id.includes(q) ||
          customer.includes(q) ||
          email.includes(q) ||
          amount.includes(q)
        );
      })
      .slice(0, 4)
      .map((t) => ({
        id: `inv_${t.id}`,
        category: "Invoices",
        title: `${t.invoiceNumber || t.id} — ${t.userName}`,
        subtitle: `${t.userEmail} • ${t.currencySymbol || "$"}${t.amount} (${t.plan || "Fee"})`,
        badge: t.status,
        badgeColor:
          t.status === "Successful"
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        icon: CreditCard,
        onSelect: () => onNavigate?.("payments", t.invoiceNumber || t.id),
      }));

    let globalIndex = 0;
    const withIndex = (arr) => arr.map((item) => ({ ...item, index: globalIndex++ }));

    return {
      candidates: withIndex(candidates),
      users: withIndex(users),
      jobs: withIndex(jobs),
      recruiters: withIndex(recruiters),
      invoices: withIndex(invoices),
    };
  }, [query, onNavigate]);

  // Flattened array for keyboard index mapping
  const flatResults = useMemo(() => {
    return [
      ...groupedResults.candidates,
      ...groupedResults.users,
      ...groupedResults.jobs,
      ...groupedResults.recruiters,
      ...groupedResults.invoices,
    ];
  }, [groupedResults]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, isOpen]);

  // Keyboard navigation within the dropdown
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flatResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % flatResults.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flatResults.length > 0) {
        setSelectedIndex((prev) =>
          prev === 0 ? flatResults.length - 1 : prev - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatResults.length > 0 && flatResults[selectedIndex]) {
        flatResults[selectedIndex].onSelect();
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const hasQuery = Boolean(query.trim());
  const hasResults = flatResults.length > 0;

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      {/* Input Field */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (hasQuery) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search jobs, candidates, users, invoices (Cmd + K)..."
          className={`w-[22rem] xl:w-[30rem] rounded-2xl pl-9 pr-9 py-2.5 text-xs focus:outline-hidden transition-colors ${
            darkMode
              ? "bg-[#161B22] border border-[#30363D] text-white placeholder:text-slate-500 focus:border-amber-500"
              : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-slate-400"
          }`}
          aria-label="Global admin search"
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />

        {/* Clear Button */}
        {hasQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results Menu */}
      {isOpen && hasQuery && (
        <div
          ref={listRef}
          className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border shadow-2xl overflow-hidden max-h-[30rem] overflow-y-auto custom-scrollbar animate-in fade-in-50 zoom-in-95 duration-100 ${
            darkMode
              ? "bg-[#161B22] border-[#30363D] text-slate-200"
              : "bg-white border-slate-200 text-slate-800"
          }`}
          role="listbox"
        >
          {hasResults ? (
            <div className="py-2 divide-y divide-slate-500/10">
              {/* Category: Candidates */}
              {groupedResults.candidates.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-blue-500" />
                    <span>Candidates ({groupedResults.candidates.length})</span>
                  </div>
                  {groupedResults.candidates.map((item) => {
                    const isSelected = selectedIndex === item.index;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={item.index}
                        onClick={() => {
                          item.onSelect();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(item.index)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? "bg-[#21262D] text-white"
                              : "bg-slate-100 text-slate-900"
                            : darkMode
                            ? "hover:bg-[#1C2128]"
                            : "hover:bg-slate-50"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            <HighlightMatch text={item.title} query={query} />
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <HighlightMatch text={item.subtitle} query={query} />
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Users */}
              {groupedResults.users.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-emerald-500" />
                    <span>Users & Accounts ({groupedResults.users.length})</span>
                  </div>
                  {groupedResults.users.map((item) => {
                    const isSelected = selectedIndex === item.index;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={item.index}
                        onClick={() => {
                          item.onSelect();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(item.index)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? "bg-[#21262D] text-white"
                              : "bg-slate-100 text-slate-900"
                            : darkMode
                            ? "hover:bg-[#1C2128]"
                            : "hover:bg-slate-50"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            <HighlightMatch text={item.title} query={query} />
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <HighlightMatch text={item.subtitle} query={query} />
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Jobs */}
              {groupedResults.jobs.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-amber-500" />
                    <span>Jobs & Vacancies ({groupedResults.jobs.length})</span>
                  </div>
                  {groupedResults.jobs.map((item) => {
                    const isSelected = selectedIndex === item.index;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={item.index}
                        onClick={() => {
                          item.onSelect();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(item.index)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? "bg-[#21262D] text-white"
                              : "bg-slate-100 text-slate-900"
                            : darkMode
                            ? "hover:bg-[#1C2128]"
                            : "hover:bg-slate-50"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            <HighlightMatch text={item.title} query={query} />
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <HighlightMatch text={item.subtitle} query={query} />
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Recruiters */}
              {groupedResults.recruiters.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 text-amber-500" />
                    <span>Recruiters & Partners ({groupedResults.recruiters.length})</span>
                  </div>
                  {groupedResults.recruiters.map((item) => {
                    const isSelected = selectedIndex === item.index;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={item.index}
                        onClick={() => {
                          item.onSelect();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(item.index)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? "bg-[#21262D] text-white"
                              : "bg-slate-100 text-slate-900"
                            : darkMode
                            ? "hover:bg-[#1C2128]"
                            : "hover:bg-slate-50"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            <HighlightMatch text={item.title} query={query} />
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <HighlightMatch text={item.subtitle} query={query} />
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Invoices */}
              {groupedResults.invoices.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3 text-indigo-500" />
                    <span>Invoices & Payments ({groupedResults.invoices.length})</span>
                  </div>
                  {groupedResults.invoices.map((item) => {
                    const isSelected = selectedIndex === item.index;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={item.index}
                        onClick={() => {
                          item.onSelect();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(item.index)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? "bg-[#21262D] text-white"
                              : "bg-slate-100 text-slate-900"
                            : darkMode
                            ? "hover:bg-[#1C2128]"
                            : "hover:bg-slate-50"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            <HighlightMatch text={item.title} query={query} />
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <HighlightMatch text={item.subtitle} query={query} />
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="py-8 px-6 text-center text-xs">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <div className="font-bold text-slate-700 dark:text-slate-200">
                No results found for &ldquo;{query}&rdquo;
              </div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                No matching candidates, users, jobs, recruiters, or invoices in the current registry.
              </p>
            </div>
          )}

          {/* Keyboard hints footer */}
          <div
            className={`p-2.5 px-4 border-t text-[11px] flex items-center justify-between text-slate-400 ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono">
                <ArrowUpDown className="w-3 h-3" /> Navigate
              </span>
              <span className="flex items-center gap-1 font-mono">
                <CornerDownLeft className="w-3 h-3" /> Select
              </span>
            </div>
            <span className="font-mono">ESC to dismiss</span>
          </div>
        </div>
      )}
    </div>
  );
}
