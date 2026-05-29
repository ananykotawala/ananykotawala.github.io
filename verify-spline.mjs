import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
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
page.on("requestfailed", (req) => {
  const url = req.url();
  // Spline scenes are external; ignore CDN failures from the Spline domain itself.
  if (url.includes("prod.spline.design")) return;
  errors.push(`REQFAIL: ${url} ${req.failure()?.errorText ?? ""}`);
});

console.log("nav → http://localhost:3000");
await page.goto("http://localhost:3000", {
  waitUntil: "networkidle2",
  timeout: 30000,
});

// Headline + body text rendered?
const text = await page.evaluate(() => document.body.innerText);
const hasHeadline = text.includes("Interactive 3D");
const hasBody = text.includes("Bring your UI to life");
console.log("headline →", hasHeadline ? "OK" : "MISSING");
console.log("body →", hasBody ? "OK" : "MISSING");

// Spotlight svg present?
const hasSpotlight = await page.evaluate(
  () => !!document.querySelector("svg.animate-spotlight, svg[class*='spotlight']"),
);
console.log("spotlight →", hasSpotlight ? "OK" : "MISSING");

// Card present?
const card = await page.evaluate(() => {
  const c = document.querySelector("[class*='rounded-xl']");
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { width: r.width, height: r.height };
});
console.log("card →", JSON.stringify(card));

await page.screenshot({ path: "/tmp/spline-load.png" });
console.log("shot → /tmp/spline-load.png (initial)");

// Wait a bit for Spline to attempt to load
await new Promise((r) => setTimeout(r, 6000));

const hasCanvas = await page.evaluate(() => !!document.querySelector("canvas"));
console.log("canvas →", hasCanvas ? "OK (Spline mounted)" : "MISSING (still in fallback or failed)");

await page.screenshot({ path: "/tmp/spline-after.png" });
console.log("shot → /tmp/spline-after.png (after Spline load attempt)");

console.log("errors:", errors.length);
errors.forEach((e) => console.log("  ✗", e));
console.log("warnings:", warnings.length);
warnings.slice(0, 5).forEach((w) => console.log("  !", w));

await browser.close();
process.exit(errors.length > 0 ? 1 : 0);
