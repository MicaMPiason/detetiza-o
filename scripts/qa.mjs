import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import process from "node:process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const reviewDir = new URL("../.impeccable/review/", import.meta.url);
const browserProfile = fileURLToPath(new URL("../.impeccable/edge-qa-profile-sections/", import.meta.url));
const profiles = [
  { name: "wide", width: 1920, height: 1080, mobile: false, heroOnly: true },
  { name: "ultrawide", width: 2560, height: 1440, mobile: false, heroOnly: true },
  { name: "user-wide", width: 3822, height: 1918, mobile: false, heroOnly: true },
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "tablet", width: 800, height: 1000, mobile: false },
  { name: "mobile", width: 360, height: 800, mobile: true },
  { name: "mobile-short", width: 360, height: 640, mobile: true },
];

await mkdir(reviewDir, { recursive: true });

const browser = spawn(edgePath, [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--remote-debugging-port=9334",
  `--user-data-dir=${browserProfile}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

let browserError = "";
browser.stderr.on("data", (chunk) => { browserError += chunk.toString(); });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getDebuggerTarget() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const targets = await fetch("http://127.0.0.1:9334/json/list").then((response) => response.json());
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await wait(150);
  }
  browser.kill();
  throw new Error(`Não foi possível conectar ao Edge headless. ${browserError.slice(-500)}`);
}

const socketUrl = await getDebuggerTarget();
const socket = new WebSocket(socketUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let requestId = 0;
const pending = new Map();

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await send("Page.enable");
await send("Runtime.enable");

const results = [];

for (const profile of profiles) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    mobile: profile.mobile,
  });
  await send("Page.navigate", { url: new URL("../index.html", import.meta.url).href });
  await wait(700);

  await send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const targets = [...document.querySelectorAll('.reveal')];
      for (const target of targets) {
        target.scrollIntoView({ block: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 110));
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      document.activeElement?.blur();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await new Promise((resolve) => setTimeout(resolve, 200));
    })()`
  });

  const audit = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      viewport: [document.documentElement.clientWidth, window.innerHeight],
      scrollY: window.scrollY,
      scrollWidth: document.documentElement.scrollWidth,
      h1Count: document.querySelectorAll('h1').length,
      menuVisible: getComputedStyle(document.querySelector('[data-menu-toggle]')).display !== 'none',
      menuExpanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
      whatsappLinks: [...document.querySelectorAll('[data-whatsapp]')].map((a) => a.href),
      phoneLinks: [...document.querySelectorAll('[data-phone]')].map((a) => a.href),
      sections: [...document.querySelectorAll('main > section')].map((section) => section.id)
      ,hiddenReveals: document.querySelectorAll('.reveal:not(.is-visible)').length,
      hiddenRevealDetails: [...document.querySelectorAll('.reveal:not(.is-visible)')].map((element) => element.className)
      ,brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter((a) => a.hash && !document.getElementById(a.hash.slice(1))).map((a) => a.hash),
      overflowingElements: [...document.querySelectorAll('main *, .header-inner *')].filter((element) => { const r = element.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > document.documentElement.clientWidth + 1); }).map((element) => element.className || element.tagName),
      faqCount: document.querySelectorAll('.faq-list details').length
      ,hero: (() => {
        const copy = document.querySelector('.hero-copy');
        const heading = document.querySelector('.hero-copy h1');
        const button = document.querySelector('.hero-copy .button');
        const proof = document.querySelector('.hero-proof');
        const style = getComputedStyle(copy);
        const r = copy.getBoundingClientRect();
        return { contentWidth: r.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), headingHeight: heading.getBoundingClientRect().height, buttonInsideViewport: button.getBoundingClientRect().bottom <= innerHeight, proofDoesNotOverlap: button.getBoundingClientRect().bottom <= proof.getBoundingClientRect().top };
      })()
    }))()`
  });

  if (audit.exceptionDetails) throw new Error(JSON.stringify(audit.exceptionDetails));

  const heroCapture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(new URL(`${profile.name}-hero.png`, reviewDir), Buffer.from(heroCapture.data, 'base64'));
  if (profile.heroOnly) {
    results.push({ profile: profile.name, ...audit.result.value });
    continue;
  }

  const metrics = await send("Page.getLayoutMetrics");
  const { width, height } = metrics.cssContentSize;
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  await writeFile(new URL(`${profile.name}.png`, reviewDir), Buffer.from(screenshot.data, "base64"));

  for (const id of ['sinais', 'como-solicitar', 'duvidas']) {
    const region = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => { const r = document.getElementById('${id}').getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: document.documentElement.clientWidth, height: r.height, scale: 1 }; })()`
    });
    const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: region.result.value });
    await writeFile(new URL(`${profile.name}-${id}.png`, reviewDir), Buffer.from(capture.data, 'base64'));
  }

  const interactions = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const faqs = [...document.querySelectorAll('.faq-list details')];
      const faqToggleWorks = faqs.every((detail) => { const wasOpen = detail.open; detail.querySelector('summary').click(); const toggled = detail.open !== wasOpen; detail.querySelector('summary').click(); return toggled && detail.open === wasOpen; });
      let menuLinkWorks = null;
      if (getComputedStyle(document.querySelector('[data-menu-toggle]')).display !== 'none') {
        document.querySelector('[data-menu-toggle]').click();
        const opened = document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'true';
        document.querySelector('nav a[href="#duvidas"]').click();
        menuLinkWorks = opened && document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'false' && !document.body.classList.contains('menu-open') && location.hash === '#duvidas';
      }
      document.querySelector('.faq-list summary').focus();
      return { faqToggleWorks, menuLinkWorks };
    })()`
  });
  const keyboardBefore = await send('Runtime.evaluate', { returnByValue: true, expression: 'document.querySelector(".faq-list details").open' });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  const keyboardAfter = await send('Runtime.evaluate', { returnByValue: true, expression: 'document.querySelector(".faq-list details").open' });
  results.push({ profile: profile.name, pageSize: [width, height], ...audit.result.value, ...interactions.result.value, faqKeyboardWorks: keyboardBefore.result.value !== keyboardAfter.result.value });
}

console.log(JSON.stringify(results, null, 2));
socket.close();
browser.kill();
process.exit(0);
