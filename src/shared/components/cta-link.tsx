import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const VARIANT_CLASS = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "bg-surface-2 text-foreground hover:bg-border",
} as const;

type Variant = keyof typeof VARIANT_CLASS;

function ctaClassName(variant: Variant) {
  return `inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${VARIANT_CLASS[variant]}`;
}

export function CtaLink({
  variant = "primary",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={ctaClassName(variant)} {...props}>
      {children}
    </Link>
  );
}

export function CtaButton({
  variant = "primary",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button type="button" className={ctaClassName(variant)} {...props}>
      {children}
    </button>
  );
}
