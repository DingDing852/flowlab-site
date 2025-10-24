document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const notesArea = document.getElementById('notesArea');

  // 保險：載入後確保視窗是隱藏狀態
  notesWindow.style.display = 'none';
  notesWindow.setAttribute('aria-hidden', 'true');

  function openNotes() {
    notesWindow.style.display = 'flex';
    notesWindow.setAttribute('aria-hidden', 'false');
    notesArea.value = localStorage.getItem('quickNotes') || '';
    // 不自動聚焦，避免某些瀏覽器彈出鍵盤或誤判開啟
    // notesArea.focus(); // 如需自動聚焦再打開這行
  }

  function closeNotesWindow() {
    notesWindow.style.display = 'none';
    notesWindow.setAttribute('aria-hidden', 'true');
    localStorage.setItem('quickNotes', notesArea.value);
  }

  // 只有點擊 icon 才開啟
  notesIcon.addEventListener('click', openNotes);

  // 點擊關閉按鈕關閉
  closeNotes.addEventListener('click', closeNotesWindow);

  // 自動保存輸入
  notesArea.addEventListener('input', () => {
    localStorage.setItem('quickNotes', notesArea.value);
  });

  // 防止 Esc 關閉之外的任何自動開啟
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notesWindow.style.display !== 'none') {
      closeNotesWindow();
    }
  });
});