const notesIcon = document.getElementById('notesIcon');
const notesWindow = document.getElementById('notesWindow');
const closeNotes = document.getElementById('closeNotes');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const saveNote = document.getElementById('saveNote');

// 載入已保存的訊息
function loadMessages() {
  const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
  chatMessages.innerHTML = '';
  saved.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'chat-message';
    div.textContent = msg;
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 打開視窗
notesIcon.addEventListener('click', () => {
  notesWindow.style.display = 'flex';
  loadMessages();
});

// 關閉視窗
closeNotes.addEventListener('click', () => {
  notesWindow.style.display = 'none';
});

// 儲存訊息
saveNote.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (text !== '') {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    saved.push(text);
    localStorage.setItem('quickNotesChat', JSON.stringify(saved));
    chatInput.value = '';
    loadMessages();
  }
});

// 允許按 Enter 直接送出
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveNote.click();
  }
});