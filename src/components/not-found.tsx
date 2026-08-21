import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-6 overflow-y-auto bg-paper px-6 text-center">
      <p className="text-xs tracking-[0.22em] text-subtle uppercase">404</p>
      <h1 className="font-display text-5xl italic text-ink sm:text-6xl">Off the plaza</h1>
      <p className="max-w-md text-muted">That path isn’t on the map. Drive back to the studio.</p>
      <Link
        to="/"
        className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.96]"
      >
        Back to studio
      </Link>
    </main>
  );
}
