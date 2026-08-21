import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/chrome";
import { navItems, profile } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#work" className="skip-link">
        Skip to work
      </a>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-[background-color,box-shadow] duration-200",
          scrolled || open ? "bg-bg/80 shadow-border backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.25rem] sm:px-8">
          <Magnetic strength={0.18}>
            <Link
              to="/"
              data-cursor="Home"
              className="flex items-center gap-2.5 text-sm tracking-[0.14em] text-fg uppercase"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-line-strong">
                <span className="block h-px w-3 bg-accent" />
              </span>
              <span className="hidden sm:inline">{profile.first}</span>
            </Link>
          </Magnetic>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Magnetic key={item.id} strength={0.22}>
                <a
                  href={item.href}
                  data-cursor={item.label}
                  className="text-sm text-muted transition-colors duration-150 hover:text-fg"
                >
                  {item.label}
                </a>
              </Magnetic>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.22}>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="GitHub"
                className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-fg"
                aria-label="GitHub profile"
              >
                <Github className="size-4" />
              </a>
            </Magnetic>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-fg md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-end bg-bg/95 px-6 pb-10 backdrop-blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display py-3 text-4xl italic text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
