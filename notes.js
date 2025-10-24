document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const chatMessages = document.getElementById('chatMessages');
  const notesArea = document.getElementById('notesArea');
  const enterBtn = document.getElementById('enterBtn');
  const manageBtn = document.getElementById('manageBtn');

  let isManaging = false; // 管理模式開關

  // 載入訊息
  function loadMessages() {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    chatMessages.innerHTML = '';
    saved.forEach((text, index) => {
      const div = document.createElement('div');
      div.className = 'chat-message';

      if (isManaging) {
        // 管理模式：輸入框 + 刪除按鈕
        div.classList.add('editing');
        const input = document.createElement('input');
        input.value = text;

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = '刪除';
        delBtn.addEventListener('click', () => {
          saved.splice(index, 1);
          localStorage.setItem('quickNotesChat', JSON.stringify(saved));
          loadMessages();
        });

        div.appendChild(input);
        div.appendChild(delBtn);
      } else {
        // 平常模式：純文字
        div.textContent = text;
      }

      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 保存管理模式下的修改
  function saveMessages() {
    const inputs = chatMessages.querySelectorAll('input');
    const newMessages = [];
    inputs.forEach(input => {
      const val = input.value.trim();
      if (val) newMessages.push(val); // 空白則刪除
    });
    localStorage.setItem('quickNotesChat', JSON.stringify(newMessages));
  }

  // 開關管理模式
  manageBtn.addEventListener('click', () => {
    if (isManaging) {
      // 離開管理模式 → 保存
      saveMessages();
      isManaging = false;
      manageBtn.textContent = '管理';
    } else {
      // 進入管理模式
      isManaging = true;
      manageBtn.textContent = '完成';
    }
    loadMessages();
  });

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