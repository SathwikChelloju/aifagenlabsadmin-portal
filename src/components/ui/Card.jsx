import React from "react";

/**
 * Universal Card Primitive
 * Signature rounded-3xl container with thin slate borders.
 */
export default function Card({
  children,
  className = "",
  hoverable = false,
  overflow = "visible",
  ...props
}) {
  return (
    <div
      className={`border rounded-3xl shadow-xs transition-all bg-white border-slate-200/90 dark:bg-[#161B22] dark:border-[#30363D] ${
        hoverable
          ? "hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm"
          : ""
      } ${overflow === "hidden" ? "overflow-hidden" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  children,
  className = "",
  bordered = true,
  ...props
}) {
  return (
    <div
      className={`p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        bordered ? "border-b border-slate-100 dark:border-slate-500/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  children,
  className = "",
  as: Component = "h3",
  ...props
}) {
  return (
    <Component
      className={`text-base font-extrabold tracking-tight text-[#0B192C] dark:text-white flex items-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

Card.Description = function CardDescription({
  children,
  className = "",
  ...props
}) {
  return (
    <p
      className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

Card.Content = function CardContent({
  children,
  className = "",
  padding = true,
  ...props
}) {
  return (
    <div className={`${padding ? "p-6 sm:p-7" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className = "",
  bordered = true,
  ...props
}) {
  return (
    <div
      className={`px-6 sm:px-7 py-4 bg-slate-50/50 dark:bg-[#0D1117]/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 ${
        bordered ? "border-t border-slate-100 dark:border-slate-500/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
