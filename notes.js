document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const chatMessages = document.getElementById('chatMessages');
  const notesArea = document.getElementById('notesArea');
  const enterBtn = document.getElementById('enterBtn');
  const editBtn = document.getElementById('editBtn');

  let isEditing = false;   // 是否處於編輯模式
  let windowOpen = false;  // 視窗是否已開啟

  // 自動調整 textarea 高度
  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 300) + 'px';
  }

  // 載入訊息
  function loadMessages() {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    chatMessages.innerHTML = '';

    saved.forEach((text, index) => {
      const div = document.createElement('div');
      div.className = 'chat-message';

      const textDiv = document.createElement('div');
      textDiv.textContent = text;
      textDiv.style.whiteSpace = 'pre-wrap';
      textDiv.style.wordBreak = 'break-word';
      textDiv.style.maxHeight = '120px';
      textDiv.style.overflowY = 'auto';
      div.appendChild(textDiv);

      if (isEditing) {
        // 刪除按鈕
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
        textDiv.addEventListener('click', () => {
          if (div.querySelector('textarea')) return;

          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.width = '100%';
          textarea.style.minHeight = '24px';
          textarea.style.maxHeight = '300px';
          textarea.style.overflowY = 'auto';
          textarea.style.resize = 'none';

          div.innerHTML = '';
          div.appendChild(textarea);
          autoResize(textarea);
          textarea.focus();

          function save() {
            const val = textarea.value.trim();
            const msgs = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
            if (val) {
              msgs[index] = val;
            } else {
              msgs.splice(index, 1);
            }
            localStorage.setItem('quickNotesChat', JSON.stringify(msgs));
            loadMessages();
          }

          textarea.addEventListener('input', () => autoResize(textarea));
          textarea.addEventListener('blur', save);
          textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
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

  // 切換 Edit / Finish 模式
  editBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    editBtn.textContent = isEditing ? 'Finish' : 'Edit';
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

    // 如果在編輯模式下關閉 → 自動恢復成一般模式
    if (isEditing) {
      isEditing = false;
      editBtn.textContent = 'Edit';
      loadMessages();
    }
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

      if (isEditing) {
        isEditing = false;
        editBtn.textContent = 'Edit';
        loadMessages();
      }
    }
  });
});