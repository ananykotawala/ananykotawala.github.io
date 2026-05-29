import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

const info = await page.evaluate(() => {
  const link = document.querySelector("a.cardioid-link");
  if (!link) return null;
  const r = link.getBoundingClientRect();
  return {
    href: link.href,
    width: Math.round(r.width),
    height: Math.round(r.height),
    absoluteTop: Math.round(r.top + window.scrollY),
    pageHeight: document.body.scrollHeight,
  };
});
console.log("cardioid →", JSON.stringify(info));

// Scroll so the cardioid sits in the middle of the viewport.
if (info) {
  await page.evaluate((t) => window.scrollTo(0, t - 250), info.absoluteTop);
  await new Promise((r) => setTimeout(r, 1500));
}

await page.screenshot({ path: "/tmp/bottom-view.png" });
console.log("shot → /tmp/bottom-view.png");

await browser.close();
