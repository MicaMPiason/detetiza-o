import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import process from "node:process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const reviewDir = new URL("../.impeccable/review/", import.meta.url);
const browserProfile = fileURLToPath(new URL("../.impeccable/edge-qa-profile/", import.meta.url));
const profiles = [
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "mobile", width: 360, height: 800, mobile: true },
  { name: "mobile-short", width: 360, height: 640, mobile: true },
];

await mkdir(reviewDir, { recursive: true });

const browser = spawn(edgePath, [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--remote-debugging-port=9333",
  `--user-data-dir=${browserProfile}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

let browserError = "";
browser.stderr.on("data", (chunk) => { browserError += chunk.toString(); });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getDebuggerTarget() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const targets = await fetch("http://127.0.0.1:9333/json/list").then((response) => response.json());
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await wait(150);
  }
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
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await wait(700);

  await send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `(async () => {
      const targets = [...document.querySelectorAll('.reveal')];
      for (const target of targets) {
        target.scrollIntoView({ block: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 110));
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 520));
    })()`
  });

  const audit = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      viewport: [document.documentElement.clientWidth, window.innerHeight],
      scrollWidth: document.documentElement.scrollWidth,
      h1Count: document.querySelectorAll('h1').length,
      menuVisible: getComputedStyle(document.querySelector('[data-menu-toggle]')).display !== 'none',
      menuExpanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
      whatsappLinks: [...document.querySelectorAll('[data-whatsapp]')].map((a) => a.href),
      phoneLinks: [...document.querySelectorAll('[data-phone]')].map((a) => a.href),
      sections: [...document.querySelectorAll('main > section')].map((section) => section.id)
      ,hiddenReveals: document.querySelectorAll('.reveal:not(.is-visible)').length,
      hiddenRevealDetails: [...document.querySelectorAll('.reveal:not(.is-visible)')].map((element) => element.className)
    }))()`
  });

  const metrics = await send("Page.getLayoutMetrics");
  const { width, height } = metrics.cssContentSize;
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  await writeFile(new URL(`${profile.name}.png`, reviewDir), Buffer.from(screenshot.data, "base64"));
  results.push({ profile: profile.name, pageSize: [width, height], ...audit.result.value });
}

console.log(JSON.stringify(results, null, 2));
socket.close();
browser.kill();
process.exit(0);
