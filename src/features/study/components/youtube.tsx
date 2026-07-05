function extractId(idOrUrl: string): string {
  const url = idOrUrl.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return url;
}

export function YouTube({ id, title = "Vídeo do YouTube" }: { id: string; title?: string }) {
  const videoId = extractId(id);

  return (
    <div className="not-prose my-7">
      <div className="border-border bg-surface relative aspect-video overflow-hidden rounded-xl border">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-muted mt-2 text-xs">{title}</p>
    </div>
  );
}
