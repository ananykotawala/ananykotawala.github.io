import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1280, height: 800 },
});

const page = await browser.newPage();

const errors = [];
const warnings = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
  if (msg.type() === "warning") warnings.push(msg.text());
});
page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message));
page.on("requestfailed", (req) =>
  errors.push(`REQFAIL: ${req.url()} ${req.failure()?.errorText ?? ""}`)
);

console.log("nav →", "http://localhost:3000");
await page.goto("http://localhost:3000", {
  waitUntil: "networkidle0",
  timeout: 30000,
});

// Wait for the Phaser canvas to appear inside the container.
await page.waitForSelector("canvas", { timeout: 15000 });

// Give Phaser a beat to render its first frame.
await new Promise((r) => setTimeout(r, 1500));

// Check the canvas is non-zero size.
const canvasInfo = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { width: r.width, height: r.height };
});
console.log("canvas →", JSON.stringify(canvasInfo));

// Brand chip rendered?
const chip = await page.evaluate(() => {
  return Array.from(document.querySelectorAll("div"))
    .map((d) => d.textContent || "")
    .find((t) => t.includes("peter oravec"));
});
console.log("chip →", chip ? "OK" : "MISSING");

await page.screenshot({ path: "/tmp/world-load.png", fullPage: false });
console.log("shot → /tmp/world-load.png");

await page.focus("canvas");
const spawnPos = await page.evaluate(() => {
  const s = (window).__scene;
  return s?.player ? { x: s.player.x, y: s.player.y } : null;
});
console.log("spawn →", JSON.stringify(spawnPos));

// Walk east in a loop, checking every 300ms whether we entered a zone.
let opened = false;
for (let step = 0; step < 14 && !opened; step++) {
  await page.keyboard.down("d");
  await new Promise((r) => setTimeout(r, 300));
  await page.keyboard.up("d");
  await new Promise((r) => setTimeout(r, 50));
  const state = await page.evaluate(() => {
    const s = (window).__scene;
    return s?.player
      ? { x: s.player.x, y: s.player.y, zone: s.activeZone }
      : null;
  });
  console.log(`step ${step} →`, JSON.stringify(state));
  if (state?.zone) {
    await page.keyboard.press("e");
    await new Promise((r) => setTimeout(r, 500));
    opened = true;
    break;
  }
}
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: "/tmp/world-after-walk.png" });
console.log("shot → /tmp/world-after-walk.png (after walking)");

// Press E — modal should open if we're on a zone.
await page.keyboard.press("e");
await new Promise((r) => setTimeout(r, 700));
const modalState = await page.evaluate(() => {
  const m = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]');
  if (!m) return { open: false };
  const titleEl = m.querySelector("span");
  return { open: true, title: titleEl?.textContent || "" };
});
console.log("modal-after-E →", JSON.stringify(modalState));
await page.screenshot({ path: "/tmp/world-after-e.png" });
console.log("shot → /tmp/world-after-e.png");

if (modalState.open) {
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 400));
  const stillOpen = await page.evaluate(() =>
    !!document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]')
  );
  console.log("modal-after-Esc →", stillOpen ? "STILL OPEN (bug)" : "closed ✓");
}

console.log("errors:", errors.length);
errors.forEach((e) => console.log("  ✗", e));
console.log("warnings:", warnings.length);

await browser.close();
process.exit(errors.length > 0 ? 1 : 0);
