export function Footer() {
  return (
    <footer className="border-border text-muted border-t px-6 py-6 text-center text-sm">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>mac-docs © {new Date().getFullYear()}</span>
        <span aria-hidden="true" className="text-border-strong">
          ·
        </span>
        <span>Distribuído sob licença MIT</span>
        <span aria-hidden="true" className="text-border-strong">
          ·
        </span>
        <span>
          Desenvolvido por{" "}
          <a
            href="https://github.com/dariomatias-dev"
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:text-accent font-medium transition-colors"
          >
            dariomatias-dev
          </a>
        </span>
      </p>
    </footer>
  );
}
