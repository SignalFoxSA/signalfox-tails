/* SignalFox Tails — tiny shared helpers. */
let toastTimer;
function showToast(msg, shelf) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast' + (shelf === false ? ' no-shelf' : '');
    document.querySelector('.phone').appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
