import { ArrowUpRight, Copy, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Magnetic, Reveal } from "@/components/chrome";
import { profile, stackGroups } from "@/lib/site-data";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-surface shadow-border">
            <img
              src={profile.avatar}
              alt={`${profile.name} on GitHub`}
              width={480}
              height={480}
              className="aspect-[4/5] w-full object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
              <p className="text-sm text-fg">{profile.name}</p>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">{profile.pronouns}</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs tracking-[0.22em] text-subtle uppercase">About</p>
            <h2 className="font-display mt-3 text-4xl italic sm:text-5xl">A clinic, a lake, a terminal</h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {profile.bio.map((p) => (
              <Reveal key={p}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80}>
            <p className="mt-8 text-fg">{profile.currently}</p>
            <p className="mt-3 text-sm text-muted">
              Learning {profile.learning.join(", ")}. {profile.openTo}
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted">
              <MapPin className="size-4 text-accent" />
              {profile.location}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function StackSection() {
  return (
    <section id="stack" className="scroll-mt-24 border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs tracking-[0.22em] text-subtle uppercase">Stack</p>
          <h2 className="font-display mt-3 max-w-xl text-4xl italic sm:text-5xl">
            Tools that survive a deadline
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stackGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 70}>
              <p className="text-xs tracking-[0.18em] text-subtle uppercase">{group.title}</p>
              <ul className="mt-5 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="flex h-11 w-full items-center rounded-xl bg-surface px-4 text-sm text-fg shadow-border transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-border-hover">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast("Email copied");
    } catch {
      toast("Copy failed — use the mail link");
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs tracking-[0.22em] text-subtle uppercase">Contact</p>
          <h2 className="font-display mt-3 text-4xl italic sm:text-6xl">Let’s build something odd</h2>
          <p className="mt-6 max-w-lg text-muted">
            Creative AI, dental media, or a 3D experiment that shouldn’t work in a browser — write.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-4">
          <Magnetic strength={0.12} className="w-full">
            <button
              type="button"
              onClick={copy}
              data-cursor="Copy"
              className="group flex w-full items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-5 text-left shadow-border transition-[box-shadow] duration-200 hover:shadow-border-hover sm:px-8"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Mail className="size-4 shrink-0 text-accent" />
                <span className="truncate font-display text-xl sm:text-3xl">{profile.email}</span>
              </span>
              <Copy className="size-4 shrink-0 text-muted" />
            </button>
          </Magnetic>

          <Magnetic strength={0.12} className="w-full">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="GitHub"
              className="group flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-5 shadow-border transition-[box-shadow] duration-200 hover:shadow-border-hover sm:px-8"
            >
              <span className="font-display text-xl sm:text-3xl">github.com/{profile.githubHandle}</span>
              <ArrowUpRight className="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Dentist · AI researcher · Builder — {profile.location}</p>
      </div>
    </footer>
  );
}
