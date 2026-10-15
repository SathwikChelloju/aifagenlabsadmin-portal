import React from "react";
import { RefreshCw } from "lucide-react";

/**
 * Universal Button Primitive
 * Variants match Oxford Navy, Oxford Amber, and surface action styles.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold transition-all rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-95";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5 shadow-xs",
    md: "px-4 py-2 text-xs gap-2 shadow-xs",
    lg: "px-5 py-2.5 text-sm gap-2.5 shadow-xs",
    icon: "p-2 rounded-xl shrink-0",
  };

  const variantClasses = {
    // Oxford Navy primary
    primary:
      "bg-[#0B192C] hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs",
    // Oxford Amber brand accent
    amber:
      "bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs",
    // Outline surface button
    outline:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 dark:bg-[#161B22] dark:border-[#30363D] dark:text-slate-200 dark:hover:bg-[#21262D] shadow-xs",
    // Ghost minimal button
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#21262D]",
    // Destructive danger button
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
    // Soft amber tint
    subtleAmber:
      "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${selectedSize} ${selectedVariant} ${className}`}
      {...props}
    >
      {loading ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}

      {children}

      {!loading && IconRight ? (
        <IconRight className="w-3.5 h-3.5 shrink-0" />
      ) : null}
    </button>
  );
}
