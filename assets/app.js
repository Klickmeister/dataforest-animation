const debugMode = new URLSearchParams(location.search).get('debug') === '1';

function resetSprites() {
  anime.set(['#brace-left', '#brace-right'], {
    opacity: 0,
    scale: 0.8,
    translateX: 0
  });
  anime.set('#star', { opacity: 0, scale: 1, rotate: 0 });
  anime.set('#tree-spin', { opacity: 0 });
  anime.set(['#word-klick-1', '#word-klick-2', '#word-fertig'], {
    opacity: 0,
    translateY: 15
  });
  anime.set('#tree-spin .arrow-mid, #tree-spin .arrow-top', { opacity: 0 });
  anime.set('#tree-spin .arrow-bottom, #tree-spin .tree-block', { opacity: 1 });
}

resetSprites();

const timeline = anime.timeline({
  loop: true,
  autoplay: !debugMode
});

if (debugMode) {
  anime.set(['#brace-left', '#brace-right', '#star', '#logo-mark', '#word-klick-1', '#word-klick-2', '#word-fertig'], {
    opacity: 1,
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  anime.set('#tree-spin', { opacity: 1 });
  anime.set('#tree-spin .arrow-mid, #tree-spin .arrow-top', { opacity: 1 });
}

timeline
  .add({
    targets: '#word-klick-1',
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 800,
    easing: 'easeOutQuad'
  })
  .add({
    targets: ['#brace-left', '#brace-right'],
    opacity: [0, 1],
    scale: [2, 2],
    duration: 10,
    easing: 'linear',
    offset: '+=150'
  })
  .add({
    targets: '#word-klick-2',
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 700,
    easing: 'easeOutQuad'
  })
  .add({
    targets: ['#brace-left', '#brace-right'],
    translateX: function(el, i) {
      return i === 0 ? -24 : 24;
    },
    duration: 700,
    easing: 'easeInQuad',
    offset: '-=400'
  })
  .add({
    targets: '#star',
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutQuad',
    offset: '+=50'
  })
  .add({
    targets: '#star',
    opacity: [1, 0],
    duration: 300,
    easing: 'linear'
  })
  .add({
    targets: '#tree-spin',
    opacity: [0, 1],
    duration: 400,
    easing: 'easeOutQuad'
  })
  .add({
    targets: '#tree-spin .arrow-mid',
    opacity: [0, 1],
    duration: 350,
    easing: 'easeOutQuad'
  })
  .add({
    targets: '#tree-spin .arrow-top',
    opacity: [0, 1],
    duration: 350,
    easing: 'easeOutQuad'
  })
  .add({
    targets: ['#brace-left', '#brace-right'],
    translateX: function(el, i) {
      return i === 0 ? -14 : 14;
    },
    duration: 500,
    easing: 'easeInQuad'
  })
  .add({
    targets: '#word-fertig',
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 700,
    easing: 'easeOutQuad',
    offset: '+=150'
  })
  .add({
    targets: ['#brace-left', '#brace-right', '#tree-spin'],
    opacity: 0,
    duration: 10,
    easing: 'linear'
  })
  .add({
    targets: '#logo-mark',
    opacity: [0, 1],
    scale: [1, 1],
    duration: 400,
    easing: 'linear'
  })
  .add({
    // Hold the logo visible for 5 seconds before fade-out
    targets: '#logo-mark',
    duration: 5000,
    easing: 'linear'
  })
  .add({
    targets: ['#word-klick-1', '#word-klick-2', '#word-fertig', '#logo-mark'],
    opacity: [1, 0],
    duration: 700,
    easing: 'easeOutQuad',
    delay: 400
  })
  .add({
    targets: ['#brace-left', '#brace-right'],
    translateX: 0,
    duration: 10
  })
  .add({
    targets: ['#word-klick-1', '#word-klick-2', '#word-fertig'],
    translateY: 15,
    duration: 10
  })
  .add({
    targets: ['#word-klick-1', '#word-klick-2', '#word-fertig'],
    opacity: 0,
    duration: 10,
    easing: 'linear'
  });

const canvas = document.getElementById('canvas');

canvas.addEventListener('click', function(evt) {
  evt.stopPropagation();
  canvas.classList.toggle('show-grid');
});

document.body.addEventListener('click', function(evt) {
  const isInteractive = evt.target.closest('a, button, input, textarea, select, option');
  const insideCanvas = evt.target.closest('#canvas');
  if (!isInteractive && !insideCanvas) {
    location.reload();
  }
});

// Poll for file changes via Last-Modified/ETag and reload on change (works over http/https)
(function setupAutoReload() {
  if (location.protocol === 'file:') return;
  let lastMod = null;
  async function check() {
    try {
      const res = await fetch(location.href, { method: 'HEAD', cache: 'no-store' });
      const mod = res.headers.get('last-modified') || res.headers.get('etag');
      if (mod && lastMod && mod !== lastMod) location.reload();
      if (mod) lastMod = mod;
    } catch (e) {
      // ignore network errors
    }
  }
  setInterval(check, 2000);
})();
