import { createTimeline, utils } from "animejs";

const CANVAS_SELECTOR = '[data-js-canvas="animation-001"]';
const elementSelector = (selector: string) =>{
  return `${CANVAS_SELECTOR} [data-js-anim-el='${selector}']`;
}

function resetSprites() {
  utils.set([ // first frame setup
    elementSelector('left-bracket'),
    elementSelector('right-bracket'),
  ], {
    opacity: 1,
    scale: 1,
  });
  utils.set([ // everything else
    elementSelector('left-bracket-1'),
    elementSelector('right-bracket-1'),
    elementSelector('left-bracket-2'),
    elementSelector('right-bracket-2'),
    elementSelector('asterisk'),
    elementSelector('rain-part-1'),
    elementSelector('rain-part-2'),
    elementSelector('rain-part-3'),
    elementSelector('rain-part-4'),
  ], {
    opacity: 0,
    scale: 1,
  });
}
resetSprites();

const mainTimeline = createTimeline({
  autoplay: true,
  loop: true,
});

mainTimeline
  .add([
    elementSelector('left-bracket'),
    elementSelector('right-bracket'),
  ], { // show brackets
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    ease: "outBack",
  })
  .add(CANVAS_SELECTOR + " [data-js-anim-el='asterisk']", { // show asterisk
    opacity: [0, 1],
    scale: [0.25, 1],
    rotate: [-60, 0],
    duration: 600,
    ease: "outBack",
  }, "<<+=100")
  .add([
    elementSelector('left-bracket'),
    elementSelector('right-bracket'),
  ], { // morph to bigger brackets
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? elementSelector('left-bracket-2')
          : elementSelector('right-bracket-2'),
      )?.getAttribute("d") ?? "",
    duration: 600,
    ease: "inOutQuad",
  }, "+=500")
  .label("rain-start")
  .add([
    elementSelector('rain-part-1'),
    elementSelector('rain-part-2'),
    elementSelector('rain-part-3'),
    elementSelector('rain-part-4'),
  ], {
    y: { to: 45 }, // move rain parts down
    duration: 2_800,
    ease: "linear",
  })
  .add(elementSelector('rain-part-1'), { // fade in rain part 1
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
  }, "<<")
  .add(elementSelector('rain-part-2'), { // fade in rain part 2
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
  }, "<<+=200")
  .add(elementSelector('rain-part-3'), { // fade in rain part 3
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
  }, "<<+=250")
  .add(elementSelector('rain-part-1'), { // fade out rain part 1
    opacity: 0,
    duration: 300,
    ease: "outQuad",
  }, "rain-start+=600")
  .add(elementSelector('rain-part-2'), { // fade out rain part 2
    opacity: 0,
    duration: 300,
    ease: "outQuad",
  }, "rain-start+=1200")
  .add(elementSelector('rain-part-3'), { // fade out rain part 3
    opacity: 0,
    duration: 300,
    ease: "outQuad",
  }, "rain-start+=2000")
  .label("rain-end")
  .label("tree-grow-start")
  .label("tree-grow-end", "+=600") // pause after rain
  .add([
    elementSelector('left-bracket'),
    elementSelector('right-bracket'),
  ], { // morph to smaller brackets
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? elementSelector('left-bracket-1')
          : elementSelector('right-bracket-1'),
      )?.getAttribute("d") ?? "",
    duration: 600,
    ease: "inOutQuad",
  }, "+=500")
  .label("end-sequence-start")
  .add(CANVAS_SELECTOR + " path", { // fade out everything
    opacity: 0,
    duration: 600,
    ease: "inQuad",
  }, "+=1000")
  .label("end-sequence-end");
