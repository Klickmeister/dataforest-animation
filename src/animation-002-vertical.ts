import { createTimeline, spring, utils } from "animejs";

const CANVAS_SELECTOR = '[data-js-canvas="animation-002-vertical"]';
const elementSelector = (selector: string) => {
  return `${CANVAS_SELECTOR} [data-js-anim-el='${selector}']`;
};

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
    elementSelector("asterisk"),
    elementSelector("rain-part-1") + " path",
    elementSelector("rain-part-2") + " path",
    elementSelector("rain-part-3") + " path",
    elementSelector("tree-trunk"),
    elementSelector("tree-bottom"),
    elementSelector("tree-mid"),
    elementSelector("tree-top"),
    elementSelector("logo"),
    elementSelector("text-line-1"),
    elementSelector("text-line-2"),
    elementSelector("text-line-3"),
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
  ], { // show brackets
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    ease: "outBack",
  })
  .label("show-asterisk-start")
  .add(elementSelector("asterisk"), { // show asterisk
    opacity: [0, 1],
    scale: [0.25, 1],
    rotate: [-60, 0],
    duration: 600,
    ease: "outBack",
  })
  .label("show-asterisk-end")
  
  /**
   * Rain animation
   */
  .label("rain-start")
  .add([
    elementSelector("rain-part-1"),
    elementSelector("rain-part-2"),
    elementSelector("rain-part-3"),
    elementSelector("rain-part-4"),
  ], {
    y: { to: 45 }, // move rain parts down
    duration: 2_800,
    ease: "linear",
  })
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
  }, "<<")
  .add(elementSelector("rain-part-1") + " path", { // fade in rain part 1
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
    delay: utils.stagger(70),
  }, "<<")
  .add(elementSelector("rain-part-2") + " path", { // fade in rain part 2
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
    delay: utils.stagger(70),
  }, "<<+=200")
  .add(elementSelector("rain-part-3") + " path", { // fade in rain part 3
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
    delay: utils.stagger(70),
  }, "<<+=250")
  .add(elementSelector("rain-part-1") + " path", { // fade out rain part 1
    opacity: 0,
    duration: 300,
    ease: "outQuad",
    delay: utils.stagger(70),
  }, "rain-start+=600")
  .add(elementSelector("rain-part-2") + " path", { // fade out rain part 2
    opacity: 0,
    duration: 300,
    ease: "outQuad",
    delay: utils.stagger(70),
  }, "rain-start+=1200")
  .add(elementSelector("rain-part-3") + " path", { // fade out rain part 3
    opacity: 0,
    duration: 300,
    ease: "outQuad",
    delay: utils.stagger(70),
  }, "rain-start+=2000")
  .label("rain-end")
  /**
   * Tree grow animation
   */
  .label("tree-grow-start")
  .add(elementSelector("asterisk"), { // hide asterisk
    opacity: 0,
    scale: 0.25,
    rotate: 60,
    duration: 400,
    ease: "inBack",
  }, "rain-end-=2000")
  .add([
    elementSelector("tree-trunk"),
    elementSelector("tree-bottom"),
    elementSelector("tree-mid"),
    elementSelector("tree-top"),
  ], { // grow tree parts
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 800,
    delay: utils.stagger(250),
    ease: "outBack",
  }, "<")
  .label("tree-grow-end")
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
    duration: 600,
    ease: "inOutQuad",
  }, "-=800")
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
  }, "show-asterisk-start-=300")
  .add(elementSelector("text-line-2"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "show-asterisk-end-=100")
  .add(elementSelector("text-line-3"), {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [2, 0],
    duration: 150,
    ease: easeSpring,
  }, "rain-end-=1000")
  .add([
    elementSelector("text-line-1"),
    elementSelector("text-line-2"),
    elementSelector("text-line-3"),
  ], {
    opacity: { to: 0 },
    translateY: 15,
    duration: 150,
    ease: "inQuad",
  }, "tree-grow-end")
  .add({}, {}, "+=2000") // pause before loop
;
