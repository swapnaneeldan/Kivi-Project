import type { SVGProps } from "react";

export function HeadingSwish({ className, ...props }: SVGProps<SVGSVGElement>) {
  return <svg className={["kivi-heading-swish", className].filter(Boolean).join(" ")} viewBox="0 0 180 14" preserveAspectRatio="none" fill="none" aria-hidden="true" {...props}>
    <path d="M4 9.6C28 2.8 51 4.3 75 7.3c30 3.8 57 1.1 96-3.4-23 5.5-47 8.8-78 7.7C59.5 10.5 34.5 8.5 4 9.6Z" fill="currentColor" />
    <path d="M11 11c35-2 77 3.1 154-4.1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".62" />
  </svg>;
}
