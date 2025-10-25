document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const chatMessages = document.getElementById('chatMessages');
  const notesArea = document.getElementById('notesArea');
  const enterBtn = document.getElementById('enterBtn');
  const manageBtn = document.getElementById('manageBtn');

  let isManaging = false; // 管理模式開關
  let windowOpen = false; // 防止自動彈出

  // 初始強制隱藏
  notesWindow.style.display = 'none';
  notesWindow.setAttribute('aria-hidden', 'true');

  function loadMessages() {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    chatMessages.innerHTML = '';

    saved.forEach((text, index) => {
      const div = document.createElement('div');
      div.className = 'chat-message';

      const span = document.createElement('span');
      span.textContent = text;

      div.appendChild(span);

      if (isManaging) {
        // 管理模式下才顯示刪除鍵 + 點擊編輯
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const msgs = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
          msgs.splice(index, 1);
          localStorage.setItem('quickNotesChat', JSON.stringify(msgs));
          loadMessages();
        });
        div.appendChild(delBtn);

        // 點擊文字 → 編輯
        span.addEventListener('click', () => {
          if (div.querySelector('input')) return;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = text;
          div.innerHTML = '';
          div.appendChild(input);
          input.focus();

          function save() {
            const val = input.value.trim();
            const msgs = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
            if (val) {
              msgs[index] = val;
            } else {
              msgs.splice(index, 1);
            }
            localStorage.setItem('quickNotesChat', JSON.stringify(msgs));
            loadMessages();
          }

          input.addEventListener('blur', save);
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              save();
            }
          });
        });
      }

      chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 管理模式切換
  manageBtn.addEventListener('click', () => {
    isManaging = !isManaging;
    manageBtn.textContent = isManaging ? '完成' : '管理';
    loadMessages();
  });

  // 開窗
  notesIcon.addEventListener('click', () => {
    if (windowOpen) return;
    windowOpen = true;
    notesWindow.style.display = 'flex';
    notesWindow.setAttribute('aria-hidden', 'false');
    loadMessages();
  });

  // 關窗
  closeNotes.addEventListener('click', () => {
    windowOpen = false;
    notesWindow.style.display = 'none';
    notesWindow.setAttribute('aria-hidden', 'true');
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

  // Esc 關窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowOpen) {
      windowOpen = false;
      notesWindow.style.display = 'none';
      notesWindow.setAttribute('aria-hidden', 'true');
    }
  });
});