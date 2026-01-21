import { createTimeline, spring, utils } from "animejs";

const CANVAS_SELECTOR = '[data-js-canvas="animation-003"]';
const elementSelector = (selector: string) => {
  return `${CANVAS_SELECTOR} [data-js-anim-el='${selector}']`;
};

if (document.querySelector(CANVAS_SELECTOR) === null) {
  // don't run animation if canvas is not present
  throw new Error("Animation canvas not found");
}

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
    elementSelector("left-tree-trunk"),
    elementSelector("left-tree-bottom"),
    elementSelector("left-tree-top"),
    elementSelector("center-tree-trunk"),
    elementSelector("center-tree-bottom"),
    elementSelector("center-tree-mid"),
    elementSelector("center-tree-top"),
    elementSelector("right-tree-trunk"),
    elementSelector("right-tree-top"),
    elementSelector("logo"),
    elementSelector("text-line-1"),
    elementSelector("text-line-2"),
    elementSelector("text-line-3"),
    elementSelector("attack-left-1"),
    elementSelector("attack-left-2"),
    elementSelector("attack-left-3"),
    elementSelector("attack-left-4"),
    elementSelector("attack-left-5"),
    elementSelector("attack-right-1"),
    elementSelector("attack-right-2"),
    elementSelector("attack-right-3"),
    elementSelector("attack-right-3"),
    elementSelector("attack-right-4"),
    elementSelector("attack-right-5"),
    elementSelector("attack-right-6"),
  ], {
    opacity: 0,
    scale: 1,
  });
}
resetSprites();

const easeSpring = spring({
  bounce: 0.34,
  duration: 400,
});

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
    x: (_target, i, _l) => (i === 0 ? -20 : 20),
    ease: easeSpring,
  })
  .add([
    elementSelector("left-tree-trunk"),
    elementSelector("left-tree-bottom"),
    elementSelector("left-tree-top"),
  ], { // grow tree parts
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    delay: utils.stagger(150),
    ease: "outBack",
  }, "<<")
  .add([
    elementSelector("right-tree-trunk"),
    elementSelector("right-tree-top"),
  ], { // grow tree parts
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    delay: utils.stagger(150),
    ease: "outBack",
  }, "<<+=200")
  .label("trees-end")
  /**
   * DDoS formation animation
   */
  .label("ddos-start")
  .add(elementSelector("attack-left-1"), {
    translateX: [-200, 0],
    translateY: [-40, 0],
    opacity: [1, 1],
    duration: 250,
    ease: "outQuad",
  })
  .add(elementSelector("attack-left-2"), {
    translateX: [-200, 0],
    translateY: [-40, 0],
    opacity: [1, 1],
    duration: 250,
    ease: "outQuad",
  }, '<<+=50')
  .add(elementSelector("attack-left-3"), {
    translateX: [-200, 0],
    translateY: [-40, 0],
    opacity: [1, 1],
    duration: 250,
    ease: "outQuad",
  }, '<<')
  .add([
    elementSelector("attack-left-1"),
    elementSelector("attack-left-2"),
    elementSelector("attack-left-3"),
    elementSelector("attack-left-4"),
    elementSelector("attack-left-5"),
    elementSelector("attack-right-1"),
    elementSelector("attack-right-2"),
    elementSelector("attack-right-3"),
    elementSelector("attack-right-4"),
    elementSelector("attack-right-5"),
    elementSelector("attack-right-6"),
  ], {
    scale: 1.5,
    duration: 200,
    ease: "linear",
  }, "<")
  .add([
    elementSelector("attack-left-1"),
    elementSelector("attack-left-2"),
    elementSelector("attack-left-3"),
    elementSelector("attack-left-4"),
    elementSelector("attack-left-5"),
    elementSelector("attack-right-1"),
    elementSelector("attack-right-2"),
    elementSelector("attack-right-3"),
    elementSelector("attack-right-4"),
    elementSelector("attack-right-5"),
    elementSelector("attack-right-6"),
  ], {
    opacity: 0,
    duration: 100,
    ease: "linear",
  }, "<-=100")
  .label("ddos-end")
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
  }, '<<')
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
  /**
   * Text animations
   */
  .label("text-start")
  .add(elementSelector("text-line-1"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "trees-start+=50")
  .add(elementSelector("text-line-2"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "<<+=50")
  .add(elementSelector("text-line-3"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "trees-end")
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