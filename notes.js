document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const chatMessages = document.getElementById('chatMessages');
  const notesArea = document.getElementById('notesArea');
  const enterBtn = document.getElementById('enterBtn');

  // 載入訊息
  function loadMessages() {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    chatMessages.innerHTML = '';

    saved.forEach((text, index) => {
      const div = document.createElement('div');
      div.className = 'chat-message';
      div.textContent = text;

      // 點擊訊息 → 進入編輯模式
      div.addEventListener('click', () => {
        // 避免重複建立輸入框
        if (div.querySelector('input')) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = text;
        div.innerHTML = '';
        div.appendChild(input);
        input.focus();

        // 保存邏輯
        function save() {
          const val = input.value.trim();
          const msgs = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
          if (val) {
            msgs[index] = val;
          } else {
            msgs.splice(index, 1); // 空白 → 刪除
          }
          localStorage.setItem('quickNotesChat', JSON.stringify(msgs));
          loadMessages();
        }

        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            save();
          }
        });
      });

      chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 開關視窗
  notesIcon.addEventListener('click', () => {
    notesWindow.style.display = 'flex';
    loadMessages();
  });
  closeNotes.addEventListener('click', () => {
    notesWindow.style.display = 'none';
  });

  // 新增訊息
  function appendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    saved.push(trimmed);
    localStorage.setItem('quickNotesChat', JSON.stringify(saved));
    loadMessages();
  }

  enterBtn.addEventListener('click', () => {
    appendMessage(notesArea.value);
    notesArea.value = '';
  });

  // Ctrl+Enter 送出
  notesArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      enterBtn.click();
    }
  });
});