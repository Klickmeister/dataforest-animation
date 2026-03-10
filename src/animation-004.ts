import { createTimeline, spring, svg, utils, type DrawableSVGGeometry } from "animejs";

const CANVAS_SELECTOR = '[data-js-canvas="animation-004"]';
const elementSelector = (selector: string) => {
  return `${CANVAS_SELECTOR} [data-js-anim-el='${selector}']`;
};

if (document.querySelector(CANVAS_SELECTOR) === null) {
  // don't run animation if canvas is not present
  throw new Error("Animation canvas not found");
}

const vineSelectors: string[] = [
  elementSelector("vine-1"),
  elementSelector("vine-2"),
  elementSelector("vine-3"),
  elementSelector("vine-4"),
  elementSelector("vine-5"),
  elementSelector("vine-6"),
  elementSelector("vine-7"),
  elementSelector("vine-8"),
  elementSelector("vine-9"),
  elementSelector("vine-10"),
  elementSelector("vine-11"),
  elementSelector("vine-12"),
  elementSelector("vine-13"),
];

const vineSelectorsDrawable: DrawableSVGGeometry[][] = [];
const vineLightStreamSelectors: string[] = [];

const vinePointSelectors: string[] = [
  elementSelector("vine-point-1"),
  elementSelector("vine-point-2"),
  elementSelector("vine-point-3"),
  elementSelector("vine-point-4"),
  elementSelector("vine-point-5"),
  elementSelector("vine-point-6"),
  elementSelector("vine-point-7"),
  elementSelector("vine-point-8"),
  elementSelector("vine-point-9"),
  elementSelector("vine-point-10"),
];

const VINE_LIGHT_LENGTH = 28;

function resetSprites() {
  utils.set([ // first frame setup
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
  ], {
    opacity: 1,
    scale: 1,
  });
  utils.set([ // everything else
    elementSelector("left-bracket-1"),
    elementSelector("right-bracket-1"),
    elementSelector("left-bracket-2"),
    elementSelector("right-bracket-2"),
    elementSelector("center-tree-trunk"),
    elementSelector("center-tree-bottom"),
    elementSelector("center-tree-mid"),
    elementSelector("center-tree-top"),
    elementSelector("logo"),
    ...vinePointSelectors,
    ...vineSelectors,
    elementSelector("background-dots") + " path",
  ], {
    opacity: 0,
    scale: 1,
  });

  // duplicate vines (if not already present)
  vineSelectors.forEach((selector) => {
    const element = document.querySelector(selector);

    // Regex for adding a "-clone" suffix at the end of the elementSelector
    const suffix = "-clone";

    const cloneSelector = selector.replace(
      /\[data-js-anim-el=['"]?([^'"[\]]+?)['"]?\]/,
      `[data-js-anim-el='$1${suffix}']`,
    );
    const cloneDataAttr = cloneSelector.match(
      /\[data-js-anim-el=['"]?([^'"[\]]+?)['"]?\]/,
    )?.[1];

    if (element && document.querySelector(cloneSelector) === null) {
      const clone = element.cloneNode(true) as SVGPathElement;
      clone.dataset.jsAnimEl = `${cloneDataAttr}`;
      clone.classList.add("dataforest-animation-api__vine--light-stream");
      element.parentNode?.appendChild(clone);
      vineLightStreamSelectors.push(cloneSelector);
    }
  });

  utils.set( // set up vines for draw animation
    vineLightStreamSelectors,
    {
      strokeDasharray: (target, _i, _l) => {
        const length = (target as SVGPathElement).getTotalLength();
        return `${VINE_LIGHT_LENGTH} ${length}`;
      },
      strokeDashoffset: 0,
      opacity: 0,
      // strokeLinecap: "round",
    },
  );

  vineSelectors.forEach((selector) => {
    vineSelectorsDrawable.push(svg.createDrawable(selector));
  });

}
resetSprites();

const easeSpring = spring({
  bounce: 0.34,
  duration: 400,
});

const randomSeed = utils.random(0, 1_000_000);

const mainTimeline = createTimeline({
  autoplay: true,
  loop: true,
});

mainTimeline
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
    elementSelector("center-tree-trunk"),
    elementSelector("center-tree-bottom"),
    elementSelector("center-tree-mid"),
    elementSelector("center-tree-top"),
  ], { // show brackets
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    ease: "outBack",
  })
  /**
   * Tree grow animation
   */
  .label("trees-start")
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
  ], { // morph to bigger brackets
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? elementSelector("left-bracket-2")
          : elementSelector("right-bracket-2"),
      )?.getAttribute("d") ?? "",
    ease: easeSpring,
  })
  .label("trees-end")
  /**
   * API formation animation
   */
  .label("api-start")
  .add([
    elementSelector("background-dots") + " path",
  ], {
    opacity: [0, 1],
    duration: 250,
    delay: () => utils.random(0, 500, 50),
    ease: "outQuad",
  }, '<<')
  .add(vineSelectorsDrawable, {
    draw: ["0 0", "0 1"],
    opacity: [1],
    duration: 600,
    delay: () => utils.random(0, 500, 100),
    easing: "inOutSine",
  }, "-=200")
  .add([
    ...vinePointSelectors,
  ], {
    opacity: [0, 1],
    duration: 800,
    easing: "easeInOutSine",
  }, "<<")
  .add(vineLightStreamSelectors, {
    opacity: [0, 1],
    duration: 250,
    delay: utils.createSeededRandom(randomSeed, 0, 2_000),
    ease: "outQuad",
  }, "-=400")
  .add(vineLightStreamSelectors, {
    strokeDashoffset: (target, i, _l) => {
      const length = (target as SVGPathElement).getTotalLength();

      // odd vines go left, even vines go right
      if (i % 2 === 0) {
        return [length + VINE_LIGHT_LENGTH, VINE_LIGHT_LENGTH];
      }

      return [-length - VINE_LIGHT_LENGTH, VINE_LIGHT_LENGTH];
    },
    duration: 2000,
    delay: utils.createSeededRandom(randomSeed, 0, 2_000),
    ease: "linear",
  }, "<<-=10")
  .add([
    ...vinePointSelectors,
    ...vineLightStreamSelectors,
    elementSelector("background-dots") + " path",
  ], {
    opacity: 0,
    duration: 250,
    delay: () => utils.random(0, 500, 50),
    ease: "inQuad",
  })
  .add(vineSelectorsDrawable, {
    draw: ["0 1", "0 0"],
    duration: 400,
    delay: () => utils.random(0, 500, 50),
    easing: "inOutSine",
  }, "<<")
  .label("api-end")
  /**
   * Logo formation animation
   */
  .label("logo-start")
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
  ], { // morph to smaller brackets
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? elementSelector("left-bracket-1")
          : elementSelector("right-bracket-1"),
      )?.getAttribute("d") ?? "",
    x: 0,
    duration: 600,
    ease: "inOutQuad",
  })
  .add([
    elementSelector("left-tree-trunk"),
    elementSelector("left-tree-bottom"),
    elementSelector("left-tree-top"),
    elementSelector("right-tree-trunk"),
    elementSelector("right-tree-top"),
  ], {
    opacity: 0,
    duration: 400,
    ease: "inOutQuad",
  }, "<<")
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
    elementSelector("center-tree-trunk"),
    elementSelector("center-tree-bottom"),
    elementSelector("center-tree-mid"),
    elementSelector("center-tree-top"),
  ], {
    translateX: { to: -86 },
    duration: 400,
    ease: "inOutQuad",
  })
  .add(elementSelector("logo"), { // show logo
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 300,
    ease: "outBack",
  }, "-=200")
  .label("end-sequence-start")
  .add(CANVAS_SELECTOR + " path", { // fade out everything
    opacity: 0,
    duration: 600,
    ease: "inQuad",
  }, "+=2000")
  .label("end-sequence-end")
  .add({}, {}, "+=2000") // pause before loop
;

// mainTimeline.seek(2280)

window.__CAPTURE__ = {
  duration: mainTimeline.duration,
  seek: (ms) => mainTimeline.seek(ms),
  pause: () => mainTimeline.pause(),
};
