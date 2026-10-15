import React, { useState, useRef, useEffect } from "react";

/**
 * Universal DropdownMenu Primitive
 * Action popover with click-outside dismissal, direction control (up/down), and keyboard navigation.
 */
export default function DropdownMenu({
  trigger,
  items = [],
  align = "right",
  direction = "down",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const positionClasses = direction === "up"
    ? `bottom-full mb-2 ${align === "right" ? "right-0" : "left-0"}`
    : `mt-2 ${align === "right" ? "right-0" : "left-0"}`;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className="cursor-pointer select-none inline-block focus:outline-hidden"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 w-52 rounded-2xl shadow-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] py-1.5 animate-in fade-in zoom-in-95 duration-100 ${positionClasses}`}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <div
                  key={idx}
                  className="my-1 border-t border-slate-100 dark:border-[#30363D]"
                />
              );
            }

            const Icon = item.icon;

            return (
              <button
                key={idx}
                type="button"
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  item.danger
                    ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#21262D]"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
