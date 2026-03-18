import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";

import { chromium } from "playwright";

const distDir = path.resolve(process.cwd(), "dist");
const port = 4173;
const host = "127.0.0.1";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".txt", "text/plain; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

const resolvePath = (requestPath: string) => {
  const normalized = decodeURIComponent(requestPath.split("?")[0] ?? "/");
  const relativePath = normalized === "/" ? "index.html" : normalized.replace(/^\/+/, "");
  return path.join(distDir, relativePath);
};

const sendNotFound = (response: ServerResponse) => {
  response.statusCode = 404;
  response.end("Not found");
};

const handleRequest = async (request: IncomingMessage, response: ServerResponse) => {
  const requestPath = request.url ?? "/";
  let filePath = resolvePath(requestPath);

  try {
    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    if (!path.extname(filePath)) {
      filePath = path.join(distDir, "index.html");
    }
  }

  try {
    await access(filePath);
  } catch {
    sendNotFound(response);
    return;
  }

  response.setHeader("Content-Type", contentTypes.get(path.extname(filePath)) ?? "application/octet-stream");
  createReadStream(filePath).pipe(response);
};

const main = async () => {
  await access(path.join(distDir, "index.html"));

  const server = createServer((request, response) => {
    void handleRequest(request, response);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  try {
    const response = await page.goto(`http://${host}:${port}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000
    });

    assert.ok(response?.ok(), "desktop smoke test failed to load the exported app");
    await page.waitForFunction(() => document.body.innerText.includes("PANCHANGA"), {
      timeout: 60_000
    });
    assert.equal(pageErrors.length, 0, `unexpected page errors:\n${pageErrors.join("\n")}`);
    assert.equal(consoleErrors.length, 0, `unexpected console errors:\n${consoleErrors.join("\n")}`);

    const bodyText = await page.locator("body").innerText();
    assert.ok(bodyText.includes("PANCHANGA"), "expected app shell content to render");
  } finally {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  console.log("Desktop smoke test passed.");
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
