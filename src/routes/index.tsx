import { createFileRoute } from "@tanstack/react-router";
import { StudioHud } from "@/components/studio-hud";
import { StudioCanvas } from "@/game/StudioCanvas";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative h-dvh overflow-hidden bg-bg">
      <StudioCanvas />
      <StudioHud />
    </main>
  );
}
