"use client";

import { useState } from "react";

import { Check, Copy, Layers } from "lucide-react";

function useCopy() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return { copied, copy };
}

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
      onClick={() => copy(text)}
      className="border-border hover:border-accent hover:bg-surface hover:text-accent flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-[0.8rem] font-medium transition-colors"
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
