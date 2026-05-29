import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

// Find the buttons
const buttons = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  return btns.map(b => {
    const r = b.getBoundingClientRect();
    return {
      text: b.textContent?.trim(),
      visible: r.width > 0 && r.height > 0 && r.top < 900,
      width: Math.round(r.width),
      height: Math.round(r.height),
      top: Math.round(r.top),
    };
  });
});
console.log("buttons found:", buttons.length);
buttons.forEach(b => console.log("  -", JSON.stringify(b)));

await page.screenshot({ path: "/tmp/hero-view.png", clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log("shot → /tmp/hero-view.png");

console.log("errors:", errors.length);
errors.forEach(e => console.log("  ✗", e));
await browser.close();
