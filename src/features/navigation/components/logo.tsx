import Link from "next/link";

/** MACDocs wordmark linking home; colors follow the theme tokens. */
export function Logo({ className = "h-6.5" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MACDocs: página inicial"
      className="text-foreground rounded-control inline-flex shrink-0"
    >
      <svg viewBox="20 22 400 74" className={`${className} w-auto`} role="img" aria-label="MACDocs">
        <g transform="translate(35, 18)">
          <path
            d="M 10,20 L 30,40 L 10,60"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 40,10 C 60,10 50,70 70,70"
            className="stroke-accent"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="70" cy="70" r="6" fill="currentColor" />
        </g>
        <text
          x="140"
          y="85"
          fontFamily="inherit"
          fontSize="56"
          fontWeight="300"
          fill="currentColor"
        >
          MAC
          <tspan fontWeight="800" className="fill-accent">
            Docs
          </tspan>
        </text>
      </svg>
    </Link>
  );
}
