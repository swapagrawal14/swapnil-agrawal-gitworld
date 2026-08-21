import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { ProjectCover } from "@/components/project-cover";
import type { Project } from "@/lib/site-data";
import { tagLabels } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--spot-x", `${px * 100}%`);
    el.style.setProperty("--spot-y", `${py * 100}%`);
    const rx = (py - 0.5) * -6;
    const ry = (px - 0.5) * 8;
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <Link
      ref={ref}
      to="/work/$slug"
      params={{ slug: project.slug }}
      data-cursor="View"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-border transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:shadow-border-hover",
      )}
    >
      <span className="spot-glow" />
      <ProjectCover
        kind={project.cover}
        className={cn(
          "w-full shrink-0 border-b border-line transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]",
          featured ? "h-72 sm:h-80" : "h-48",
        )}
      />
      <div className="relative flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-subtle tabular-nums">
            {project.number}
          </p>
          <ArrowUpRight className="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="font-display text-2xl leading-tight text-fg sm:text-[1.65rem]">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-elevated px-2.5 py-1 text-[0.6875rem] tracking-[0.12em] text-muted uppercase"
            >
              {tagLabels[tag]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: project.slug }}
      data-cursor="View"
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line py-5 transition-colors duration-200 hover:bg-elevated/60 sm:grid-cols-[4rem_1fr_auto_auto] sm:gap-8 sm:py-6"
    >
      <span className="font-mono text-xs tracking-[0.16em] text-subtle tabular-nums">
        {project.number}
      </span>
      <div className="min-w-0">
        <h3 className="truncate font-display text-xl text-fg sm:text-2xl">{project.title}</h3>
        <p className="mt-1 truncate text-sm text-muted">{project.tagline}</p>
      </div>
      <div className="hidden flex-wrap justify-end gap-2 sm:flex">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2.5 py-1 text-[0.6875rem] tracking-[0.12em] text-subtle uppercase"
          >
            {tagLabels[tag]}
          </span>
        ))}
      </div>
      <ArrowUpRight className="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
