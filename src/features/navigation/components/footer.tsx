export function Footer() {
  return (
    <footer className="border-border text-muted border-t px-4 py-8 text-center text-sm">
      <p>Distribuído sob licença MIT.</p>
      <p>mac-docs © {new Date().getFullYear()}</p>
      <p className="mt-1">
        Desenvolvido por{" "}
        <a
          href="https://github.com/dariomatias-dev"
          target="_blank"
          rel="noreferrer"
          className="text-accent font-medium hover:underline"
        >
          dariomatias-dev
        </a>
      </p>
    </footer>
  );
}
