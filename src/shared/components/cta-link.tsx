import Link from "next/link";

import type { ComponentProps, ReactNode } from "react";

const VARIANT_CLASS = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-dark dark:hover:bg-accent-bright shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(15_23_42/0.2)]",
  secondary: "bg-surface-2 text-foreground hover:bg-border",
} as const;

type Variant = keyof typeof VARIANT_CLASS;

function ctaClassName(variant: Variant) {
  return `inline-flex h-10 items-center gap-2 rounded-control px-4.5 text-sm font-semibold transition-[background-color,color,transform] active:scale-[0.98] ${VARIANT_CLASS[variant]}`;
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
