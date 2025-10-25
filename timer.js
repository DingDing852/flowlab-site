document.addEventListener('DOMContentLoaded', () => {
  const timerIcon = document.getElementById('timerIcon');
  const timerWindow = document.getElementById('timerWindow');
  const closeTimer = document.getElementById('closeTimer');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const clearBtn = document.getElementById('clearBtn');
  const quickAddBtns = document.querySelectorAll('.quick-add button');
  const timerDisplay = document.getElementById('timerDisplay');

  let duration = 5 * 60; // 預設 5 分鐘
  let remaining = duration;
  let endTime = null;
  let rafId = null;
  let isRunning = false;
  let windowOpen = false;
  let holdInterval = null; // 長按箭頭用

  // 秒數轉 hms
  function secsToHms(totalSec) {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { hours, minutes, seconds };
  }

  // hms 轉秒數
  function hmsToSecs(h, m, s) {
    return Math.max(
      0,
      (parseInt(h || 0, 10) || 0) * 3600 +
      (parseInt(m || 0, 10) || 0) * 60 +
      (parseInt(s || 0, 10) || 0)
    );
  }

  // 更新顯示
  function updateDisplayFromRemaining() {
    const { hours, minutes, seconds } = secsToHms(remaining);
    timerDisplay.querySelector('[data-part="hours"] .time-part').textContent = String(hours).padStart(2, '0');
    timerDisplay.querySelector('[data-part="minutes"] .time-part').textContent = String(minutes).padStart(2, '0');
    timerDisplay.querySelector('[data-part="seconds"] .time-part').textContent = String(seconds).padStart(2, '0');
  }

  // 倒數
  function tick() {
    const now = Date.now();
    remaining = Math.max(0, Math.round((endTime - now) / 1000));
    updateDisplayFromRemaining();
    if (remaining > 0 && isRunning) {
      rafId = requestAnimationFrame(tick);
    } else if (remaining <= 0) {
      isRunning = false;
      startPauseBtn.textContent = "▶ Start";
      cancelAnimationFrame(rafId);

      // 特效
      timerDisplay.classList.add('time-up');
      setTimeout(() => timerDisplay.classList.remove('time-up'), 3000);

      // 提示音（需有 alarm.mp3）
      try {
        const audio = new Audio('alarm.mp3');
        audio.play();
      } catch (e) {
        console.log("提示音無法播放");
      }
    }
  }

  function startPauseTimer() {
    if (!isRunning) {
      if (remaining <= 0) return;
      isRunning = true;
      endTime = Date.now() + remaining * 1000;
      startPauseBtn.textContent = "⏸ Pause";
      rafId = requestAnimationFrame(tick);
    } else {
      isRunning = false;
      cancelAnimationFrame(rafId);
      startPauseBtn.textContent = "▶ Start";
    }
  }

  function resetTimer() {
    isRunning = false;
    cancelAnimationFrame(rafId);
    remaining = duration;
    updateDisplayFromRemaining();
    startPauseBtn.textContent = "▶ Start";
  }

  function clearTimer() {
    isRunning = false;
    cancelAnimationFrame(rafId);
    duration = 0;
    remaining = 0;
    updateDisplayFromRemaining();
    startPauseBtn.textContent = "▶ Start";
  }

  // 快速加時
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const addSec = parseInt(btn.dataset.add, 10) || 0;
      remaining += addSec;
      duration = remaining;
      if (isRunning) {
        endTime = Date.now() + remaining * 1000;
      }
      updateDisplayFromRemaining();
    });
  });

  // 更新總秒數
  function applyNewTime() {
    const h = timerDisplay.querySelector('[data-part="hours"] .time-part').textContent;
    const m = timerDisplay.querySelector('[data-part="minutes"] .time-part').textContent;
    const s = timerDisplay.querySelector('[data-part="seconds"] .time-part').textContent;
    const newTotal = hmsToSecs(h, m, s);
    duration = newTotal;
    remaining = newTotal;
    if (isRunning) {
      endTime = Date.now() + remaining * 1000;
    }
    updateDisplayFromRemaining();
  }

  // 保持游標在最後
  function setCaretToEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
    // 編輯模式
  function attachEditableHandlers() {
    const blocks = timerDisplay.querySelectorAll('.time-block');
    blocks.forEach(block => {
      const span = block.querySelector('.time-part');
      const up = block.querySelector('.arrow.up');
      const down = block.querySelector('.arrow.down');

      span.setAttribute('contenteditable', 'true');

      // 點擊數字 → 進入編輯模式
      span.addEventListener('focus', () => {
        document.querySelectorAll('.time-block').forEach(b => b.classList.remove('editing'));
        block.classList.add('editing');
      });

      // 失焦 → 延遲檢查
      span.addEventListener('blur', () => {
        setTimeout(() => {
          if (!block.contains(document.activeElement)) {
            let val = span.textContent.trim();
            if (val === "" || isNaN(val)) val = "00";
            val = String(Math.max(0, parseInt(val, 10) || 0)).padStart(2, '0');
            span.textContent = val;
            block.classList.remove('editing');
            applyNewTime();
          }
        }, 100);
      });

      // Enter → 失焦；上下鍵 → 加減
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          span.blur();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          updateValue(1);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          updateValue(-1);
        }
      });

      // 箭頭事件（支援長按）
      function updateValue(delta) {
        let val = parseInt(span.textContent, 10) || 0;
        val += delta;
        if (val < 0) val = 0;
        if (block.dataset.part === "minutes" || block.dataset.part === "seconds") {
          if (val > 59) val = 59;
        }
        span.textContent = String(val).padStart(2, '0');
        applyNewTime();
        setCaretToEnd(span);
      }

      function startHold(delta) {
        updateValue(delta);
        holdInterval = setInterval(() => updateValue(delta), 200);
      }
      function stopHold() {
        clearInterval(holdInterval);
        holdInterval = null;
      }

      up.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startHold(1);
      });
      down.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startHold(-1);
      });
      document.addEventListener('mouseup', stopHold);
      document.addEventListener('mouseleave', stopHold);
    });

    // 點擊外面 → 結束編輯
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.time-block')) {
        document.querySelectorAll('.time-block').forEach(b => b.classList.remove('editing'));
      }
    });
  }

  // 綁定事件
  startPauseBtn.addEventListener('click', startPauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  clearBtn.addEventListener('click', clearTimer);

  // 開窗
  timerIcon.addEventListener('click', () => {
    if (windowOpen) return;
    windowOpen = true;
    timerWindow.style.display = 'flex';
    timerWindow.setAttribute('aria-hidden', 'false');
    updateDisplayFromRemaining();
  });

  // 關窗
  closeTimer.addEventListener('click', () => {
    windowOpen = false;
    timerWindow.style.display = 'none';
    timerWindow.setAttribute('aria-hidden', 'true');
  });

  // Esc 關窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowOpen) {
      windowOpen = false;
      timerWindow.style.display = 'none';
      timerWindow.setAttribute('aria-hidden', 'true');
    }
  });

  // 初始化
  updateDisplayFromRemaining();
  attachEditableHandlers();
});