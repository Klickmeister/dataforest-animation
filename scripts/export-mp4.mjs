import fs from "node:fs";
import { execSync } from "node:child_process";
import puppeteer from "puppeteer";
import { set } from "animejs";

const URL = process.env.CAPTURE_URL || "http://localhost:5173/dataforest-animation/export-canvas.html";
const outDir = "frames";
const outFile = "out.mp4";

const fps = Number(process.env.FPS || 24);
const width = Number(process.env.WIDTH || 1080);
const height = Number(process.env.HEIGHT || 1920);
const crf = Number(process.env.CRF || 18);

console.log("🎬 Starting video export...");
console.log(`📊 Settings: ${fps}fps, ${width}x${height}, CRF ${crf}`);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
console.log(`📁 Created ${outDir} directory`);

console.log("🌐 Launching browser...");
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width, height, deviceScaleFactor: 1 });
console.log("🔗 Navigating to URL...");
await page.goto(URL, { waitUntil: "networkidle0" });

// duration aus deiner Seite holen
const duration = await page.evaluate(() => window.__CAPTURE__?.duration);
if (!duration) {
  await browser.close();
  throw new Error("window.__CAPTURE__ not found");
}

// pause animation
console.log("⏸️ Pausing animation...");
await page.evaluate(() => {
  if (window.__CAPTURE__?.pause) window.__CAPTURE__.pause();
  if (window.__CAPTURE__?.seek) window.__CAPTURE__.seek(0);
});

const totalFrames = Math.ceil((duration / 1000) * fps);
console.log(`⏱️ Duration: ${duration}ms, Total frames: ${totalFrames}`);
console.log("📸 Capturing frames...");

for (let i = 0; i < totalFrames; i++) {
  const t = (i / fps) * 1000;

  await page.evaluate((ms) => {
    if (window.__CAPTURE__ && typeof window.__CAPTURE__.seek === 'function') {
      window.__CAPTURE__.seek(ms);

      setTimeout(() => {
        // nothing, just wait for the timeout to ensure rendering
      }, 0);
    } else {
      throw new Error("window.__CAPTURE__.seek is not defined or is not a function.");
    }
  }, t);


  const filename = `${outDir}/frame_${String(i).padStart(Math.ceil(Math.log10(totalFrames + 1)), "0")}.png`;
  await page.screenshot({ path: filename });
  if (i % 30 === 0) console.log(`  Frame ${i}/${totalFrames}`);
}

await browser.close();
console.log("✅ All frames captured");

// ffmpeg: frames -> mp4
console.log("🎥 Converting frames to MP4...");
execSync(
  [
    "ffmpeg",
    "-y",
    "-r", String(fps),
    "-i", `${outDir}/frame_%0${Math.ceil(Math.log10(totalFrames + 1))}d.png`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", String(crf),
    "-preset", "slow",
    "-movflags", "+faststart",
    outFile,
  ].join(" "),
  { stdio: "inherit" }
);

console.log(`✅ Wrote ${outFile}`);
