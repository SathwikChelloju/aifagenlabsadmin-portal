import React from "react";
import { BADGE_VARIANTS } from "../../constants/theme";

/**
 * Universal Badge & Status Pill Primitive
 * Formatted with JetBrains Mono numbers and rounded-full borders.
 */
export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-xs gap-1.5",
  };

  const variantConfig = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;

  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-bold rounded-full transition-colors whitespace-nowrap select-none ${
        sizeClasses[size] || sizeClasses.md
      } ${variantConfig.light} dark:${variantConfig.dark} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
