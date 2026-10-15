import React from "react";

/**
 * Universal Select Primitive
 * Matches form selects and filter dropdowns.
 */
export default function Select({
  label,
  options = [],
  error,
  helperText,
  className = "",
  id,
  value,
  onChange,
  placeholder,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors focus:outline-none cursor-pointer appearance-none ${
            error
              ? "border-rose-300 text-rose-900 bg-rose-50/50"
              : "border-slate-300 text-slate-800 focus:bg-white focus:border-amber-500 dark:bg-[#161B22] dark:border-[#30363D] dark:text-slate-100 dark:focus:border-amber-500"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val} className="dark:bg-[#161B22] dark:text-white">
                {lbl}
              </option>
            );
          })}
        </select>

        {/* Custom Chevron indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-400 font-mono">{helperText}</p>
      ) : null}
    </div>
  );
}
