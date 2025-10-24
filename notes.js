const notesIcon = document.getElementById('notesIcon');
const notesWindow = document.getElementById('notesWindow');
const closeNotes = document.getElementById('closeNotes');
const notesArea = document.getElementById('notesArea');

// 打開視窗
notesIcon.addEventListener('click', () => {
  notesWindow.style.display = 'block';
  notesArea.value = localStorage.getItem('quickNotes') || '';
});

// 關閉視窗
closeNotes.addEventListener('click', () => {
  notesWindow.style.display = 'none';
  localStorage.setItem('quickNotes', notesArea.value);
});

// 自動保存輸入
notesArea.addEventListener('input', () => {
  localStorage.setItem('quickNotes', notesArea.value);
});