document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('mock-viewer');
  if (!viewer) return;

  const iframe = document.getElementById('mock-iframe') as HTMLIFrameElement;
  const wrapper = document.getElementById('iframe-wrapper')!;
  const baseUrl = viewer.dataset.baseUrl || '';
  const entryFile = viewer.dataset.entryFile || 'index.html';

  // @axiom: client-ui.md#nawigacja-między-stronami
  const pageSelect = document.getElementById('page-select') as HTMLSelectElement | null;
  let currentPage = entryFile;

  if (pageSelect) {
    pageSelect.addEventListener('change', () => {
      const page = pageSelect.value;
      currentPage = page;
      iframe.src = baseUrl + page;
    });
  }

  // "Strona główna" button → navigate to entry_file
  const homeBtn = document.getElementById('home-page-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      currentPage = entryFile;
      iframe.src = baseUrl + entryFile;
      if (pageSelect) pageSelect.value = entryFile;
    });
  }

  // Detect in-iframe navigation
  iframe.addEventListener('load', () => {
    try {
      const iframePath = iframe.contentWindow?.location.pathname || '';
      const basePrefix = new URL(baseUrl, window.location.origin).pathname;
      if (iframePath.startsWith(basePrefix)) {
        const page = iframePath.slice(basePrefix.length);
        if (page && page !== currentPage) {
          currentPage = page;
          if (pageSelect) pageSelect.value = page;
        }
      }
    } catch (_) {}
  });
  // /@axiom: client-ui.md#nawigacja-między-stronami

  // @axiom: client-ui.md#przełącznik-desktopmobile
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
  // /@axiom: client-ui.md#przełącznik-desktopmobile
});
