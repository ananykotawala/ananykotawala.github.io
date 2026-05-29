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
  await new Promise((r) => setTimeout(r, 600));

  const info = await page.evaluate(() => {
    const container = document.querySelector(".container");
    const pic = document.querySelector(".profile-pic, #profile-pic");
    const h1 = document.querySelector("h1");
    const containerRect = container?.getBoundingClientRect();
    const containerCS = container ? getComputedStyle(container) : null;
    const picRect = pic?.getBoundingClientRect();
    const picCS = pic ? getComputedStyle(pic) : null;
    const h1CS = h1 ? getComputedStyle(h1) : null;
    return {
      containerWidth: containerRect?.width,
      containerLeft: containerRect?.left,
      containerMaxWidth: containerCS?.maxWidth,
      picWidth: picRect?.width,
      picHeight: picRect?.height,
      picCSWidth: picCS?.width,
      h1FontFamily: h1CS?.fontFamily,
      h1FontSize: h1CS?.fontSize,
      h1FontWeight: h1CS?.fontWeight,
    };
  });

  console.log(`── ${label} ──`);
  console.log(JSON.stringify(info, null, 2));
  console.log("");
  await page.close();
}

await inspect("http://localhost:3000", "MINE");
await inspect("https://addisonwu05.github.io/", "ADDISON");

await browser.close();
