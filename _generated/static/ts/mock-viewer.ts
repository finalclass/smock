// Mock viewer — iframe management, viewport toggle, page navigation, comment overlay

document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('mock-viewer');
  if (!viewer) return;

  const iframe = document.getElementById('mock-iframe') as HTMLIFrameElement;
  const wrapper = document.getElementById('iframe-wrapper')!;
  const overlay = document.getElementById('comment-overlay')!;
  const panel = document.getElementById('comments-panel')!;
  const toggle = document.getElementById('comment-toggle')!;
  const baseUrl = viewer.dataset.baseUrl || '';
  const entryFile = viewer.dataset.entryFile || 'index.html';

  // Helper: send event to LiveView via temporary data-lv-click element
  // Uses JSON array format so Well parses it correctly: ["SetPage", "value"]
  function pushLiveEvent(variant: string, arg: string) {
    const lv = document.querySelector('live-view');
    if (!lv) return;
    const btn = document.createElement('button');
    btn.setAttribute('data-lv-click', JSON.stringify([variant, arg]));
    btn.style.display = 'none';
    lv.appendChild(btn);
    btn.click();
    btn.remove();
  }

  // --- Sync overlay with iframe scroll/size ---

  function syncOverlay() {
    try {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;
      const scrollW = doc.documentElement.scrollWidth;
      const scrollH = doc.documentElement.scrollHeight;
      const scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
      const scrollY = doc.documentElement.scrollTop || doc.body.scrollTop;
      overlay.style.width = scrollW + 'px';
      overlay.style.height = scrollH + 'px';
      overlay.style.transform = `translate(${-scrollX}px, ${-scrollY}px)`;
    } catch (_) {
      // cross-origin — fall back to wrapper size
      overlay.style.width = '';
      overlay.style.height = '';
      overlay.style.transform = '';
    }
  }

  function attachIframeScrollListener() {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.addEventListener('scroll', syncOverlay);
      // Also sync on resize (content may reflow)
      iframe.contentWindow?.addEventListener('resize', syncOverlay);
      syncOverlay();
    } catch (_) {}
  }

  iframe.addEventListener('load', () => {
    attachIframeScrollListener();
    syncOverlay();

    // Detect in-iframe navigation (user clicked a link inside the mockup)
    try {
      const iframePath = iframe.contentWindow?.location.pathname || '';
      // baseUrl is like /s/TOKEN/mocks/ID/files/  — extract page relative to it
      const basePrefix = new URL(baseUrl, window.location.origin).pathname;
      if (iframePath.startsWith(basePrefix)) {
        const page = iframePath.slice(basePrefix.length);
        if (page && page !== currentPage) {
          currentPage = page;
          syncPageInput();
          // Update select
          if (pageSelect) pageSelect.value = page;
          clearPinState();
          pushLiveEvent('SetPage', page);
        }
      }
    } catch (_) {}
  });

  // Page navigation
  const pageSelect = document.getElementById('page-select') as HTMLSelectElement | null;
  let currentPage = entryFile;

  function syncPageInput() {
    const pageInput = document.getElementById('comment-page') as HTMLInputElement;
    if (pageInput) pageInput.value = currentPage;
  }
  syncPageInput();

  function clearPinState() {
    // Remove preview pin
    const preview = overlay.querySelector('.comment-pin-preview');
    if (preview) preview.remove();
    // Reset hidden inputs
    const xInput = document.getElementById('comment-x') as HTMLInputElement;
    const yInput = document.getElementById('comment-y') as HTMLInputElement;
    if (xInput) xInput.value = '-1';
    if (yInput) yInput.value = '-1';
    // Reset pin button
    const pinBtn = document.getElementById('place-pin-btn');
    if (pinBtn) {
      pinBtn.classList.remove('active');
      pinBtn.classList.remove('pin-set');
    }
    exitPlacingMode();
  }

  if (pageSelect) {
    pageSelect.addEventListener('change', () => {
      const page = pageSelect.value;
      currentPage = page;
      syncPageInput();
      iframe.src = baseUrl + page;
      clearPinState();
      pushLiveEvent('SetPage', page);
    });
  }

  // Viewport toggle
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  viewportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewport = (btn as HTMLElement).dataset.viewport;
      viewportBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (viewport === 'mobile') {
        wrapper.style.maxWidth = '375px';
        wrapper.style.margin = '0 auto';
      } else {
        wrapper.style.maxWidth = '';
        wrapper.style.margin = '';
      }
    });
  });

  // Comments panel toggle
  let panelVisible = true;
  toggle.addEventListener('click', () => {
    panelVisible = !panelVisible;
    panel.style.display = panelVisible ? '' : 'none';
    overlay.style.display = panelVisible ? '' : 'none';
    toggle.classList.toggle('active', panelVisible);
    if (!panelVisible) exitPlacingMode();
  });

  // --- Placing mode (pin placement) ---

  let placingMode = false;

  function enterPlacingMode() {
    placingMode = true;
    overlay.classList.add('placing');
    const btn = document.getElementById('place-pin-btn');
    if (btn) btn.classList.add('active');
  }

  function exitPlacingMode() {
    placingMode = false;
    overlay.classList.remove('placing');
    const btn = document.getElementById('place-pin-btn');
    if (btn) btn.classList.remove('active');
  }

  // Place pin button — event delegation (survives LiveView re-renders)
  panel.addEventListener('click', (e: MouseEvent) => {
    const pinBtn = (e.target as HTMLElement).closest('.btn-place-pin');
    if (!pinBtn) return;
    e.preventDefault();
    if (placingMode) {
      exitPlacingMode();
    } else {
      enterPlacingMode();
    }
  });

  // Escape key cancels placing mode
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && placingMode) {
      exitPlacingMode();
    }
  });

  // Comment overlay — click to place pin position
  overlay.addEventListener('click', (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('comment-pin')) return;
    if (!placingMode) return;

    // Position as % of iframe document (not viewport)
    const overlayW = overlay.offsetWidth;
    const overlayH = overlay.offsetHeight;
    const rect = overlay.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    // getBoundingClientRect() already accounts for the CSS transform (scroll offset),
    // so clickX/clickY are relative to the full overlay — no need to add scroll again.
    const x = (clickX / overlayW) * 100;
    const y = (clickY / overlayH) * 100;

    // Fill hidden inputs with position
    const xInput = document.getElementById('comment-x') as HTMLInputElement;
    const yInput = document.getElementById('comment-y') as HTMLInputElement;
    if (xInput) xInput.value = x.toFixed(1);
    if (yInput) yInput.value = y.toFixed(1);

    // Show preview pin on overlay
    let preview = overlay.querySelector('.comment-pin-preview') as HTMLElement;
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'comment-pin comment-pin-preview';
      preview.textContent = '\u2022';
      overlay.appendChild(preview);
    }
    preview.style.left = x + '%';
    preview.style.top = y + '%';

    // Mark pin button as "pin set"
    const pinBtn = document.getElementById('place-pin-btn');
    if (pinBtn) pinBtn.classList.add('pin-set');

    exitPlacingMode();
  });

  // After form submit — clean up form and pin state
  panel.addEventListener('submit', (e: Event) => {
    if (!(e.target as HTMLElement).closest('[data-lv-submit="SubmitComment"]')) return;

    const authorEl = panel.querySelector('input[name="author"]') as HTMLInputElement;
    const savedAuthor = authorEl?.value || '';

    setTimeout(() => {
      // Restore author name (Well clears non-hidden inputs)
      if (authorEl) authorEl.value = savedAuthor;
      // Clear textarea
      const bodyEl = panel.querySelector('textarea[name="body"]') as HTMLTextAreaElement;
      if (bodyEl) bodyEl.value = '';
      // Reset pin position
      const xInput = document.getElementById('comment-x') as HTMLInputElement;
      const yInput = document.getElementById('comment-y') as HTMLInputElement;
      if (xInput) xInput.value = '-1';
      if (yInput) yInput.value = '-1';
      // Remove preview pin
      const preview = overlay.querySelector('.comment-pin-preview');
      if (preview) preview.remove();
      // Reset pin button state
      const pinBtn = document.getElementById('place-pin-btn');
      if (pinBtn) {
        pinBtn.classList.remove('active');
        pinBtn.classList.remove('pin-set');
      }
    }, 0);
  });

  // --- Pin rendering and hover interactions ---

  function renderPins() {
    overlay.querySelectorAll('.comment-pin:not(.comment-pin-preview)').forEach(el => el.remove());
    const items = panel.querySelectorAll('.comment-item[data-comment-x]');
    let pinIndex = 0;
    items.forEach((item) => {
      const el = item as HTMLElement;
      const x = el.dataset.commentX;
      const y = el.dataset.commentY;
      const id = el.dataset.commentId;
      const page = el.dataset.commentPage;
      if (!x || !y) return;
      // Skip comments without pin position
      if (parseFloat(x) < 0 || parseFloat(y) < 0) return;
      // Only show pins for current page
      if (page && page !== currentPage) return;
      pinIndex++;
      const pin = document.createElement('div');
      pin.className = 'comment-pin';
      pin.style.left = x + '%';
      pin.style.top = y + '%';
      pin.textContent = String(pinIndex);
      pin.dataset.commentId = id || '';
      // Hover on pin → highlight comment
      pin.addEventListener('mouseenter', () => {
        pin.classList.add('pin-highlight');
        if (id) {
          const ci = panel.querySelector(`.comment-item[data-comment-id="${id}"]`);
          if (ci) ci.classList.add('comment-highlight');
        }
      });
      pin.addEventListener('mouseleave', () => {
        pin.classList.remove('pin-highlight');
        if (id) {
          const ci = panel.querySelector(`.comment-item[data-comment-id="${id}"]`);
          if (ci) ci.classList.remove('comment-highlight');
        }
      });
      // Click pin → scroll to comment
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        if (id) {
          const ci = panel.querySelector(`.comment-item[data-comment-id="${id}"]`);
          if (ci) ci.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      overlay.appendChild(pin);
    });
  }

  // Hover on comment → highlight pin
  panel.addEventListener('mouseover', (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest('.comment-item[data-comment-id]') as HTMLElement | null;
    if (!item) return;
    const id = item.dataset.commentId;
    if (id) {
      const pin = overlay.querySelector(`.comment-pin[data-comment-id="${id}"]`);
      if (pin) pin.classList.add('pin-highlight');
      item.classList.add('comment-highlight');
    }
  });
  panel.addEventListener('mouseout', (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest('.comment-item[data-comment-id]') as HTMLElement | null;
    if (!item) return;
    const id = item.dataset.commentId;
    if (id) {
      const pin = overlay.querySelector(`.comment-pin[data-comment-id="${id}"]`);
      if (pin) pin.classList.remove('pin-highlight');
      item.classList.remove('comment-highlight');
    }
  });

  // Click on comment → navigate to page + scroll to pin
  function scrollIframeToPin(x: number, y: number) {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const docW = doc.documentElement.scrollWidth;
      const docH = doc.documentElement.scrollHeight;
      const vpW = iframe.clientWidth;
      const vpH = iframe.clientHeight;
      const targetX = (x / 100) * docW - vpW / 2;
      const targetY = (y / 100) * docH - vpH / 2;
      doc.documentElement.scrollTo({ left: Math.max(0, targetX), top: Math.max(0, targetY), behavior: 'smooth' });
    } catch (_) {}
  }

  function navigateToComment(page: string, x: number, y: number, commentId: string) {
    if (page && page !== currentPage) {
      // Switch page tab
      currentPage = page;
      syncPageInput();
      iframe.src = baseUrl + page;
      if (pageSelect) pageSelect.value = page;
      clearPinState();
      pushLiveEvent('SetPage', page);
      // After load, scroll to pin and highlight it
      iframe.addEventListener('load', function onLoad() {
        iframe.removeEventListener('load', onLoad);
        syncOverlay();
        setTimeout(() => {
          scrollIframeToPin(x, y);
          highlightPin(commentId);
        }, 100);
      });
    } else {
      scrollIframeToPin(x, y);
      highlightPin(commentId);
    }
  }

  function highlightPin(commentId: string) {
    const pin = overlay.querySelector(`.comment-pin[data-comment-id="${commentId}"]`) as HTMLElement;
    if (!pin) return;
    pin.classList.add('pin-highlight');
    setTimeout(() => pin.classList.remove('pin-highlight'), 1500);
  }

  panel.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't intercept button clicks (resolve, delete, place-pin)
    if (target.closest('button') || target.closest('a')) return;
    const item = target.closest('.comment-item[data-comment-id]') as HTMLElement | null;
    if (!item) return;
    const x = parseFloat(item.dataset.commentX || '-1');
    const y = parseFloat(item.dataset.commentY || '-1');
    const page = item.dataset.commentPage || '';
    const id = item.dataset.commentId || '';
    const hasPin = x >= 0 && y >= 0;
    if (hasPin) {
      navigateToComment(page, x, y, id);
    } else if (page && page !== currentPage) {
      // No pin but different page — just navigate there
      currentPage = page;
      syncPageInput();
      iframe.src = baseUrl + page;
      if (pageSelect) pageSelect.value = page;
      clearPinState();
      pushLiveEvent('SetPage', page);
    }
  });

  // Observe comment list changes → re-render pins
  const commentsLive = panel.querySelector('.comments-live') || panel;
  const observer = new MutationObserver(() => renderPins());
  observer.observe(commentsLive, { childList: true, subtree: true });

  // Initial render
  renderPins();

  // --- Author name flow (localStorage with 1-day expiry) ---
  // Elements are inside LiveView and may not exist yet at DOMContentLoaded.
  // Use dynamic queries and event delegation on the panel.

  function checkAuthor() {
    const namePrompt = document.getElementById('comment-name-prompt');
    const formInner = document.getElementById('comment-form-inner');
    const authorInput = document.getElementById('comment-author') as HTMLInputElement | null;
    const stored = localStorage.getItem('smock_author');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const age = Date.now() - data.timestamp;
        if (age < 86400000 && data.name) {
          if (namePrompt) namePrompt.style.display = 'none';
          if (formInner) formInner.style.display = '';
          if (authorInput) authorInput.value = data.name;
          return;
        }
      } catch (_) {}
      localStorage.removeItem('smock_author');
    }
    if (namePrompt) namePrompt.style.display = '';
    if (formInner) formInner.style.display = 'none';
  }

  function submitName() {
    const nameInput = document.getElementById('name-prompt-input') as HTMLInputElement | null;
    const name = nameInput?.value.trim();
    if (!name) return;
    localStorage.setItem('smock_author', JSON.stringify({ name, timestamp: Date.now() }));
    checkAuthor();
  }

  // Event delegation — works even when elements are added later by LiveView
  panel.addEventListener('click', (e) => {
    if ((e.target as Element).id === 'name-prompt-btn') submitName();
  });
  panel.addEventListener('keydown', (e) => {
    if ((e.target as Element).id === 'name-prompt-input' && e.key === 'Enter') submitName();
  });

  // Run checkAuthor now (likely no-op) and again when LiveView renders content
  checkAuthor();
  const obs = new MutationObserver(() => checkAuthor());
  obs.observe(panel, { childList: true, subtree: true });
});
