import { createTimeline, utils } from "animejs";

function resetSprites() {
  utils.set([ // first frame setup
    '#canvas-art-1__left-bracket',
    '#canvas-art-1__right-bracket',
  ], {
    opacity: 1,
    scale: 1,
  });
  utils.set([ // everything else
    '#canvas-art-1__left-bracket-1',
    '#canvas-art-1__right-bracket-1',
    '#canvas-art-1__left-bracket-2',
    '#canvas-art-1__right-bracket-2',
    '#canvas-art-1__asterisk',
    '#canvas-art-1__rain-part-1',
    '#canvas-art-1__rain-part-2',
    '#canvas-art-1__rain-part-3',
    '#canvas-art-1__rain-part-4',
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
    "#canvas-art-1__left-bracket",
    "#canvas-art-1__right-bracket",
  ], { // show brackets
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    ease: "outBack",
  })
  .add("#canvas-art-1__asterisk", { // show asterisk
    opacity: [0, 1],
    scale: [0.25, 1],
    rotate: [-60, 0],
    duration: 600,
    ease: "outBack",
  }, "<<+=100")
  .add([
    "#canvas-art-1__left-bracket",
    "#canvas-art-1__right-bracket",
  ], { // morph to bigger brackets
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? "#canvas-art-1__left-bracket-2"
          : "#canvas-art-1__right-bracket-2",
      )?.getAttribute("d") ?? "",
    duration: 600,
    ease: "inOutQuad",
  }, "+=500")

  .label("rain-start")
  .add([
    "#canvas-art-1__rain-part-1",
    "#canvas-art-1__rain-part-2",
    "#canvas-art-1__rain-part-3",
    "#canvas-art-1__rain-part-4",
  ], {
    y: { to: 45 }, // move rain parts down
    duration: 3_200,
    ease: "linear",
  })
  .add("#canvas-art-1__rain-part-1", { // fade in rain part 1
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
  }, "<<")
  .add("#canvas-art-1__rain-part-2", { // fade in rain part 2
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
  }, "<<+=200")
  .add("#canvas-art-1__rain-part-3", { // fade in rain part 3
    opacity: [0, 1],
    duration: 600,
    ease: "inQuad",
  }, "<<+=300")
  .add('#canvas-art-1__rain-part-1', { // fade out rain part 1
    opacity: 0,
    duration: 300,
    ease: "outQuad",
  }, "rain-start+=600")
  .add('#canvas-art-1__rain-part-2', { // fade out rain part 2
    opacity: 0,
    duration: 300,
    ease: "outQuad",
  }, "rain-start+=1400")
  .add('#canvas-art-1__rain-part-3', { // fade out rain part 3
    opacity: 0,
    duration: 300,
    ease: "outQuad",
  }, "rain-start+=2200")
  .label("rain-end")
  

  .add([
    "#canvas-art-1__left-bracket",
    "#canvas-art-1__right-bracket",
  ], { // morph to smaller brackets
    d: (_target, i, _l) =>
      document.querySelector(
        i === 0
          ? "#canvas-art-1__left-bracket-1"
          : "#canvas-art-1__right-bracket-1",
      )?.getAttribute("d") ?? "",
    duration: 600,
    ease: "inOutQuad",
  }, "+=500")
  .add("[data-js-canvas] path", { // fade out everything
    opacity: 0,
    duration: 600,
    ease: "inQuad",
  }, "+=2000")
  .add("[data-js-canvas] path", {
    duration: 1000, // 1 seconds
    ease: "linear",
  });
