import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      el.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-px bg-line"
      aria-hidden="true"
    >
      <div
        ref={ref}
        className="h-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    document.documentElement.classList.add("has-cursor");

    const tick = () => {
      const p = pos.current;
      p.rx += (p.x - p.rx) * 0.18;
      p.ry += (p.y - p.ry) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${p.rx}px, ${p.ry}px, 0)`;
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${p.rx}px, ${p.ry}px, 0) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest("[data-cursor]");
      const text = t?.getAttribute("data-cursor") ?? "";
      ring.current?.classList.toggle("is-hot", Boolean(t));
      if (label.current) {
        label.current.textContent = text;
        label.current.classList.toggle("is-hot", Boolean(text));
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-cursor");
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ring} className="cursor-ring hidden md:block" aria-hidden="true" />
      <div ref={label} className="cursor-label hidden md:block" aria-hidden="true" />
    </>
  );
}

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex will-change-transform transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      onPointerMove={(e) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -32px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[4px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
