import { useEffect, useRef, useState } from "react";

import { MAX_NOTE_LENGTH } from "../lib/use-annotations";

const NOTE_TEXTAREA_STYLES = {
  new: "border-border bg-background text-foreground focus:border-accent focus:ring-accent/20 w-full resize-none overflow-y-auto rounded-[10px] border p-3 text-sm leading-relaxed transition-colors outline-none focus:ring-2",
  edit: "text-foreground placeholder:text-muted-2 w-full resize-none overflow-y-auto bg-transparent text-sm leading-relaxed outline-none",
};

const TEXTAREA_MAX_HEIGHT_PX = 240;

// Shared textarea + save/cancel behavior for both the "new note" form and an
// annotation's edit mode, so keyboard shortcuts and submit logic live once.
export function NoteForm({
  variant,
  initialValue = "",
  placeholder,
  autoFocus,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  variant: keyof typeof NOTE_TEXTAREA_STYLES;
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  submitLabel: string;
  onSubmit: (note: string) => void;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [autoFocus]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_NOTE_LENGTH))}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel?.();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder={placeholder}
        rows={3}
        maxLength={MAX_NOTE_LENGTH}
        className={NOTE_TEXTAREA_STYLES[variant]}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-muted-2 text-[0.7rem] tabular-nums">
          {value.length}/{MAX_NOTE_LENGTH}
        </span>
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-2 hover:text-foreground cursor-pointer text-xs"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="text-accent cursor-pointer text-xs font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
