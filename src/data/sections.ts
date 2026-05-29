export type SectionId =
  | "technologies"
  | "about"
  | "cv"
  | "cards"
  | "contact"
  | "projects"
  | "under-the-hood";

export type CvEntry = {
  year: string;
  company: string;
  role: string;
  highlights: string[];
};

export type ProjectEntry = {
  name: string;
  url?: string;
  description: string;
  stack: string[];
};

export type Tech = {
  name: string;
  description: string;
};

export type Card = {
  title: string;
  body: string;
};

export type Section = {
  id: SectionId;
  label: string;
  buildingColor: string;
  buildingRoofColor: string;
};

export const SECTIONS: Section[] = [
  { id: "technologies", label: "Technologies", buildingColor: "#dd6b3a", buildingRoofColor: "#8b3a1f" },
  { id: "about", label: "About Me", buildingColor: "#5a8bbf", buildingRoofColor: "#2f4f73" },
  { id: "cv", label: "Curriculum Vitae", buildingColor: "#c7a44a", buildingRoofColor: "#6b5520" },
  { id: "cards", label: "Collectible Cards", buildingColor: "#9b5cb0", buildingRoofColor: "#4f2960" },
  { id: "projects", label: "Projects", buildingColor: "#4a9d6e", buildingRoofColor: "#1f5238" },
  { id: "contact", label: "Contact", buildingColor: "#c44545", buildingRoofColor: "#6b1f1f" },
  { id: "under-the-hood", label: "Under the Hood", buildingColor: "#6b6b6b", buildingRoofColor: "#2f2f2f" },
];

export const TECHNOLOGIES: Tech[] = [
  { name: "Angular", description: "TypeScript JavaScript framework for building SPA applications." },
  { name: "Node.js", description: "Favorite backend runtime — non-blocking, async, runs anywhere." },
  { name: "Express.js", description: "Minimalist framework for Node.js." },
  { name: "JavaScript", description: "The most flexible language. Runs on the server, in the browser, on canvas, everywhere." },
  { name: "Phaser.js", description: "HTML5 game framework powering the canvas you're walking on right now." },
  { name: "MongoDB", description: "Document database for fast iteration." },
  { name: "Tailwind CSS", description: "Utility-first CSS — composes well with component systems." },
  { name: "Playwright / Puppeteer", description: "End-to-end browser automation for testing." },
];

export const ABOUT = {
  headline: "Bridging the Gap Between Design and Code",
  location: "Bratislava, Slovakia",
  experience: "19+ years",
  body: [
    "Full-stack developer who started in graphic design and UI/UX, then grew into front-end and backend engineering.",
    "Specialty: building Single Page Applications (SPAs) in Angular — especially those requiring complex animations and fluid interactivity.",
    "Comfortable across the stack: from Photoshop and Tiled map authoring to Node.js backends and Mongo schemas.",
  ],
};

export const CV: CvEntry[] = [
  {
    year: "2007",
    company: "GAMO",
    role: "IBM Lotus Notes developer, webdesigner",
    highlights: ["BBSK Portal", "IRRR (Institute for Gender Equality)", "SLEK (pharmacists)", "KVLSR (veterinary)", "CRSZ (animal registry)"],
  },
  {
    year: "2010",
    company: "SCR",
    role: "Front-end and PHP developer",
    highlights: ["TA3 portal", "Radio Express", "SWAN", "Energio", "Gas Familia", "Flatbook", "Brand work: O2, Sony, Pelikan, Heineken"],
  },
  {
    year: "2012",
    company: "Kremsa Digital",
    role: "MEAN stack, Angular, PHP/WordPress developer",
    highlights: ["Pioneer Projects CRM", "SMBee social dashboard", "Brand work: Legrand, Slovakia Chips, HB Reavis"],
  },
  {
    year: "2018",
    company: "Bethereum",
    role: "Angular & front-end developer",
    highlights: ["Probably the most complex Angular project I've shipped."],
  },
  {
    year: "2020",
    company: "VÚB Bank",
    role: "Angular & front-end developer (current)",
    highlights: ["Digitizing internal processes within the bank."],
  },
];

export const CARDS: Card[] = [
  {
    title: "100% Vibe Coding",
    body: "An experiment in human–AI collaboration: testing the limits of AI in complex product development.",
  },
  {
    title: "Automatic Testing",
    body: "Midnight, Playwright, Puppeteer for E2E. Mocha and Chai for API tests. Tests are how a fast-moving codebase stays trustworthy.",
  },
  {
    title: "Canvas to Node.js",
    body: "JavaScript's versatility shines across backend, frontend, and visual solutions — the same language all the way down.",
  },
  {
    title: "Deprecated Technologies",
    body: "Started on IBM Lotus Notes (yes, really). Glad to be on a JavaScript-exclusive diet now.",
  },
  {
    title: "AI as Colleague",
    body: "AI is a powerful generator; the developer is the filter. The value is in knowing which code not to write.",
  },
  {
    title: "Not a Game Developer",
    body: "Despite the canvas you're walking on, my focus is large, long-term projects that demand clean architecture.",
  },
];

export const PROJECTS: ProjectEntry[] = [
  {
    name: "eUTxO.org",
    url: "https://eutxo.org",
    description: "Visual Blockchain Explorer for Cardano.",
    stack: ["Serverless Node.js", "Google Firestore", "BlockFrost API", "PhaserJS", "Tailwind CSS"],
  },
  {
    name: "Angular.sk",
    url: "https://angular.sk",
    description: "Free online course for Angular 2+.",
    stack: ["Angular", "Markdown", "Static export"],
  },
  {
    name: "Portfolio v1",
    url: "https://old.peteroravec.com",
    description: "Pixel-art portfolio built entirely without AI.",
    stack: ["Angular", "PhaserJS", "Tiled editor"],
  },
];

export const CONTACT = {
  email: "p.oravec@gmail.com",
  linkedin: "https://www.linkedin.com/in/peteroravec/",
  note: "Open to interesting Angular / front-end work. Best reached over email or LinkedIn.",
};

export const UNDER_THE_HOOD = [
  {
    title: "Architecture",
    body: "Next.js + React shell wraps a Phaser scene running in WebGL. The shell handles routing, modals, and DOM; Phaser owns the canvas. The two layers talk through a small event bus.",
  },
  {
    title: "Procedural Pixel Art",
    body: "Every tile and sprite you see is drawn at runtime with Phaser's Graphics API and rasterized to a texture — no PNGs, no Tiled editor. The whole world ships in ~30KB of JS.",
  },
  {
    title: "Interaction Zones",
    body: "Each building has an invisible trigger zone in front of its door. When the player overlaps with it, an on-screen hint appears: press E to enter.",
  },
  {
    title: "Pause-on-Modal",
    body: "Opening a section pauses Phaser's input so WASD doesn't leak through the modal. Closing the modal resumes input on the next frame.",
  },
];
