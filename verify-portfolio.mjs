import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1280, height: 1100 },
});

const page = await browser.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

async function check(path, screenshot) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 400));
  const text = await page.evaluate(() => document.body.innerText);
  await page.screenshot({ path: screenshot, fullPage: true });
  return text;
}

const home = await check("/", "/tmp/site-home.png");
console.log("HOME ──");
console.log("  name →", home.includes("Anany Kotawala") ? "OK" : "MISSING");
console.log("  hey →", home.includes("Hey!") ? "OK" : "MISSING");
console.log("  pubs →", home.includes("Publications") ? "OK" : "MISSING");

const pubs = await check("/publications", "/tmp/site-pubs.png");
console.log("PUBLICATIONS ──");
console.log("  nav home →", pubs.includes("Home") ? "OK" : "MISSING");
console.log("  pubs heading →", pubs.includes("Publications") ? "OK" : "MISSING");

const acad = await check("/academics", "/tmp/site-academics.png");
console.log("ACADEMICS ──");
console.log("  nav home →", acad.includes("Home") ? "OK" : "MISSING");
console.log("  honours →", acad.includes("Honours") ? "OK" : "MISSING");
console.log("  courses →", acad.includes("Courses") ? "OK" : "MISSING");

console.log("errors:", errors.length);
errors.forEach((e) => console.log("  ✗", e));
await browser.close();
process.exit(errors.length > 0 ? 1 : 0);
