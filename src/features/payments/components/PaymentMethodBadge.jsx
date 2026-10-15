import React from "react";

/**
 * Visual Payment Method Logo & Text Badge
 * Replicates the authentic branding for Visa, Mastercard, PayPal, JCB, Stripe, and Razorpay
 * matching the reference screenshot.
 */

// 1. Visa Logo SVG
export function VisaLogo({ className = "w-7 h-4.5" }) {
  return (
    <svg
      className={`${className} rounded shrink-0 shadow-2xs`}
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="20" rx="3" fill="#1434CB" />
      <path
        d="M12.8 14.5L14.7 5.5H16.8L14.9 14.5H12.8ZM22.3 5.7C21.9 5.5 21.2 5.3 20.4 5.3C18.3 5.3 16.8 6.4 16.8 8C16.8 9.2 17.8 9.9 18.6 10.3C19.4 10.7 19.7 11 19.7 11.4C19.7 12 18.9 12.4 18.2 12.4C17.4 12.4 16.9 12.2 16.2 11.9L15.9 11.7L15.6 13.3C16.1 13.5 17 13.7 18 13.7C20.2 13.7 21.7 12.6 21.7 10.9C21.7 9.9 21.1 9.2 19.9 8.6C19.2 8.2 18.8 8 18.8 7.5C18.8 7.1 19.3 6.7 20.2 6.7C20.9 6.7 21.5 6.9 21.9 7.1L22.1 7.2L22.3 5.7ZM25.4 14.5H27.2L25.6 5.5H24L22.4 12.9L22.1 11.7C21.8 10.5 20.8 9.3 19.7 8.7L21.4 14.5H23.5L25.4 14.5ZM10.5 5.5L8.7 11.7C8.6 11.9 8.5 12 8.3 12.1C7.5 12.6 6.5 13 5.5 13.3L5.6 13.7H9.2C9.7 13.7 10.1 13.4 10.2 12.9L11.1 8.5L12.5 14.5H14.7L11.7 5.5H10.5Z"
        fill="white"
      />
    </svg>
  );
}

// 2. Mastercard Overlapping Circles Logo
export function MastercardLogo({ className = "w-6 h-4" }) {
  return (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="8" r="6.2" fill="#EB001B" />
      <circle cx="17" cy="8" r="6.2" fill="#F79E1B" />
      <path
        d="M12 3.65A6.18 6.18 0 0 0 9.8 8c0 1.76.73 3.37 2.2 4.35A6.18 6.18 0 0 0 14.2 8a6.18 6.18 0 0 0-2.2-4.35Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

// 3. PayPal Dual-P Blue Logo
export function PayPalLogo({ className = "w-4.5 h-4.5" }) {
  return (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.45A.82.82 0 0 1 5.753 1.8h7.091c2.474 0 4.284.58 5.234 1.677.892 1.03.992 2.47.307 4.398-.106.297-.23.6-.372.906-1.127 2.443-3.13 3.682-5.955 3.682H9.55l-1.393 8.134a.64.64 0 0 1-.633.54h-.448z"
        fill="#003087"
      />
      <path
        d="M9.55 12.463h2.508c2.825 0 4.828-1.239 5.955-3.682.142-.306.266-.609.372-.906.495 1.488.358 2.97-.423 4.156-.99 1.506-2.88 2.269-5.617 2.269H9.837L8.43 22.378a.641.641 0 0 1-.633.54H4.535a.512.512 0 0 1-.506-.592l1.647-10.428a.82.82 0 0 1 .809-.695H9.55z"
        fill="#0079C1"
      />
    </svg>
  );
}

// 4. JCB Tricolor Rounded Badge Logo
export function JCBLogo({ className = "w-7 h-4.5" }) {
  return (
    <svg
      className={`${className} rounded shrink-0 shadow-2xs`}
      viewBox="0 0 34 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="34" height="22" rx="3.5" fill="white" stroke="#E2E8F0" strokeWidth="0.8" />
      <g transform="translate(3, 2.5)">
        <path d="M0 1.5h8.5a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H0V1.5z" fill="#003B95" />
        <path d="M9 1.5h8.5a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H9V1.5z" fill="#E60012" />
        <path d="M18 1.5h7.5a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H18V1.5z" fill="#008837" />
        <text
          x="14"
          y="12.5"
          fill="white"
          fontSize="9.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          JCB
        </text>
      </g>
    </svg>
  );
}

// 5. Stripe Iconic Wordmark Logo
export function StripeLogo({ className = "h-4" }) {
  return (
    <div className={`inline-flex items-center gap-1 font-bold text-[#635BFF] ${className}`}>
      <span className="font-extrabold text-sm tracking-tight font-sans text-[#635BFF] lowercase">
        stripe
      </span>
    </div>
  );
}

// 6. Razorpay Sharp Logo
export function RazorpayLogo({ className = "w-4.5 h-4.5" }) {
  return (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.6 2.5L5.5 13.8H11.8L9 21.5L18.5 9.8H12.2L13.6 2.5Z"
        fill="#0C2340"
      />
      <path
        d="M13.6 2.5L8.5 10.2H14.8L10.8 17.5L18.5 9.8H12.2L13.6 2.5Z"
        fill="#0082FF"
      />
    </svg>
  );
}

/**
 * Universal Payment Method Badge Component
 * Combines logo and descriptive text matching the screenshot.
 */
export default function PaymentMethodBadge({
  method = "",
  type = "",
  className = "",
  showOnlyIcon = false,
}) {
  const methodStr = String(method || type || "").toLowerCase();

  let LogoComponent = null;
  let detectedType = "Card";

  if (methodStr.includes("visa")) {
    LogoComponent = VisaLogo;
    detectedType = "Visa";
  } else if (methodStr.includes("mastercard") || methodStr.includes("master")) {
    LogoComponent = MastercardLogo;
    detectedType = "Mastercard";
  } else if (methodStr.includes("paypal")) {
    LogoComponent = PayPalLogo;
    detectedType = "PayPal";
  } else if (methodStr.includes("jcb")) {
    LogoComponent = JCBLogo;
    detectedType = "JCB";
  } else if (methodStr.includes("stripe")) {
    LogoComponent = StripeLogo;
    detectedType = "Stripe";
  } else if (methodStr.includes("razorpay")) {
    LogoComponent = RazorpayLogo;
    detectedType = "Razorpay";
  }

  if (showOnlyIcon && LogoComponent) {
    return <LogoComponent />;
  }

  // If method is Stripe, the reference screenshot shows only the purple "stripe" wordmark
  if (detectedType === "Stripe" && (!method || method.toLowerCase() === "stripe" || method.toLowerCase() === "stripe checkout")) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <StripeLogo />
      </div>
    );
  }

  // If method is PayPal with no card suffix
  if (detectedType === "PayPal" && (!method.includes("••••") && !method.includes("..."))) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <PayPalLogo />
        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
          PayPal
        </span>
      </div>
    );
  }

  // If method is Razorpay with no card suffix
  if (detectedType === "Razorpay" && (!method.includes("••••") && !method.includes("..."))) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <RazorpayLogo />
        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
          Razorpay
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {LogoComponent ? (
        <LogoComponent />
      ) : (
        <div className="w-6 h-4 rounded bg-slate-200 dark:bg-slate-700 text-[9px] font-bold flex items-center justify-center font-mono">
          CARD
        </div>
      )}
      <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">
        {method || detectedType}
      </span>
    </div>
  );
}
