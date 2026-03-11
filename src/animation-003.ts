import { createTimeline, spring, svg, utils, type DrawableSVGGeometry } from "animejs";

const CANVAS_SELECTOR = '[data-js-canvas="animation-003"]';
const elementSelector = (selector: string) => {
  return `${CANVAS_SELECTOR} [data-js-anim-el='${selector}']`;
};

if (document.querySelector(CANVAS_SELECTOR) === null) {
  // don't run animation if canvas is not present
  throw new Error("Animation canvas not found");
}

// Cache drawable vine selectors for animation
const vineSelectorsDrawable: DrawableSVGGeometry[][] = [];

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
    elementSelector("vine-points") + " path",
    elementSelector("vines") + " path",
    elementSelector("background-dots") + " path",
  ], {
    opacity: 0,
    scale: 1,
  });

  // duplicate vines (if not already present)
  const vinesLightStreamGroup = utils.$(elementSelector("vines-light-stream"))?.[0];
  vinesLightStreamGroup?.replaceChildren(); // clear previous clones
  utils.$(elementSelector("vines") + " path").forEach((target) => {

    const clone = target.cloneNode(true) as SVGPathElement;
    clone.classList.add("dataforest-animation-api__vine--light-stream");
    
    vinesLightStreamGroup?.appendChild(clone); // clone vine into light stream group
  });

  utils.set( // set up vines for draw animation
    elementSelector("vines-light-stream") + " path",
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

  utils.$(elementSelector("vines") + " path").forEach((selector) => {
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
  loop: false,
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
  .add([
    elementSelector("center-tree-trunk"),
    elementSelector("center-tree-bottom"),
    elementSelector("center-tree-mid"),
    elementSelector("center-tree-top"),
  ], {
    translateY: 5,
    duration: 200,
    ease: 'inOutSine',
  }, "<<")
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
  }, '<<-=100')
  .add(vineSelectorsDrawable, {
    draw: ["0 0", "0 1"],
    opacity: [1],
    duration: 600,
    delay: () => utils.random(0, 500, 100),
    easing: "inOutSine",
  }, "-=200")
  .add([
    elementSelector("vine-points") + " path",
  ], {
    opacity: [0, 1],
    duration: 800,
    easing: "easeInOutSine",
  }, "<<")
  .add(elementSelector('vines-light-stream') + " path", {
    opacity: [0, 1],
    duration: 250,
    delay: utils.createSeededRandom(randomSeed, 0, 2_000),
    ease: "outQuad",
  }, "-=400")
  .add(elementSelector('vines-light-stream') + " path", {
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
    elementSelector("vine-points") + " path",
    elementSelector('vines-light-stream') + " path",
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
    elementSelector("center-tree-trunk"),
    elementSelector("center-tree-bottom"),
    elementSelector("center-tree-mid"),
    elementSelector("center-tree-top"),
  ], {
    translateY: 0,
    duration: 200,
  }, "<<-=400")
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
  }, "-=300")
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

window.__CAPTURE__ = {
  duration: mainTimeline.duration,
  seek: (ms) => mainTimeline.seek(ms),
  pause: () => mainTimeline.pause(),
};
