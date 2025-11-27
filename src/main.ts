import './style.css'

const canvas = document.querySelectorAll('[data-js-canvas]');

canvas.forEach(c => {
  c.addEventListener('click', function (evt) {
    evt.stopPropagation();
    c.classList.toggle('show-grid');
  });
});

// document.body.addEventListener('click', function (evt) {
//   const isInteractive = evt.target?.closest('a, button, input, textarea, select, option');
//   const insideCanvas = evt.target?.closest('[data-js-canvas]');
//   if (!isInteractive && !insideCanvas) {
//     location.reload();
//   }
// });
