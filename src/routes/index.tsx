import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StudioHud } from "@/components/studio-hud";
import { StudioCanvas } from "@/game/StudioCanvas";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    setLive(true);
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden" style={{ background: "#6b9a3e" }}>
      {live ? <StudioCanvas /> : null}
      <StudioHud />
    </main>
  );
}
