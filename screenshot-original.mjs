import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
page.on("console", (m) => console.log("[browser]", m.type(), m.text()));

await page.goto("https://peteroravec.com/", {
  waitUntil: "networkidle0",
  timeout: 60000,
});

// The site has a preloader. Wait for the canvas + give the game some seconds.
await page.waitForSelector("canvas", { timeout: 30000 });
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: "/tmp/peter-1.png" });
console.log("shot → /tmp/peter-1.png");

// Try to drive the player a bit so we see different parts of the map.
await page.focus("canvas");
for (let i = 0; i < 4; i++) {
  await page.keyboard.down("d");
  await new Promise((r) => setTimeout(r, 1500));
  await page.keyboard.up("d");
  await page.screenshot({ path: `/tmp/peter-walk-${i}.png` });
  console.log(`shot → /tmp/peter-walk-${i}.png`);
}

await browser.close();
