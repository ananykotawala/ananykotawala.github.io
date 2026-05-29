import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1280, height: 900 },
});

// Force light mode on mine for fair comparison.
await browser.newPage().then(async (p) => {
  await p.goto("http://localhost:3000");
  await p.evaluate(() => localStorage.setItem("theme", "light"));
  await p.close();
});

async function inspect(url, label, file) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));

  const info = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        fontFamily: cs.fontFamily.split(",")[0].replace(/['"]/g, ""),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        width: r.width,
        left: r.left,
      };
    };
    const wrap = document.querySelector("#page-wrap") || document.querySelector("body > div");
    const wrapR = wrap?.getBoundingClientRect();
    return {
      pageWrap: { width: wrapR?.width, left: wrapR?.left },
      h1: get("h1"),
      body: get("body"),
      h2: get("h2"),
    };
  });

  await page.screenshot({ path: file });
  console.log(`── ${label} ──`);
  console.log(JSON.stringify(info, null, 2));
  console.log("");
  await page.close();
}

await inspect("http://localhost:3000", "MINE", "/tmp/mine.png");
await inspect("https://theryanl.github.io/", "RYAN", "/tmp/ryan.png");

await browser.close();
