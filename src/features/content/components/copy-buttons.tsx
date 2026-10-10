"use client";

import { Check, Copy, Layers } from "lucide-react";

import { useCopy } from "@/shared/hooks/use-copy";

function CopyButton({
  label,
  copiedLabel,
  icon,
  text,
}: {
  label: string;
  copiedLabel: string;
  icon: React.ReactNode;
  text: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => void copy(text)}
      className="border-border text-muted-2 hover:border-border-strong hover:bg-surface hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-control border px-2.5 py-1.5 text-xs font-medium transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : icon}
      {copied ? copiedLabel : label}
    </button>
  );
}

export function CopyButtons({ pageText, sectionText }: { pageText: string; sectionText?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {sectionText && (
        <CopyButton
          label="Copiar seção"
          copiedLabel="Copiado"
          icon={<Layers className="h-3.5 w-3.5" />}
          text={sectionText}
        />
      )}
      <CopyButton
        label="Copiar conteúdo"
        copiedLabel="Copiado"
        icon={<Copy className="h-3.5 w-3.5" />}
        text={pageText}
      />
    </div>
  );
}
