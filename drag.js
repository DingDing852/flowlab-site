// 讓指定的視窗可以拖曳
function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let offsetX = 0, offsetY = 0, isDown = false;

  header.addEventListener('mousedown', (e) => {
    isDown = true;
    // 計算滑鼠點擊位置與視窗左上角的差距
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    // 點擊時讓這個視窗浮到最上層
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1000);
    win.style.zIndex = 2000;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    // 更新視窗位置
    win.style.left = (e.clientX - offsetX) + 'px';
    win.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
  });
}

// 啟用拖曳功能
document.addEventListener('DOMContentLoaded', () => {
  const notesWin = document.getElementById('notesWindow');
  const timerWin = document.getElementById('timerWindow');

  if (notesWin) makeDraggable(notesWin);
  if (timerWin) makeDraggable(timerWin);
});