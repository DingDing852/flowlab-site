document.addEventListener('DOMContentLoaded', () => {
  const notesIcon = document.getElementById('notesIcon');
  const notesWindow = document.getElementById('notesWindow');
  const closeNotes = document.getElementById('closeNotes');
  const chatMessages = document.getElementById('chatMessages');
  const notesArea = document.getElementById('notesArea');
  const enterBtn = document.getElementById('enterBtn');

  // 防護：確保元素存在
  if (!notesIcon || !notesWindow || !closeNotes || !chatMessages || !notesArea || !enterBtn) {
    console.warn('Quick Notes: missing required elements.');
    return;
  }

  // 視窗狀態旗標，避免重複開啟或載入異常
  let windowOpen = false;

  // 初始：強制隱藏，清除可能殘留的內聯樣式或狀態
  notesWindow.style.display = 'none';
  notesWindow.setAttribute('aria-hidden', 'true');

  // 訊息載入（不會自行呼叫開窗）
  function loadMessages() {
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    chatMessages.innerHTML = '';

    saved.forEach((text, index) => {
      const div = document.createElement('div');
      div.className = 'chat-message';
      div.textContent = text;

      // 點擊訊息 → 進入單則編輯模式
      div.addEventListener('click', () => {
        if (!windowOpen) return; // 視窗未開啟時不編輯
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

      chatMessages.appendChild(div);
    });

    // 滾到底部顯示最新
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 開窗（僅由使用者手勢觸發）
  function openWindow() {
    if (windowOpen) return;
    windowOpen = true;
    notesWindow.style.display = 'flex';
    notesWindow.setAttribute('aria-hidden', 'false');
    loadMessages();
  }

  // 關窗
  function closeWindow() {
    if (!windowOpen) return;
    windowOpen = false;
    notesWindow.style.display = 'none';
    notesWindow.setAttribute('aria-hidden', 'true');
  }

  // 綁定：僅在使用者點擊 icon 時開啟
  notesIcon.addEventListener('click', openWindow);
  // 避免某些鍵盤事件觸發 icon click（例如空白鍵在焦點上）
  notesIcon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // 不用鍵盤開啟，僅限滑鼠點擊
    }
  });

  // 關閉按鈕
  closeNotes.addEventListener('click', closeWindow);

  // 新增訊息
  function appendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const saved = JSON.parse(localStorage.getItem('quickNotesChat')) || [];
    saved.push(trimmed);
    localStorage.setItem('quickNotesChat', JSON.stringify(saved));
    loadMessages();
  }

  // Enter 按鈕（確保 type="button"）
  enterBtn.addEventListener('click', () => {
    appendMessage(notesArea.value);
    notesArea.value = '';
  });

  // Ctrl/Cmd + Enter 送出（避免單純 Enter 換行造成誤觸）
  notesArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      enterBtn.click();
    }
  });

  // 其他防護：全域 Esc 關窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowOpen) {
      closeWindow();
    }
  });
});