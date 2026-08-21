import { useMemo, useState } from "react";
import { Reveal } from "@/components/chrome";
import { ProjectRow, SpotlightCard } from "@/components/spotlight-card";
import { filters, projects, type ProjectTag } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function WorkSection() {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.tags.includes(active as ProjectTag));
  }, [active]);

  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  return (
    <section id="work" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.22em] text-subtle uppercase">Selected work</p>
              <h2 className="font-display mt-3 text-4xl italic sm:text-5xl">From the studio</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              AI products, 3D experiments, and dental storytelling tools — all public on GitHub.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            className="mt-10 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter projects"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active === f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "h-11 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-150",
                  active === f.id
                    ? "bg-fg text-bg"
                    : "text-muted shadow-border hover:text-fg hover:shadow-border-hover",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {featured.length > 0 && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={i * 60} className={i === 0 ? "h-full sm:col-span-2" : "h-full"}>
                <SpotlightCard project={project} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-16">
            <p className="text-xs tracking-[0.22em] text-subtle uppercase">Archive</p>
            <div className="mt-4">
              {rest.map((project) => (
                <Reveal key={project.slug}>
                  <ProjectRow project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {visible.length === 0 && (
          <p className="mt-12 text-muted">Nothing in this lane yet.</p>
        )}
      </div>
    </section>
  );
}
