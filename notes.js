document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const notesArea = document.getElementById('notesArea');
  const chatMessages = document.getElementById('chatMessages');
  const enterBtn = document.getElementById('enterBtn');

  // 初始狀態：隱藏視窗
  notesWindow.style.display = 'none';
  notesWindow.setAttribute('aria-hidden', 'true');

  // 讀取聊天訊息（array 存在 localStorage）
  function loadMessages() {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    chatMessages.innerHTML = '';
    saved.forEach(text => {
      const div = document.createElement('div');
      div.className = 'chat-message';
      div.textContent = text;
      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 寫入一則訊息
  function appendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    saved.push(trimmed);
    localStorage.setItem('quickNotesChat', JSON.stringify(saved));

    const div = document.createElement('div');
    div.className = 'chat-message';
    div.textContent = trimmed;
    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 打開視窗
  function openNotes() {
    notesWindow.style.display = 'flex';
    notesWindow.setAttribute('aria-hidden', 'false');

    // 載入聊天紀錄
    loadMessages();

    // 載入記事本（若你希望保留草稿，可保留；若不要草稿，則清空）
    const draft = localStorage.getItem('quickNotesDraft') || '';
    notesArea.value = draft;
  }

  // 關閉視窗（保存草稿）
  function closeNotesWindow() {
    notesWindow.style.display = 'none';
    notesWindow.setAttribute('aria-hidden', 'true');
    localStorage.setItem('quickNotesDraft', notesArea.value);
  }

  // 點擊 icon 開啟
  notesIcon.addEventListener('click', openNotes);

  // 點擊關閉按鈕關閉
  closeNotes.addEventListener('click', closeNotesWindow);

  // 透明 Enter 按鈕：把 textarea 內容送到上方聊天室，並清空 textarea
  enterBtn.addEventListener('click', () => {
    const text = notesArea.value;
    appendMessage(text);
    notesArea.value = '';
    localStorage.setItem('quickNotesDraft', '');
  });

  // 在 textarea 內按下 Ctrl+Enter 也送出（避免單純 Enter 造成換行）
  notesArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      enterBtn.click();
    }
  });

  // 寫作時自動保存草稿（不影響送出行為）
  notesArea.addEventListener('input', () => {
    localStorage.setItem('quickNotesDraft', notesArea.value);
  });

  // Esc 關閉視窗（可選）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notesWindow.style.display !== 'none') {
      closeNotesWindow();
    }
  });
});