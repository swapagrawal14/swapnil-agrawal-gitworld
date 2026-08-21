import type { CoverKind } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 640 400"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const stroke = "currentColor";

export function ProjectCover({ kind, className }: { kind: CoverKind; className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-elevated text-accent",
        className,
      )}
    >
      {kind === "rings" && (
        <Frame>
          <circle cx="320" cy="200" r="40" fill="none" stroke={stroke} strokeWidth="1.2" />
          <circle cx="320" cy="200" r="80" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.75" />
          <circle cx="320" cy="200" r="128" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.5" />
          <circle cx="320" cy="200" r="176" fill="none" stroke={stroke} strokeWidth="1" opacity="0.28" />
          <circle cx="320" cy="200" r="5" fill={stroke} />
        </Frame>
      )}
      {kind === "chat" && (
        <Frame>
          <rect x="120" y="92" width="280" height="56" rx="18" fill="none" stroke={stroke} strokeWidth="1.4" />
          <rect x="240" y="168" width="280" height="56" rx="18" fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.7" />
          <rect x="150" y="244" width="220" height="56" rx="18" fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.4" />
        </Frame>
      )}
      {kind === "cube" && (
        <Frame>
          <path
            d="M320 86 L470 162 L470 278 L320 354 L170 278 L170 162 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <path d="M320 86 L320 206 L170 278" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.55" />
          <path d="M320 206 L470 278" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.55" />
        </Frame>
      )}
      {kind === "topo" && (
        <Frame>
          <ellipse cx="320" cy="200" rx="70" ry="28" fill="none" stroke={stroke} strokeWidth="1.2" />
          <ellipse cx="320" cy="200" rx="130" ry="52" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
          <ellipse cx="320" cy="200" rx="200" ry="84" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.4" />
          <ellipse cx="320" cy="200" rx="270" ry="118" fill="none" stroke={stroke} strokeWidth="1" opacity="0.22" />
        </Frame>
      )}
      {kind === "film" && (
        <Frame>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={110 + i * 150}
              y="88"
              width="120"
              height="224"
              rx="8"
              fill="none"
              stroke={stroke}
              strokeWidth="1.4"
              opacity={1 - i * 0.25}
            />
          ))}
        </Frame>
      )}
      {kind === "brackets" && (
        <Frame>
          <path d="M230 90 L150 200 L230 310" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M410 90 L490 200 L410 310" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="320" cy="200" r="6" fill={stroke} />
        </Frame>
      )}
      {kind === "wave" && (
        <Frame>
          <path
            d="M60 220 C 120 120, 180 280, 240 200 S 360 80, 420 200 S 540 300, 590 180"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <path
            d="M60 250 C 120 170, 180 300, 240 230 S 360 140, 420 230 S 540 310, 590 210"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
            opacity="0.4"
          />
        </Frame>
      )}
      {kind === "orbit" && (
        <Frame>
          <ellipse
            cx="320"
            cy="200"
            rx="210"
            ry="80"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
            transform="rotate(-18 320 200)"
          />
          <ellipse
            cx="320"
            cy="200"
            rx="150"
            ry="56"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
            opacity="0.5"
            transform="rotate(22 320 200)"
          />
          <circle cx="320" cy="200" r="10" fill={stroke} />
          <circle cx="500" cy="148" r="6" fill={stroke} />
        </Frame>
      )}
      {kind === "grid" && (
        <Frame>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={190 + c * 90}
                y={80 + r * 80}
                width="70"
                height="60"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1.3"
                opacity={r === 1 && c === 1 ? 1 : 0.4}
              />
            )),
          )}
        </Frame>
      )}
      {kind === "planes" && (
        <Frame>
          <path d="M140 250 L300 110 L500 150 L340 300 Z" fill="none" stroke={stroke} strokeWidth="1.4" />
          <path
            d="M180 270 L340 130 L540 170 L380 320 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
            opacity="0.45"
          />
        </Frame>
      )}
      {kind === "badge" && (
        <Frame>
          <rect x="180" y="90" width="280" height="220" rx="22" fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="250" cy="180" r="36" fill="none" stroke={stroke} strokeWidth="1.3" />
          <path d="M310 158 h120" stroke={stroke} strokeWidth="1.3" />
          <path d="M310 184 h90" stroke={stroke} strokeWidth="1.3" opacity="0.5" />
          <path d="M210 250 h220" stroke={stroke} strokeWidth="1.3" opacity="0.35" />
        </Frame>
      )}
    </div>
  );
}
