# Dataforest Animate

This repository contains animation sequences for Dataforest's animations, created using a custom animation framework built on top of TypeScript. The animations are designed to be modular and reusable, allowing for easy integration into various projects.

## Getting Started

Install the necessary dependencies by running:

```bash
npm install
```

Run the development server with:

```bash
npm run dev
```

Build the project for production with:

```bash
npm run build
```

## Use Animation in Your Project

The following parts are required to use the animation in your project:

1. **SVG Markup**: Include the SVG markup in your HTML file. You can find the SVG files in the `index.html` with each `[data-js-canvas]` Element.
2. **Animate Library**: Ensure that the Animate library `animejs` is included in your project
3. **Animation Script**: Import the animation script into your project. The scripts are located in the `src` directory (e.g., `animation-001.ts`, `animation-002.ts`).
4. **Styles**: Include the styles from `styles/_animate.css` to ensure proper rendering of the animations.

## Export Animation as MP4

You can export the animations as MP4 videos using the following command:

```bash
npm run dev
npm run export:mp4
```

or

```bash
npm run dev
npm run export:mp4:4k
```

### Requirements

This script uses Puppeteer to capture frames of the animation (from [export-canvas.html](http://localhost:5173/dataforest-animation/export-canvas.html)) and FFmpeg to compile them into an MP4 file. Make sure you have FFmpeg installed on your system via e.g.

```bash
brew install ffmpeg
```

To update the animation FPS, width, and height, you can set the following environment variables before running the export command:

- `FPS`: Frames per second (default: 24)
- `WIDTH`: Width of the output video in pixels (default: 1080)
- `HEIGHT`: Height of the output video in pixels (default: 1920)
- `CRF`: Constant Rate Factor for video quality (default: 18)

To change to animation you have to update the `export-canvas.html` file in the `/` folder and the `export-canvas.ts` file in the `src/` folder.