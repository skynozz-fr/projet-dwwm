import { Facebook, Instagram, Twitter } from "lucide-react"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-8 border-t border-border bg-surface/70">
      <div className="app-container flex flex-col gap-3 py-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {currentYear} FC Popcorn. Tous droits reserves.</p>
        <nav className="flex items-center gap-3">
          <a
            href="#"
            rel="noreferrer"
            aria-label="Instagram"
            className="no-link-anim rounded-md p-1.5 text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            rel="noreferrer"
            aria-label="Facebook"
            className="no-link-anim rounded-md p-1.5 text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          >
            <Facebook size={18} />
          </a>
          <a
            href="#"
            rel="noreferrer"
            aria-label="Twitter"
            className="no-link-anim rounded-md p-1.5 text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          >
            <Twitter size={18} />
          </a>
        </nav>
      </div>
    </footer>
  )
}
