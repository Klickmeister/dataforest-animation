import { createTimeline, spring, svg, utils, type DrawableSVGGeometry } from "animejs";

const CANVAS_SELECTOR = '[data-js-canvas="animation-004"]';
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
  utils.set( // first frame setup
    elementSelector("left-bracket"),
  {
    opacity: 0,
    scale: 1,
    translateX: -10, // initial x offset
    translateY: 5, // initial y offset
  });
  utils.set(
    elementSelector("right-bracket"),
  {
    opacity: 0,
    scale: 1,
    translateX: 10, // initial x offset
    translateY: 5, // initial y offset
  });
  utils.set([
    elementSelector("left-bracket-1"),
    elementSelector("right-bracket-1"),
  ], {
    opacity: 0,
    scale: 1,
    translateY: 5, // initial y offset
  });
  utils.set([
    elementSelector("logo"),
    elementSelector("tree-trunk"),
    elementSelector("tree-bottom"),
    elementSelector("tree-mid"),
    elementSelector("tree-top"),
  ], {
    opacity: 0,
    scale: 1,
    translateY: 5, // initial y offset
  })
  utils.set([ // everything else
    elementSelector("left-bracket-2"),
    elementSelector("right-bracket-2"),
    elementSelector("vine-points") + " path",
    elementSelector("vines") + " path",
    elementSelector("background-dots") + " path",
    elementSelector("text-line-1"),
    elementSelector("text-line-2"),
    elementSelector("text-line-3"),
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
  duration: 600,
});

const randomSeed = utils.random(0, 1_000_000);

const mainTimeline = createTimeline({
  autoplay: true,
  loop: true,
});

mainTimeline
  .label("animation-start")
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
  ], { // show brackets
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    ease: "outBack",
  })
  /**
   * Connect Brackets Animation Start
   */
  .label("connect-brackets-start")
  .add(
    elementSelector("left-bracket"),
    {
      translateX: 13,
      duration: 150,
      ease: "inOutSine",
    }
  )
  .add(
    elementSelector("right-bracket"),
    {
      translateX: -13,
      duration: 150,
      ease: "inOutSine",
    }, "<<")
  .label("connect-brackets-end")
  .add({}, {}, "+=850")
  /**
   * Tree grow animation
   */
  .label("trees-start")
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
  ], { // morph to bigger brackets and reset x offset
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? elementSelector("left-bracket-2")
          : elementSelector("right-bracket-2"),
      )?.getAttribute("d") ?? "",
    translateX: 0,
    translateY: 0,
    ease: easeSpring,
  })
  .label("tree-grow-start")
  .add([
    elementSelector("tree-trunk"),
    elementSelector("tree-bottom"),
    elementSelector("tree-mid"),
    elementSelector("tree-top"),
  ], { // grow tree parts
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 500,
    delay: utils.stagger(150),
    ease: "outBack",
  }, "<<")
  .label("tree-grow-end")
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
    translateY: 5,
    duration: 600,
    ease: "inOutQuad",
  })
  .add([
    elementSelector("left-bracket"),
    elementSelector("right-bracket"),
    elementSelector("tree-trunk"),
    elementSelector("tree-bottom"),
    elementSelector("tree-mid"),
    elementSelector("tree-top"),
  ], {
    translateX: { to: -86 },
    duration: 400,
    ease: "inOutQuad",
  }, "-=300")
  .add(elementSelector("logo"), { // show logo
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 1500,
    ease: "outBack",
  }, "-=200")
  .add(CANVAS_SELECTOR + ' path', { // fade out everything
    opacity: 0,
    duration: 600,
    ease: 'inQuad',
  }, '+=2000')
  .label("text-start")
  .add(elementSelector("text-line-1"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "connect-brackets-end-=100")
  .add(elementSelector("text-line-2"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "connect-brackets-end+=900")
  .add(elementSelector("text-line-3"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "connect-brackets-end+=1900")
  .add([
    elementSelector("text-line-1"),
    elementSelector("text-line-2"),
    elementSelector("text-line-3"),
  ], {
    opacity: { to: 0 },
    translateY: 15,
    duration: 150,
    ease: "inQuad",
  }, "logo-start")
  .add({}, {}, "+=2000") // pause before loop
;

window.__CAPTURE__ = {
  duration: mainTimeline.duration,
  seek: (ms) => mainTimeline.seek(ms),
  pause: () => mainTimeline.pause(),
};
