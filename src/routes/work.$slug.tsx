import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { ProjectCover } from "@/components/project-cover";
import { adjacentProjects, getProject, tagLabels } from "@/lib/site-data";

export const Route = createFileRoute("/work/$slug")({
  component: WorkDetail,
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project, ...adjacentProjects(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.project.title} — Swapnil Agrawal`
          : "Work — Swapnil Agrawal",
      },
    ],
  }),
});

function WorkDetail() {
  const { project, prev, next } = Route.useLoaderData();

  return (
    <main className="h-dvh overflow-y-auto bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Back to studio
        </Link>

        <p className="mt-10 font-mono text-xs tracking-[0.18em] text-subtle tabular-nums">
          {project.number} · {project.tags.map((t) => tagLabels[t]).join(" / ")}
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[1.05] sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{project.tagline}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors duration-150 hover:bg-accent"
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
              className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-ink shadow-border hover:bg-elevated"
            >
              <Github className="size-4" />
              Repository
            </a>
          )}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl shadow-border">
          <ProjectCover kind={project.cover} className="h-64 sm:h-80" />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {project.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <aside className="rounded-2xl bg-elevated p-6">
            <p className="text-xs tracking-[0.18em] text-subtle uppercase">Stack</p>
            <ul className="mt-4 flex flex-col gap-2">
              {project.stack.map((item) => (
                <li key={item} className="text-sm text-ink">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs tracking-[0.18em] text-subtle uppercase">Summary</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
          </aside>
        </div>

        <div className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          {prev && (
            <Link
              to="/work/$slug"
              params={{ slug: prev.slug }}
              className="rounded-2xl bg-elevated p-6 transition-transform duration-150 hover:-translate-y-0.5"
            >
              <p className="text-xs tracking-[0.16em] text-subtle uppercase">Previous</p>
              <p className="font-display mt-2 text-2xl">{prev.title}</p>
            </Link>
          )}
          {next && (
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              className="rounded-2xl bg-elevated p-6 text-right transition-transform duration-150 hover:-translate-y-0.5"
            >
              <p className="text-xs tracking-[0.16em] text-subtle uppercase">Next</p>
              <p className="font-display mt-2 text-2xl">{next.title}</p>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
