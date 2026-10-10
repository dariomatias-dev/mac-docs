import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

type ContributorCardProps = {
  name: string;
  subtitle: string;
  href?: string;
  avatarUrl?: string;
  /** Short labels under the name, e.g. the roles a person holds. */
  tags?: string[];
};

export function ContributorCard({ name, subtitle, href, avatarUrl, tags }: ContributorCardProps) {
  const content = (
    <>
      {avatarUrl ? (
        // Small external avatars gain nothing from the optimizer, so they're
        // served as-is (hosts are still allow-listed in next.config.ts).
        <Image
          src={avatarUrl}
          alt={name}
          width={52}
          height={52}
          unoptimized
          className="border-border h-13 w-13 shrink-0 rounded-full border"
        />
      ) : (
        <span className="bg-accent-soft text-accent flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-lg font-semibold">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="text-foreground block truncate font-semibold">{name}</span>
        <span className="text-muted block truncate text-sm">{subtitle}</span>
        {tags && tags.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-accent-soft text-accent-dark dark:text-accent rounded-chip px-2 py-0.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>
      {href && (
        <ArrowUpRight
          aria-hidden="true"
          className="text-muted group-hover:text-accent h-4 w-4 shrink-0 self-start transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );

  const className =
    "group border-border bg-background rounded-card flex items-center gap-4 border p-4 transition-[border-color,box-shadow]";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${className} hover:border-accent/40 hover:shadow-soft`}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
