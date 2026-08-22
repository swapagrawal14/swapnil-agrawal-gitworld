import { ArrowUpRight, Github, Mail, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { combat, getKills, subscribeKills } from "@/game/combat";
import { toast } from "sonner";
import { foot, sim, stick } from "@/game/input";
import { siteBySlug } from "@/game/layout";
import { useStudio } from "@/game/store";
import { filters, getProject, profile, projects, tagLabels, type ProjectTag } from "@/lib/site-data";

function Joystick() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setFrom = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (clientX - cx) / (r.width / 2);
      const dy = (clientY - cy) / (r.height / 2);
      const mag = Math.hypot(dx, dy);
      const s = mag > 1 ? 1 / mag : 1;
      stick.x = dx * s;
      stick.y = -dy * s;
    };
    const start = (e: PointerEvent) => {
      e.stopPropagation();
      active.current = true;
      el.setPointerCapture(e.pointerId);
      setFrom(e.clientX, e.clientY);
    };
    const move = (e: PointerEvent) => {
      if (!active.current) return;
      setFrom(e.clientX, e.clientY);
    };
    const end = () => {
      active.current = false;
      stick.x = 0;
      stick.y = 0;
    };
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    return () => {
      el.removeEventListener("pointerdown", start);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      stick.x = 0;
      stick.y = 0;
    };
  }, []);

  return (
    <div
      ref={ref}
      data-ui
      className="relative size-[8.5rem] touch-none rounded-full bg-paper/90 shadow-border ring-2 ring-ink/10 md:hidden"
      aria-label="Move stick"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/20" />
    </div>
  );
}

function TopBar() {
  const openPanel = useStudio((s) => s.openPanel);
  const playing = useStudio((s) => s.playing);
  if (!playing) return null;
  return (
    <header className="pointer-events-auto absolute top-0 right-0 left-0 z-20 flex items-center justify-between gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] py-3 sm:gap-3 sm:px-6 sm:py-4">
      <p className="font-display text-base text-ink italic sm:text-xl">{profile.first}</p>
      <nav className="flex items-center gap-0.5 sm:gap-1">
        {(["work", "about", "contact"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => openPanel(id)}
            className="h-11 rounded-full px-3 text-sm text-ink/80 capitalize transition-colors duration-150 hover:bg-paper hover:text-ink"
          >
            {id}
          </button>
        ))}
      </nav>
    </header>
  );
}

function StartScreen() {
  const play = useStudio((s) => s.play);
  const playing = useStudio((s) => s.playing);
  if (playing) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end bg-ink/25">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-14">
        <p className="text-[0.65rem] tracking-[0.22em] text-paper uppercase sm:text-xs">
          {profile.location} · {profile.pronouns}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-[0.92] text-paper sm:text-7xl">
          {profile.first}
          <span className="block italic">{profile.last}</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/80 sm:mt-5 sm:text-base">
          A sunlit studio you can walk or drive. {projects.length} public repositories on the
          grounds — drag to look, walk or drive, and clear pathogens with the dental laser. Zombies join once you enter. On phone: tap Enter, then use the left stick and Laser. On phone: tap Enter, then use the left stick + Laser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
          <button
            type="button"
            onClick={play}
            className="inline-flex h-12 min-w-[9.5rem] items-center justify-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-transform duration-150 hover:bg-accent hover:text-accent-fg active:scale-[0.96]"
          >
            Enter the studio
          </button>
          <button
            type="button"
            onClick={() => useStudio.getState().openPanel("work")}
            className="inline-flex h-12 items-center rounded-full px-5 text-sm text-paper shadow-[0_0_0_1px_rgb(244_239_230/0.45)] transition-colors duration-150 hover:bg-paper/10"
          >
            Skip to work
          </button>
        </div>
      </div>
    </div>
  );
}

function NearCard() {
  const nearSlug = useStudio((s) => s.nearSlug);
  const playing = useStudio((s) => s.playing);
  const panel = useStudio((s) => s.panel);
  if (!playing || !nearSlug || panel) return null;
  const project = getProject(nearSlug);
  if (!project) return null;
  return (
    <button
      type="button"
      onClick={() => useStudio.getState().openProject(nearSlug)}
      className="pointer-events-auto absolute bottom-28 left-1/2 z-20 w-[min(26rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl bg-paper p-4 text-left shadow-border sm:bottom-8 sm:p-5"
    >
      <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-subtle tabular-nums">
        {project.number}
      </p>
      <p className="font-display mt-1 text-2xl text-ink">{project.title}</p>
      <p className="mt-1 text-sm text-muted">{project.tagline}</p>
      <p className="mt-3 text-xs tracking-[0.14em] text-subtle uppercase">Click or Enter</p>
    </button>
  );
}

function PanelShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-end justify-center bg-ink/30 sm:items-center sm:p-6">
      <div className="max-h-[86dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-paper p-6 shadow-border sm:rounded-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-3xl text-ink italic sm:text-4xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-elevated"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function WorkPanel({ onClose, play }: { onClose: () => void; play: () => void }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<"all" | ProjectTag>("all");
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (tag !== "all" && !p.tags.includes(tag)) return false;
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.slug.includes(query)
      );
    });
  }, [q, tag]);

  return (
    <PanelShell title="Work" onClose={onClose}>
      <p className="text-sm text-muted">
        {projects.length} public repositories · {list.length} showing
      </p>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the archive"
        className="mt-4 h-11 w-full rounded-full bg-elevated px-4 text-sm text-ink outline-none ring-0 placeholder:text-subtle"
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTag(f.id)}
            className={`h-9 rounded-full px-3 text-xs tracking-[0.08em] uppercase ${
              tag === f.id ? "bg-ink text-paper" : "text-muted hover:bg-elevated"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 flex flex-col">
        {list.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <button
              type="button"
              onClick={() => {
                const site = siteBySlug(p.slug);
                if (site) {
                  sim.x = site.x * 0.62;
                  sim.z = site.z * 0.62;
                  sim.yaw = Math.atan2(-(site.x - sim.x), -(site.z - sim.z));
                  sim.speed = 0;
                }
                play();
                useStudio.getState().openProject(p.slug);
              }}
              className="flex w-full items-center justify-between gap-3 py-3 text-left"
            >
              <span>
                <span className="font-display block text-lg text-ink">{p.title}</span>
                <span className="text-sm text-muted">{p.tagline}</span>
              </span>
              <span className="shrink-0 text-[0.6875rem] tracking-[0.12em] text-subtle uppercase">
                {p.tags.map((t) => tagLabels[t]).join(" · ")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

function Panels() {
  const panel = useStudio((s) => s.panel);
  const activeSlug = useStudio((s) => s.activeSlug);
  const close = useStudio((s) => s.closePanel);
  const play = useStudio((s) => s.play);

  if (panel === "about") {
    return (
      <PanelShell title="About" onClose={close}>
        <p className="text-sm text-muted">
          {profile.roles.join(" · ")} · {profile.location}
        </p>
        <div className="mt-5 space-y-4 text-ink/85">
          {profile.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted">{profile.currently}</p>
      </PanelShell>
    );
  }

  if (panel === "contact") {
    return (
      <PanelShell title="Contact" onClose={close}>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(profile.email);
              toast("Email copied");
            } catch {
              toast(profile.email);
            }
          }}
          className="flex w-full items-center justify-between rounded-xl bg-elevated px-4 py-4 text-left"
        >
          <span className="flex items-center gap-2 text-ink">
            <Mail className="size-4" />
            {profile.email}
          </span>
        </button>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-between rounded-xl px-4 py-4 shadow-border"
        >
          <span className="flex items-center gap-2 text-ink">
            <Github className="size-4" />
            github.com/{profile.githubHandle}
          </span>
          <ArrowUpRight className="size-4 text-muted" />
        </a>
      </PanelShell>
    );
  }

  if (panel === "work") {
    return <WorkPanel onClose={close} play={play} />;
  }

  if (panel === "project" && activeSlug) {
    const project = getProject(activeSlug);
    if (!project) return null;
    return (
      <PanelShell title={project.title} onClose={close}>
        <p className="text-muted">{project.tagline}</p>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/85">
          {project.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full bg-elevated px-3 py-1 text-xs text-muted">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm text-paper"
            >
              Open live
              <ArrowUpRight className="size-4" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-ink shadow-border"
            >
              <Github className="size-4" />
              Repository
            </a>
          )}
        </div>
      </PanelShell>
    );
  }

  return null;
}

export function StudioHud() {
  const playing = useStudio((s) => s.playing);
  const respawn = useStudio((s) => s.respawn);
  const panel = useStudio((s) => s.panel);
  const inCar = useStudio((s) => s.inCar);
  const nearCar = useStudio((s) => s.nearCar);
  const enterCar = useStudio((s) => s.enterCar);
  const exitCar = useStudio((s) => s.exitCar);
  const kills = useSyncExternalStore(subscribeKills, getKills, getKills);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <StartScreen />
      <TopBar />
      <NearCard />
      <Panels />
      {playing && !panel && (
        <>
          <div className="pointer-events-none absolute bottom-6 left-5 hidden text-xs tracking-[0.12em] text-ink/70 uppercase md:block">
            {inCar
              ? "Drag look · WASD drive · E step out · Shift boost · Space jump"
              : "Drag look · WASD run · F dental laser · Q punch · E drive"}
          </div>
          <p className="pointer-events-none absolute top-[max(3.5rem,calc(env(safe-area-inset-top)+3rem))] left-0 right-0 text-center text-[0.65rem] tracking-[0.14em] text-ink/55 uppercase md:hidden">
            Drag to look around
          </p>
          {kills > 0 && (
            <p className="pointer-events-none absolute top-[max(0.8rem,env(safe-area-inset-top))] left-1/2 z-20 -translate-x-1/2 rounded-full bg-paper/80 px-3 py-1 font-mono text-[0.7rem] tracking-[0.12em] text-ink uppercase">
              {kills} cleared
            </p>
          )}
          <div className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-20 md:hidden">
            <Joystick />
          </div>
          <div className="pointer-events-auto absolute right-3 bottom-[max(1rem,env(safe-area-inset-bottom))] flex flex-col items-end gap-2 sm:right-6 sm:bottom-6 sm:gap-3">
            {!inCar && (
              <button
                type="button"
                data-ui
                onPointerDown={(e) => {
                  e.preventDefault();
                  combat.mobileFire = true;
                  foot.action = "shoot";
                }}
                onPointerUp={() => {
                  combat.mobileFire = false;
                }}
                onPointerCancel={() => {
                  combat.mobileFire = false;
                }}
                className="inline-flex h-11 min-w-[5.5rem] items-center justify-center rounded-full bg-[#1a6d72] px-4 text-sm text-paper shadow-border"
              >
                Laser
              </button>
            )}
            {(inCar || nearCar) && (
              <button
                type="button"
                onClick={() => (inCar ? exitCar() : enterCar())}
                className="inline-flex h-11 min-w-[5.5rem] items-center justify-center rounded-full bg-accent px-4 text-sm text-accent-fg shadow-border"
              >
                {inCar ? "Step out" : "Drive"}
              </button>
            )}
            <button
              type="button"
              onClick={respawn}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-4 text-sm text-ink shadow-border"
            >
              <RotateCcw className="size-3.5" />
              Stuck
            </button>
          </div>
        </>
      )}
    </div>
  );
}


