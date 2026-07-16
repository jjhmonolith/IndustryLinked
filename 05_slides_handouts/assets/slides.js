/* 16:9 슬라이드 내비게이션 — 공용
   ←/→/Space/PageUp·Down: 이동 · F: 전체화면 · N: 발표자 노트 · Home/End
   해시(#3)로 슬라이드 위치 동기화 */
(function () {
  function init() {
    var deck = document.querySelector('.deck');
    if (!deck) return;
    var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
    if (!slides.length) return;

    // 진행 바 + HUD
    var progress = document.createElement('div');
    progress.className = 'progress';
    deck.appendChild(progress);

    var idx = 0;

    function clampFromHash() {
      var h = parseInt((location.hash || '').replace('#', ''), 10);
      if (!isNaN(h)) idx = Math.min(slides.length - 1, Math.max(0, h - 1));
    }
    clampFromHash();

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      progress.style.width = ((idx + 1) / slides.length * 100) + '%';
      // HUD 갱신(덱 단위 카운터)
      var c = document.getElementById('counter');
      if (c) c.textContent = (idx + 1) + ' / ' + slides.length;
      // 노트 갱신
      var notesBar = document.getElementById('notesBar');
      if (notesBar) {
        var n = slides[idx].querySelector('.notes');
        notesBar.innerHTML = n ? n.innerHTML : '<i style="color:#66739c">이 슬라이드에는 발표자 노트가 없습니다.</i>';
      }
      if (('#' + (idx + 1)) !== location.hash) history.replaceState(null, '', '#' + (idx + 1));
    }

    function go(n) { idx = Math.min(slides.length - 1, Math.max(0, n)); render(); }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }

    document.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': next(); e.preventDefault(); break;
        case 'ArrowLeft': case 'PageUp': prev(); e.preventDefault(); break;
        case 'Home': go(0); break;
        case 'End': go(slides.length - 1); break;
        case 'f': case 'F':
          if (!document.fullscreenElement) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
          break;
        case 'n': case 'N': document.body.classList.toggle('show-notes'); break;
      }
    });

    // 클릭/터치로 다음
    deck.addEventListener('click', function (e) {
      if (e.target.closest('a, button, pre')) return;
      var x = e.clientX - deck.getBoundingClientRect().left;
      if (x < deck.clientWidth * 0.28) prev(); else next();
    });
    var x0 = null;
    deck.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    deck.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      x0 = null;
    });

    window.addEventListener('hashchange', function () { clampFromHash(); render(); });

    // 노트 바
    var bar = document.createElement('div');
    bar.className = 'notes'; bar.id = 'notesBar';
    document.body.appendChild(bar);

    // 도움말
    var help = document.createElement('div');
    help.className = 'help';
    help.innerHTML = '<kbd>←</kbd><kbd>→</kbd> 이동 · <kbd>F</kbd> 전체화면 · <kbd>N</kbd> 노트';
    document.body.appendChild(help);
    setTimeout(function () { help.style.transition = 'opacity .6s'; help.style.opacity = '0'; }, 4000);

    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
