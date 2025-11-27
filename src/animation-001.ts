import { createTimeline } from "animejs";

// function resetSprites() {
//   anime.set([ // first frame setup
//     '#canvas-art-1__left-bracket',
//     '#canvas-art-1__right-bracket',
//   ], {
//     opacity: 1,
//     scale: 1,
//   });
//   anime.set([ // everything else
//     '#canvas-art-1__left-bracket-1',
//     '#canvas-art-1__right-bracket-1',
//     '#canvas-art-1__left-bracket-2',
//     '#canvas-art-1__right-bracket-2',
//     '#canvas-art-1__asterisk',
//     '#canvas-art-1__rain-part-1',
//     '#canvas-art-1__rain-part-2',
//     '#canvas-art-1__rain-part-3',
//     '#canvas-art-1__rain-part-4',
//   ], {
//     opacity: 0,
//     scale: 1,
//   });
// }

// resetSprites();

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
    easing: "easeOutBack",
  })
  .add("#canvas-art-1__asterisk", { // show asterisk
    opacity: [0, 1],
    scale: [0.25, 1],
    rotate: [-60, 0],
    duration: 600,
    easing: "easeOutBack",
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
    easing: "easeInOutQuad",
  }, "+=500")
  // .add({})

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
    easing: "easeInOutQuad",
  }, "+=500")
  .add("[data-js-canvas] path", { // fade out everything
    opacity: 0,
    duration: 600,
    easing: "easeInQuad",
  }, "+=2000")
  .add("[data-js-canvas] path", {
    duration: 1000, // 1 seconds
    easing: "linear",
  });
