import { ExternalLink } from "lucide-react";

type ContributorCardProps = {
  name: string;
  subtitle: string;
  href?: string;
  avatarUrl?: string;
};

export function ContributorCard({ name, subtitle, href, avatarUrl }: ContributorCardProps) {
  const content = (
    <>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatars are external, no image optimization configured
        <img
          src={avatarUrl}
          alt={name}
          className="border-border h-12 w-12 shrink-0 rounded-full border"
        />
      ) : (
        <span className="bg-accent-soft text-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="text-foreground block truncate font-semibold">{name}</span>
        <span className="text-muted block truncate text-sm">{subtitle}</span>
      </span>
      {href && (
        <ExternalLink className="text-muted-2 group-hover:text-accent h-4 w-4 shrink-0 transition-colors" />
      )}
    </>
  );

  const className =
    "group border-border bg-background flex items-center gap-3 rounded-[10px] border p-4 transition-[border-color,box-shadow]";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${className} hover:border-accent hover:shadow-[0_2px_16px_rgba(10,113,148,0.1)]`}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
