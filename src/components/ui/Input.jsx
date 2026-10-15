import React from "react";

/**
 * Universal Input Primitive
 * Matches portal's search fields and high-density form inputs.
 */
export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  size = "md",
  type = "text",
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const sizeClasses = {
    sm: "py-1.5 text-xs rounded-xl",
    md: "py-2 text-xs sm:text-sm rounded-xl",
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`w-full transition-colors font-medium border focus:outline-none ${
            Icon ? "pl-9 pr-3.5" : "px-3.5"
          } ${sizeClasses[size] || sizeClasses.md} ${
            error
              ? "bg-rose-50/50 border-rose-300 text-rose-900 focus:border-rose-500 dark:bg-rose-950/20 dark:border-rose-800"
              : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 dark:bg-[#161B22] dark:border-[#30363D] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-amber-500"
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-400 font-mono">{helperText}</p>
      ) : null}
    </div>
  );
}
