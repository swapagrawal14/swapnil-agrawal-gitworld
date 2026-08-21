import { archiveProjects } from "@/lib/projects-archive";

export const profile = {
  name: "Swapnil Agrawal",
  first: "Swapnil",
  last: "Agrawal",
  roles: ["Dentist", "AI Researcher", "Builder"] as const,
  location: "Udaipur, India",
  pronouns: "She / Her",
  email: "swapagrawal1411@gmail.com",
  github: "https://github.com/swapagrawal14",
  githubHandle: "swapagrawal14",
  avatar: "https://github.com/swapagrawal14.png?size=480",
  headline: "Building at the intersection of dentistry, generative AI, and the web.",
  currently:
    "Currently building AI-powered web apps and exploring generative systems that actually ship.",
  learning: ["Three.js", "Next.js", "AI / ML integrations"],
  openTo: "Open to collaborating on creative AI projects.",
  bio: [
    "I’m a dentist who caught the builder bug. Based in Udaipur — the city of lakes — I split my time between the clinic and the browser, designing tools that sit at an unusual intersection: healthcare, 3D, and generative AI.",
    "The through-line is usefulness. Motion graphics you can actually edit. A 3D world from a sentence. A documentary pipeline that goes from a rough idea to picture lock. Chat with open-source models that never leaves the machine.",
    "I care about the craft of the interface as much as the model underneath it. If it isn’t clear, fast, and a little bit beautiful, it isn’t done.",
  ],
} as const;

export const navItems = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "stack", label: "Stack", href: "/#stack" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

export type ProjectTag = "ai" | "3d" | "dental" | "web" | "tools" | "games";

export type CoverKind =
  | "rings"
  | "chat"
  | "cube"
  | "topo"
  | "film"
  | "brackets"
  | "wave"
  | "orbit"
  | "grid"
  | "planes"
  | "badge";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  story: string[];
  tags: ProjectTag[];
  featured: boolean;
  stack: string[];
  repo?: string;
  live?: string;
  cover: CoverKind;
  number: string;
};

export const tagLabels: Record<ProjectTag, string> = {
  ai: "AI",
  "3d": "3D",
  dental: "Dental",
  web: "Web",
  tools: "Tools",
  games: "Games",
};

export const featuredProjects: Omit<Project, "number">[] = [
  {
    slug: "motion-graphics-builder",
    title: "Motion Graphics Builder",
    tagline: "Animation, in the browser, no install.",
    summary:
      "A visual editor for motion graphics and animation that runs entirely in the browser — real-time preview, export, and no desktop toolchain.",
    story: [
      "Most motion tools still assume After Effects, a render farm, and a patient afternoon. This one assumes a tab.",
      "The builder is a visual editor for composing motion graphics in the browser: layers, timing, live preview, and export — without installing anything. It was built as a playground for how far a modern web stack can push timeline-based design.",
      "The brief was simple: if you can describe the motion, you should be able to see it immediately.",
    ],
    tags: ["web", "tools"],
    featured: true,
    stack: ["React", "TypeScript", "Vite", "Canvas"],
    repo: "https://github.com/swapagrawal14/motion-graphics-generator",
    live: "https://motion-graphics-builder.lovable.app/",
    cover: "rings",
  },
  {
    slug: "kimchi-ai",
    title: "Kimchi AI Chat",
    tagline: "Open-source LLMs. Private by default.",
    summary:
      "Chat with Kimi K2, MiniMax, and Nemotron in the browser. Encrypted in transit, stored only locally — conversations never touch a third-party server.",
    story: [
      "Kimchi is a privacy-first chat client for open-source models. Kimi K2, MiniMax, Nemotron — in a browser tab, without surrendering the transcript.",
      "Messages are encrypted in transit and kept on the device. There is no training corpus hiding in the fine print. The interface is built to feel like a calm studio tool rather than a novelty chatbot.",
      "It exists because talking to a model shouldn’t require giving away the conversation.",
    ],
    tags: ["ai", "web"],
    featured: true,
    stack: ["React", "TypeScript", "Local storage", "Open-source LLMs"],
    repo: "https://github.com/swapagrawal14/kimchi-ai-webversion",
    live: "https://kimchi-ai-webversion.lovable.app/",
    cover: "chat",
  },
  {
    slug: "hitem-3d",
    title: "HITEM 3D Generator",
    tagline: "A prompt in. A model out.",
    summary:
      "AI-powered 3D model generation that runs in the browser — fast, export-ready, and built for people who don’t want a desktop suite.",
    story: [
      "HITEM turns a sentence into a 3D model without a download, a GPU driver, or a 40-minute queue.",
      "The generator is an in-browser studio for AI 3D: prompt, preview, iterate, export. It was designed for the gap between “I can imagine this object” and “I have a file I can actually use.”",
      "The interface stays out of the way so the model can take the stage.",
    ],
    tags: ["ai", "3d"],
    featured: true,
    stack: ["React", "TypeScript", "3D", "Generative AI"],
    repo: "https://github.com/swapagrawal14/hitem-3d-model-generator",
    live: "https://hitem-3d-model-generator.lovable.app/",
    cover: "cube",
  },
  {
    slug: "world-3d",
    title: "World 3D Generator",
    tagline: "A sentence, or a photo, becomes a world.",
    summary:
      "Turn text or an image into a full 3D environment via the Marble API — with selectable art styles and model tiers.",
    story: [
      "World 3D Generator is a front-end for a simple, slightly outrageous idea: describe a place, or show a picture of one, and walk around in it.",
      "It uses the Marble API by World Labs to synthesize complete 3D environments. Art styles and model tiers are selectable, so the same prompt can land as a sketch, a film still, or something closer to a game level.",
      "The product question was never “can a model do this.” It was “can a person direct it without reading a paper.”",
    ],
    tags: ["ai", "3d"],
    featured: true,
    stack: ["React", "TypeScript", "Marble API", "World Labs"],
    repo: "https://github.com/swapagrawal14/world-3d-generator",
    live: "https://world-3d-generator.lovable.app/",
    cover: "topo",
  },
  {
    slug: "dental-documentary",
    title: "Dental Documentary Generator",
    tagline: "Idea, script, image, video — one pipeline.",
    summary:
      "A complete documentary workshop for dental stories: from a loose idea to a script, then to image prompts and video prompts ready to generate.",
    story: [
      "Dental documentary work has a shape: find the story, write the script, generate the stills, generate the motion, then cut. This project folds that shape into one place.",
      "You start with an idea. The pipeline expands it into a script, then into image prompts, then into video prompts — copy-ready for the generators you already use. A dummy prototype sits alongside markdown system prompts so the workflow can be run by a person, not only by a UI.",
      "It was built for the kind of film that clinics never have time to make, and that patients actually need to see.",
    ],
    tags: ["dental", "ai"],
    featured: true,
    stack: ["React", "Prompt pipelines", "Markdown systems"],
    repo: "https://github.com/swapagrawal14/dental-documentary-generator",
    live: "https://react-9bgimx.onspace.build",
    cover: "film",
  },
  {
    slug: "prompting-generator",
    title: "AI Prompting Generator",
    tagline: "A one-line idea, expanded into a brief.",
    summary:
      "Expands a simple app idea into a detailed development prompt — user stories, technical recommendations, and a brief you can actually hand to a model (or a human).",
    story: [
      "Most people don’t have a product spec. They have a sentence. This generator treats that sentence as the start of a real brief.",
      "Feed it a one-line app idea. It returns a structured development prompt: user stories, technical recommendations, and the kind of detail that keeps a coding model from inventing a different product.",
      "It runs on Gemini, locally via Vite, and is free to try. The point is leverage — a better prompt is a better first day.",
    ],
    tags: ["ai", "tools"],
    featured: true,
    stack: ["TypeScript", "Vite", "React", "Gemini"],
    repo: "https://github.com/swapagrawal14/ai-webapp-prompting-generator",
    live: "https://ai-webapp-prompting-generator.vercel.app",
    cover: "brackets",
  },
  {
    slug: "dentalscript-ai",
    title: "DentalScript AI",
    tagline: "Voiceover in. Animation out.",
    summary:
      "A freelance-born pipeline that turns dental voiceovers into animation-ready prompts — transcription, timestamps, image direction, and motion notes in one workflow.",
    story: [
      "This started as client work. The same video, again and again: a voiceover, a stack of stills, a cut. After enough nights of it, the workflow became the product.",
      "DentalScript AI (also called Dentscript) takes a voiceover, transcribes it with timestamps, and produces the image and animation direction needed to build the piece. It was assembled from a lot of hit-and-trial, a few master prompts, and the tools that actually survive a deadline — ElevenLabs, Cartesia, Flow, and a careful human edit at the end.",
      "Version 2 tightened the loop. The goal was never to replace the editor. It was to stop doing the same three hours of prep by hand.",
    ],
    tags: ["dental", "ai", "tools"],
    featured: false,
    stack: ["React", "ElevenLabs", "Cartesia", "Prompt systems"],
    repo: "https://github.com/swapagrawal14/freelance-dentalvideos-automation",
    live: "https://react-9bufmf.onspace.build",
    cover: "wave",
  },
  {
    slug: "celestial-horoscope",
    title: "Celestial Horoscope",
    tagline: "A small astrology studio on the web.",
    summary:
      "A Lovable-built horoscope experience — Vite, TypeScript, React, and Tailwind — treating a familiar genre with a quieter, more considered interface.",
    story: [
      "Celestial Horoscope is a web app for a very old product: a reading. The stack is contemporary — Vite, TypeScript, React, shadcn, Tailwind — assembled in Lovable and then owned in GitHub.",
      "The design question was how to make a horoscope feel like a studio object instead of a pop-up ad. Quiet type, a little orbit, no carnival.",
    ],
    tags: ["web"],
    featured: false,
    stack: ["React", "TypeScript", "Vite", "Tailwind", "shadcn/ui"],
    repo: "https://github.com/swapagrawal14/celestial-horroscope",
    cover: "orbit",
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio",
    tagline: "The first public studio site.",
    summary:
      "An earlier personal portfolio — HTML at the core — still live as a snapshot of how the practice was first presented on the web.",
    story: [
      "Every studio has a first site. This is that one: a personal portfolio assembled in HTML, published on Vercel, and kept public because the trail matters.",
      "It is the predecessor to later experiments in 3D and motion. Looking at it now is a reminder that the work got more ambitious, and that shipping the simple version is how you get there.",
    ],
    tags: ["web"],
    featured: false,
    stack: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/swapagrawal14/Swapnil-Agrawal-portfolio",
    live: "https://swapnil-agrawal-portfolio.vercel.app",
    cover: "grid",
  },
  {
    slug: "3d-portfolio",
    title: "3D Portfolio",
    tagline: "A spatial take on the same story.",
    summary:
      "A Three.js-leaning 3D portfolio: the practice, presented as a space you move through rather than a page you scroll.",
    story: [
      "After a flat site, the obvious next question is: what if the portfolio were a place?",
      "The 3D portfolio is an experiment in that direction — a spatial presentation of the same practice, built while learning Three.js and the discipline of real-time scenes on the public web.",
      "It still stands as a live study in how far a personal site can lean into atmosphere without losing the work.",
    ],
    tags: ["3d", "web"],
    featured: false,
    stack: ["Three.js", "React", "WebGL"],
    live: "https://swapnil-agrawal-3d-portfolio.lovable.app",
    cover: "planes",
  },
  {
    slug: "id-card-studio",
    title: "ID Card Layout Study",
    tagline: "A desktop-first card composition experiment.",
    summary:
      "A front-end layout study that composes personal details into a downloadable ID-style card mockup. Built for testing alignment and export — desktop recommended.",
    story: [
      "This is a composition study, not a credential. It takes entered details and lays them out as an ID-style card so the typography, alignment, and export can be inspected.",
      "The interface is desktop-first because the download is a pixel-sensitive layout. It was published as a free testing tool for that layout problem, and it stays in the archive as a reminder that small graphic-design problems are still worth a dedicated UI.",
    ],
    tags: ["tools", "web"],
    featured: false,
    stack: ["HTML", "TypeScript", "CSS"],
    repo: "https://github.com/swapagrawal14/USA-driving-license-or-ID-maker",
    live: "https://usa-driving-license-or-id-maker.vercel.app",
    cover: "badge",
  },
];

export const projects: Project[] = [...featuredProjects, ...archiveProjects].map((p, i) => ({
  ...p,
  number: String(i + 1).padStart(2, "0"),
}));

export const filters: { id: "all" | ProjectTag; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "3d", label: "3D" },
  { id: "dental", label: "Dental" },
  { id: "web", label: "Web" },
  { id: "tools", label: "Tools" },
  { id: "games", label: "Games" },
];

export const stackGroups = [
  {
    title: "Interface",
    items: ["React", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "shadcn/ui"],
  },
  {
    title: "Space & motion",
    items: ["Three.js", "WebGL", "Canvas", "Motion graphics"],
  },
  {
    title: "Intelligence",
    items: ["Gemini", "Open-source LLMs", "Marble API", "Prompt systems", "ElevenLabs"],
  },
  {
    title: "Practice",
    items: ["Dentistry", "Documentary craft", "Product design", "Udaipur"],
  },
] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined };
  return {
    prev: projects[i === 0 ? projects.length - 1 : i - 1],
    next: projects[i === projects.length - 1 ? 0 : i + 1],
  };
}
