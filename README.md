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
