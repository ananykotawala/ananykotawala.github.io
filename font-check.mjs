import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1280, height: 900 },
});

async function inspect(url, label) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 500));
  const info = await page.evaluate(() => {
    const get = (el, name) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      // Resolve which actual font family the browser is using.
      // The "first available" is at the top of fontFamily.
      return {
        name,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
      };
    };
    return [
      get(document.querySelector("h1"), "h1"),
      get(document.querySelector("p"), "p"),
      get(document.querySelector(".tt"), ".tt"),
      get(document.body, "body"),
    ];
  });
  console.log(`── ${label} (${url}) ──`);
  info.forEach((i) => console.log(JSON.stringify(i)));
  console.log("");
  await page.close();
}

await inspect("http://localhost:3000", "MINE");
await inspect("https://theryanl.github.io/", "RYAN");

await browser.close();
