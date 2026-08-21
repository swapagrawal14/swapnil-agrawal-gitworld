import { ArrowDown } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Magnetic } from "@/components/chrome";
import { profile, projects } from "@/lib/site-data";

function HeroField() {
  const ref = useRef<HTMLDivElement>(null);
  const dots = useMemo(() => {
    const cols = 16;
    const rows = 9;
    const list: { id: string; left: string; top: string }[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        list.push({
          id: `${r}-${c}`,
          left: `${((c + 1) / (cols + 1)) * 100}%`,
          top: `${((r + 1) / (rows + 1)) * 100}%`,
        });
      }
    }
    return list;
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = root.querySelector<HTMLElement>("[data-glow]");
    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (glow) {
        glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
      }
    };
    const onLeave = () => {
      if (glow) glow.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        data-glow
        className="absolute top-0 left-0 size-72 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-300"
      />
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute size-1 rounded-full bg-accent/30"
          style={{ left: d.left, top: d.top }}
        />
      ))}
    </div>
  );
}

function MagneticName({ text, italic }: { text: string; italic?: boolean }) {
  const wrap = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const root = wrap.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    letters.forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const pull = Math.max(0, 1 - dist / 220);
      el.style.transform = `translate(${dx * pull * 0.12}px, ${dy * pull * 0.12}px)`;
    });
  };

  const onLeave = () => {
    wrap.current
      ?.querySelectorAll<HTMLElement>("[data-letter]")
      .forEach((el) => {
        el.style.transform = "translate(0,0)";
      });
  };

  return (
    <span
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`flex flex-wrap justify-start font-display leading-[0.88] tracking-[-0.04em] text-fg ${italic ? "italic" : ""}`}
    >
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          data-letter
          className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden px-5 pt-28 pb-10 sm:px-8 sm:pb-14">
      <HeroField />
      <div className="hero-wash" />

      <div className="relative mx-auto w-full max-w-6xl stagger-in">
        <p className="text-xs tracking-[0.22em] text-subtle uppercase">
          {profile.location} · {profile.pronouns}
        </p>

        <h1 className="mt-6 max-w-5xl text-display">
          <MagneticName text={profile.first} />
          <MagneticName text={profile.last} italic />
        </h1>

        <div className="mt-8 flex max-w-2xl flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
            {profile.headline}
          </p>
          <ul className="flex flex-wrap gap-2">
            {profile.roles.map((role) => (
              <li
                key={role}
                className="rounded-full bg-elevated px-3 py-1.5 text-xs tracking-[0.14em] text-muted uppercase"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
          <dl className="flex flex-wrap gap-10">
            <div>
              <dt className="text-[0.6875rem] tracking-[0.16em] text-subtle uppercase">Projects</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums">{projects.length}</dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] tracking-[0.16em] text-subtle uppercase">Focus</dt>
              <dd className="mt-1 font-display text-3xl italic">AI × Web</dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] tracking-[0.16em] text-subtle uppercase">Based</dt>
              <dd className="mt-1 font-display text-3xl italic">Udaipur</dd>
            </div>
          </dl>
          <Magnetic>
            <a
              href="#work"
              data-cursor="Scroll"
              className="inline-flex h-11 items-center gap-2 rounded-full px-1 text-sm text-muted transition-colors duration-150 hover:text-fg"
            >
              <span>Selected work</span>
              <ArrowDown className="size-4" />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
