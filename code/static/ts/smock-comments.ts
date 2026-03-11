// @axiom: comments.md#komponent-lit-smock-comments
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ── Types ───────────────────────────────────────────────────────────

interface ComposePos {
  x: number;
  y: number;
}

interface Comment {
  id: number;
  thread_id: number;
  author_name: string;
  body: string;
  created_at: string;
}

interface Thread {
  id: number;
  mock_id: number;
  page_path: string;
  x_pct: number;
  y_pct: number;
  resolved: boolean;
  created_at: string;
  comments: Comment[];
}

// ── API helpers (use /api/comments/* instead of RPC) ────────────────

async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/comments/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${endpoint}: ${res.status}`);
  return res.json();
}

// ── Time formatting ─────────────────────────────────────────────────

function timeAgo(isoStr: string): string {
  const date = new Date(isoStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'teraz';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min temu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} godz. temu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} dn. temu`;
  return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}

// ── Component ───────────────────────────────────────────────────────

@customElement('smock-comments')
export class SmockComments extends LitElement {
  // @axiom: comments.md#stan-komponentu
  @property({ type: Number, attribute: 'mock-id' }) mockId = 0;
  @property({ type: String, attribute: 'entry-file' }) entryFile = 'index.html';

  @state() pagePath = '';
  @state() threads: Thread[] = [];
  @state() authorName = '';
  @state() showAll = false;
  @state() hideResolved = false;
  @state() confirmDeleteId: number | null = null;
  @state() activeCompose: ComposePos | null = null;
  @state() openThreadId: number | null = null;
  @state() namePromptMode = false;
  @state() submitting = false;
  @state() commentMode = false;
  // /@axiom: comments.md#stan-komponentu

  private channel: any = null;
  private iframe: HTMLIFrameElement | null = null;
  private overlay: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private iframeWrapper: HTMLElement | null = null;

  // ── Lifecycle ───────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this.pagePath = this.entryFile;
    this.loadAuthorName();

    // Load initial threads via API
    this.loadThreads();

    // @axiom: comments.md#kanał-comments
    // Connect to Well Channel for real-time updates
    if ((window as any).well) {
      this.channel = (window as any).well.channel(`comments:${this.mockId}`);
      this.channel.on('message', (payload: any) => {
        this.handleBusEvent(payload);
      });
    }
    // /@axiom: comments.md#kanał-comments

    // Wait for DOM to be ready, then attach to external elements
    requestAnimationFrame(() => {
      this.attachExternalElements();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.channel) {
      this.channel.leave();
      this.channel = null;
    }
    this.detachExternalListeners();
  }

  // ── Data loading ────────────────────────────────────────────────

  private async loadThreads() {
    try {
      const result = await apiPost<{ threads: Thread[] }>('list', { mock_id: this.mockId });
      this.threads = result.threads;
      this.renderPins();
    } catch (e) {
      console.error('[smock-comments] Failed to load threads:', e);
    }
  }

  // ── Bus event handler (from channel) ────────────────────────────

  private handleBusEvent(payload: any) {
    // Well MessageBus events come as polymorphic variant arrays: ["ThreadCreated", [mock_id, thread_id]]
    if (!Array.isArray(payload)) return;
    const [variant, args] = payload;
    if (!Array.isArray(args)) return;

    switch (variant) {
      case 'ThreadCreated':
      case 'CommentAdded':
      case 'ThreadResolved':
      case 'ThreadDeleted': {
        const [mockId] = args;
        if (mockId === this.mockId) {
          this.loadThreads();
        }
        break;
      }
    }
  }

  // ── Author name ─────────────────────────────────────────────────

  // @axiom: comments.md#formularz-imienia
  private loadAuthorName() {
    const stored = localStorage.getItem('smock_author');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const age = Date.now() - data.timestamp;
        if (age < 86400000 && data.name) {
          this.authorName = data.name;
          this.namePromptMode = false;
          return;
        }
      } catch (_) {}
      localStorage.removeItem('smock_author');
    }
    this.authorName = '';
    this.namePromptMode = true;
  }

  private saveAuthorName(name: string) {
    this.authorName = name;
    this.namePromptMode = false;
    localStorage.setItem('smock_author', JSON.stringify({ name, timestamp: Date.now() }));
  }
  // /@axiom: comments.md#formularz-imienia

  // @axiom: comments.md#zmiana-imienia
  private changeName() {
    localStorage.removeItem('smock_author');
    this.authorName = '';
    this.namePromptMode = true;
  }
  // /@axiom: comments.md#zmiana-imienia

  // ── External DOM (iframe, overlay) ──────────────────────────────

  private _overlayClickHandler: ((e: MouseEvent) => void) | null = null;
  private _iframeLoadHandler: (() => void) | null = null;
  private _scrollHandler: (() => void) | null = null;
  private _resizeHandler: (() => void) | null = null;
  private _keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private _pageSelectHandler: ((e: Event) => void) | null = null;
  private _homeHandler: (() => void) | null = null;

  private attachExternalElements() {
    this.iframe = document.getElementById('mock-iframe') as HTMLIFrameElement;
    this.overlay = document.getElementById('comment-overlay');
    this.panel = this;
    this.iframeWrapper = document.getElementById('iframe-wrapper');

    if (this.overlay) {
      this._overlayClickHandler = (e: MouseEvent) => this.handleOverlayClick(e);
      this.overlay.addEventListener('click', this._overlayClickHandler);
    }

    if (this.iframe) {
      this._iframeLoadHandler = () => {
        this.attachIframeScrollListener();
        this.syncOverlay();
        this.detectIframeNavigation();
      };
      this.iframe.addEventListener('load', this._iframeLoadHandler);

      // Initial sync
      this.attachIframeScrollListener();
      this.syncOverlay();
    }

    this._keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.activeCompose = null;
        this.openThreadId = null;
      }
    };
    document.addEventListener('keydown', this._keydownHandler);

    // Listen to page select and home button
    const pageSelect = document.getElementById('page-select') as HTMLSelectElement | null;
    if (pageSelect) {
      this._pageSelectHandler = () => {
        this.pagePath = pageSelect.value;
        this.activeCompose = null;
        this.openThreadId = null;
        this.renderPins();
      };
      pageSelect.addEventListener('change', this._pageSelectHandler);
    }

    const homeBtn = document.getElementById('home-page-btn');
    if (homeBtn) {
      this._homeHandler = () => {
        this.pagePath = this.entryFile;
        this.activeCompose = null;
        this.openThreadId = null;
        const ps = document.getElementById('page-select') as HTMLSelectElement | null;
        if (ps) ps.value = this.entryFile;
        this.renderPins();
      };
      homeBtn.addEventListener('click', this._homeHandler);
    }

    // Comment toggle
    const toggle = document.getElementById('comment-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const visible = this.style.display !== 'none';
        this.style.display = visible ? 'none' : '';
        if (this.overlay) this.overlay.style.display = visible ? 'none' : '';
        toggle.classList.toggle('active', !visible);
        if (visible) {
          this.activeCompose = null;
          this.openThreadId = null;
          this.setCommentMode(false);
        }
      });
    }

    // @axiom: comments.md#tryb-komentowania-vs-nawigacja
    const commentModeSwitch = document.getElementById('comment-mode-switch');
    if (commentModeSwitch) {
      commentModeSwitch.querySelectorAll('.comment-mode-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          this.setCommentMode((btn as HTMLElement).dataset.mode === 'comment');
        });
      });
    }
    // /@axiom: comments.md#tryb-komentowania-vs-nawigacja
  }

  private detachExternalListeners() {
    if (this.overlay && this._overlayClickHandler) {
      this.overlay.removeEventListener('click', this._overlayClickHandler);
    }
    if (this.iframe && this._iframeLoadHandler) {
      this.iframe.removeEventListener('load', this._iframeLoadHandler);
    }
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
    }
  }

  // @axiom: comments.md#synchronizacja-overlay-z-iframe
  private syncOverlay() {
    if (!this.iframe || !this.overlay) return;
    try {
      const doc = this.iframe.contentDocument;
      if (!doc || !doc.body) return;
      const scrollW = doc.documentElement.scrollWidth;
      const scrollH = doc.documentElement.scrollHeight;
      const scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
      const scrollY = doc.documentElement.scrollTop || doc.body.scrollTop;
      this.overlay.style.width = scrollW + 'px';
      this.overlay.style.height = scrollH + 'px';
      this.overlay.style.transform = `translate(${-scrollX}px, ${-scrollY}px)`;
    } catch (_) {
      this.overlay.style.width = '';
      this.overlay.style.height = '';
      this.overlay.style.transform = '';
    }
  }

  private attachIframeScrollListener() {
    try {
      const doc = this.iframe?.contentDocument;
      if (!doc) return;
      this._scrollHandler = () => this.syncOverlay();
      doc.addEventListener('scroll', this._scrollHandler);
      this._resizeHandler = () => this.syncOverlay();
      this.iframe?.contentWindow?.addEventListener('resize', this._resizeHandler);
      this.syncOverlay();
    } catch (_) {}
  }
  // /@axiom: comments.md#synchronizacja-overlay-z-iframe

  private detectIframeNavigation() {
    try {
      const iframePath = this.iframe?.contentWindow?.location.pathname || '';
      const viewer = document.getElementById('mock-viewer');
      const baseUrl = viewer?.dataset.baseUrl || '';
      const basePrefix = new URL(baseUrl, window.location.origin).pathname;
      if (iframePath.startsWith(basePrefix)) {
        const page = iframePath.slice(basePrefix.length);
        if (page && page !== this.pagePath) {
          this.pagePath = page;
          const pageSelect = document.getElementById('page-select') as HTMLSelectElement | null;
          if (pageSelect) pageSelect.value = page;
          this.activeCompose = null;
          this.openThreadId = null;
          this.renderPins();
        }
      }
    } catch (_) {}
  }

  // @axiom: comments.md#tryb-komentowania-vs-nawigacja
  private setCommentMode(enabled: boolean) {
    this.commentMode = enabled;
    if (this.overlay) {
      this.overlay.classList.toggle('comment-mode', enabled);
    }
    const sw = document.getElementById('comment-mode-switch');
    if (sw) {
      sw.querySelectorAll('.comment-mode-opt').forEach(btn => {
        const b = btn as HTMLElement;
        const isNav = b.dataset.mode === 'navigate';
        b.classList.toggle('active', enabled ? !isNav : isNav);
      });
    }
    if (!enabled) {
      this.activeCompose = null;
      this.openThreadId = null;
      this.renderPins();
    }
  }
  // /@axiom: comments.md#tryb-komentowania-vs-nawigacja

  // ── Overlay click → new thread compose ──────────────────────────

  // @axiom: comments.md#flow-tworzenia-nowego-wątku
  private handleOverlayClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    // Don't handle clicks on pins or bubbles
    if (target.classList.contains('comment-pin') || target.closest('.comment-bubble')) return;

    // If compose is open, close it instead of opening a new one
    if (this.activeCompose) {
      this.activeCompose = null;
      this.renderPins();
      return;
    }

    const overlayW = this.overlay!.offsetWidth;
    const overlayH = this.overlay!.offsetHeight;
    const rect = this.overlay!.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const x = (clickX / overlayW) * 100;
    const y = (clickY / overlayH) * 100;

    // If user has no name set, need to prompt first
    if (!this.authorName) {
      this.namePromptMode = true;
    }

    this.activeCompose = { x, y };
    this.openThreadId = null;
    this.renderPins();
  }
  // /@axiom: comments.md#flow-tworzenia-nowego-wątku

  // ── Pin click → open thread ─────────────────────────────────────

  private handlePinClick(threadId: number, e: Event) {
    e.stopPropagation();
    this.openThreadId = threadId;
    this.activeCompose = null;
    this.renderPins();
  }

  // ── API commands ────────────────────────────────────────────────

  // @axiom: comments.md#flow-tworzenia-nowego-wątku
  private async createThread(body: string) {
    if (!this.activeCompose || !body.trim() || this.submitting) return;
    this.submitting = true;
    this.renderPins(); // re-render to show loading state
    try {
      const thread = await apiPost<Thread>('create_thread', {
        mock_id: this.mockId,
        page_path: this.pagePath,
        x_pct: this.activeCompose.x,
        y_pct: this.activeCompose.y,
        author_name: this.authorName,
        body: body.trim(),
      });
      this.activeCompose = null;
      this.openThreadId = thread.id;
      await this.loadThreads();
    } catch (e) {
      console.error('[smock-comments] create_thread failed:', e);
    } finally {
      this.submitting = false;
    }
  }
  // /@axiom: comments.md#flow-tworzenia-nowego-wątku

  // @axiom: comments.md#flow-odpowiadania-w-wątku
  private async addComment(threadId: number, body: string) {
    if (!body.trim() || this.submitting) return;
    this.submitting = true;
    this.renderPins(); // re-render to show loading state
    try {
      await apiPost<Comment>('add_comment', {
        thread_id: threadId,
        author_name: this.authorName,
        body: body.trim(),
      });
      await this.loadThreads();
    } catch (e) {
      console.error('[smock-comments] add_comment failed:', e);
    } finally {
      this.submitting = false;
    }
  }
  // /@axiom: comments.md#flow-odpowiadania-w-wątku

  // @axiom: comments.md#resolve-i-usunięcie-wątku
  private async resolveThread(threadId: number) {
    try {
      await apiPost<Thread>('resolve_thread', { id: threadId });
      await this.loadThreads();
    } catch (e) {
      console.error('[smock-comments] resolve_thread failed:', e);
    }
  }

  private async deleteThread(threadId: number) {
    if (this.confirmDeleteId !== threadId) {
      this.confirmDeleteId = threadId;
      return;
    }
    try {
      await apiPost<{ ok: boolean }>('delete_thread', { id: threadId });
      this.confirmDeleteId = null;
      this.openThreadId = null;
      await this.loadThreads();
    } catch (e) {
      console.error('[smock-comments] delete_thread failed:', e);
    }
  }
  // /@axiom: comments.md#resolve-i-usunięcie-wątku

  // ── Pin rendering on overlay ────────────────────────────────────

  // @axiom: comments.md#renderowanie-pinów
  private renderPins() {
    if (!this.overlay) return;
    // Remove existing pins, bubbles, and tooltips
    this.overlay.querySelectorAll('.comment-pin, .comment-bubble, .pin-tooltip').forEach(el => el.remove());

    const currentThreads = this.threads.filter(t => t.page_path === this.pagePath);
    const activeThreads = currentThreads.filter(t => !t.resolved);
    const resolvedThreads = currentThreads.filter(t => t.resolved);

    // Render active pins
    activeThreads.forEach((thread, idx) => {
      const pin = document.createElement('div');
      pin.className = 'comment-pin';
      pin.style.left = thread.x_pct + '%';
      pin.style.top = thread.y_pct + '%';
      pin.textContent = String(idx + 1);
      pin.dataset.threadId = String(thread.id);

      pin.addEventListener('mouseenter', () => {
        pin.classList.add('pin-highlight');
        this.highlightThreadInPanel(thread.id, true);
        this.showPinTooltip(pin, thread);
      });
      pin.addEventListener('mouseleave', () => {
        pin.classList.remove('pin-highlight');
        this.highlightThreadInPanel(thread.id, false);
        this.hidePinTooltip();
      });
      pin.addEventListener('click', (e) => this.handlePinClick(thread.id, e));

      this.overlay!.appendChild(pin);
    });

    // Render resolved pins (greyed out) if not hidden
    if (!this.hideResolved) {
      resolvedThreads.forEach((thread) => {
        const pin = document.createElement('div');
        pin.className = 'comment-pin comment-pin-resolved';
        pin.style.left = thread.x_pct + '%';
        pin.style.top = thread.y_pct + '%';
        pin.textContent = '\u2713';
        pin.dataset.threadId = String(thread.id);

        pin.addEventListener('mouseenter', () => {
          this.showPinTooltip(pin, thread);
        });
        pin.addEventListener('mouseleave', () => {
          this.hidePinTooltip();
        });
        pin.addEventListener('click', (e) => this.handlePinClick(thread.id, e));

        this.overlay!.appendChild(pin);
      });
    }

    // Render compose preview pin
    if (this.activeCompose) {
      const preview = document.createElement('div');
      preview.className = 'comment-pin comment-pin-preview';
      preview.textContent = '\u2022';
      preview.style.left = this.activeCompose.x + '%';
      preview.style.top = this.activeCompose.y + '%';
      this.overlay!.appendChild(preview);

      // Render compose bubble
      this.renderBubble(this.activeCompose.x, this.activeCompose.y, null);
    }

    // Render thread bubble if open
    if (this.openThreadId) {
      const thread = this.threads.find(t => t.id === this.openThreadId);
      if (thread && thread.page_path === this.pagePath) {
        this.renderBubble(thread.x_pct, thread.y_pct, thread);
      }
    }
  }
  // /@axiom: comments.md#renderowanie-pinów

  private showPinTooltip(pin: HTMLElement, thread: Thread) {
    this.hidePinTooltip();
    const firstComment = thread.comments[0];
    if (!firstComment) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'pin-tooltip';
    const text = firstComment.body.length > 60
      ? firstComment.body.substring(0, 57) + '...'
      : firstComment.body;
    tooltip.innerHTML = `<strong>${this.esc(firstComment.author_name)}</strong>: ${this.esc(text)}`;
    tooltip.style.left = pin.style.left;
    tooltip.style.top = pin.style.top;
    this.overlay!.appendChild(tooltip);
  }

  private hidePinTooltip() {
    this.overlay?.querySelectorAll('.pin-tooltip').forEach(el => el.remove());
  }

  private highlightThreadInPanel(threadId: number, highlight: boolean) {
    const el = this.shadowRoot?.querySelector(`.thread-item[data-thread-id="${threadId}"]`);
    if (el) {
      if (highlight) el.classList.add('thread-highlight');
      else el.classList.remove('thread-highlight');
    }
  }

  // ── Bubble rendering on overlay ─────────────────────────────────

  private renderBubble(x: number, y: number, thread: Thread | null) {
    if (!this.overlay) return;

    const bubble = document.createElement('div');
    bubble.className = 'comment-bubble';
    bubble.style.left = x + '%';
    bubble.style.top = y + '%';
    // Prevent overlay click from closing bubble
    bubble.addEventListener('click', (e) => e.stopPropagation());

    if (this.namePromptMode) {
      // Name prompt
      bubble.innerHTML = `
        <div class="bubble-name-prompt">
          <p>Podaj swoje imi\u0119</p>
          <div class="bubble-name-row">
            <input type="text" class="bubble-name-input" placeholder="Twoje imi\u0119..." />
            <button class="btn btn-primary bubble-name-btn">OK</button>
          </div>
        </div>
      `;
      const input = bubble.querySelector('.bubble-name-input') as HTMLInputElement;
      const btn = bubble.querySelector('.bubble-name-btn')!;
      const submit = () => {
        const name = input.value.trim();
        if (name) {
          this.saveAuthorName(name);
          // Re-render to show comment form
          this.renderPins();
        }
      };
      btn.addEventListener('click', submit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submit();
      });
      setTimeout(() => input.focus(), 0);
    } else if (thread) {
      // Thread view — show comments + reply form
      let commentsHtml = thread.comments.map((c, idx) => `
        <div class="bubble-comment ${idx === 0 ? 'bubble-comment-original' : 'bubble-comment-reply'}">
          <div class="bubble-comment-header">
            <strong>${this.esc(c.author_name)}</strong>
            <span class="bubble-comment-time">${timeAgo(c.created_at)}</span>
          </div>
          <p>${this.esc(c.body)}</p>
        </div>
      `).join('');

      const isSubmitting = this.submitting;
      bubble.innerHTML = `
        <div class="bubble-thread">
          <div class="bubble-comments">${commentsHtml}</div>
          <div class="bubble-reply-form">
            <textarea class="bubble-textarea" placeholder="Odpowiedz..." rows="2" ${isSubmitting ? 'disabled' : ''}></textarea>
            <div class="bubble-reply-actions">
              <button class="btn btn-primary bubble-send-btn" ${isSubmitting ? 'disabled' : ''}>${isSubmitting ? 'Wysy\u0142anie...' : 'Wy\u015Blij'}</button>
              <button class="bubble-cancel-compose-btn">Anuluj</button>
            </div>
          </div>
          <div class="bubble-actions">
            <button class="bubble-resolve-btn">${thread.resolved ? 'Resolved' : 'Resolve'}</button>
            <button class="bubble-delete-btn">${this.confirmDeleteId === thread.id ? 'Sure?' : 'Delete'}</button>
            ${this.confirmDeleteId === thread.id ? '<button class="bubble-cancel-btn">Cancel</button>' : ''}
          </div>
        </div>
      `;

      const textarea = bubble.querySelector('.bubble-textarea') as HTMLTextAreaElement;
      const sendBtn = bubble.querySelector('.bubble-send-btn')!;
      sendBtn.addEventListener('click', () => {
        this.addComment(thread.id, textarea.value);
        textarea.value = '';
      });
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          this.addComment(thread.id, textarea.value);
          textarea.value = '';
        }
      });

      const cancelComposeBtn = bubble.querySelector('.bubble-cancel-compose-btn')!;
      cancelComposeBtn.addEventListener('click', () => {
        this.openThreadId = null;
        this.renderPins();
      });

      const resolveBtn = bubble.querySelector('.bubble-resolve-btn')!;
      resolveBtn.addEventListener('click', () => this.resolveThread(thread.id));

      const deleteBtn = bubble.querySelector('.bubble-delete-btn')!;
      deleteBtn.addEventListener('click', () => this.deleteThread(thread.id));

      const cancelBtn = bubble.querySelector('.bubble-cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => { this.confirmDeleteId = null; this.renderPins(); });
      }
    } else {
      // New thread compose form
      const isSubmitting = this.submitting;
      bubble.innerHTML = `
        <div class="bubble-compose">
          <textarea class="bubble-textarea" placeholder="Napisz komentarz..." rows="2" ${isSubmitting ? 'disabled' : ''}></textarea>
          <div class="bubble-compose-actions">
            <button class="btn btn-primary bubble-send-btn" ${isSubmitting ? 'disabled' : ''}>${isSubmitting ? 'Wysy\u0142anie...' : 'Wy\u015Blij'}</button>
            <button class="bubble-cancel-compose-btn">Anuluj</button>
          </div>
        </div>
      `;

      const textarea = bubble.querySelector('.bubble-textarea') as HTMLTextAreaElement;
      const sendBtn = bubble.querySelector('.bubble-send-btn')!;
      sendBtn.addEventListener('click', () => this.createThread(textarea.value));
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          this.createThread(textarea.value);
        }
      });

      const cancelBtn = bubble.querySelector('.bubble-cancel-compose-btn')!;
      cancelBtn.addEventListener('click', () => {
        this.activeCompose = null;
        this.renderPins();
      });

      setTimeout(() => textarea.focus(), 0);
    }

    this.overlay!.appendChild(bubble);
  }

  private esc(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Navigation (click thread in panel → scroll iframe to pin) ───

  // @axiom: comments.md#interakcja-pinów-z-wątkami
  private navigateToThread(thread: Thread) {
    if (thread.page_path !== this.pagePath) {
      // Switch page
      this.pagePath = thread.page_path;
      const pageSelect = document.getElementById('page-select') as HTMLSelectElement | null;
      if (pageSelect) pageSelect.value = thread.page_path;
      const viewer = document.getElementById('mock-viewer');
      const baseUrl = viewer?.dataset.baseUrl || '';
      if (this.iframe) {
        this.iframe.src = baseUrl + thread.page_path;
        this.iframe.addEventListener('load', () => {
          this.syncOverlay();
          setTimeout(() => {
            this.scrollIframeToPin(thread.x_pct, thread.y_pct);
            this.openThreadId = thread.id;
            this.activeCompose = null;
            this.renderPins();
          }, 100);
        }, { once: true });
      }
    } else {
      this.scrollIframeToPin(thread.x_pct, thread.y_pct);
      this.openThreadId = thread.id;
      this.activeCompose = null;
      this.renderPins();
    }
    // Highlight pin briefly
    setTimeout(() => {
      const pin = this.overlay?.querySelector(`.comment-pin[data-thread-id="${thread.id}"]`) as HTMLElement | null;
      if (pin) {
        pin.classList.add('pin-highlight');
        setTimeout(() => pin.classList.remove('pin-highlight'), 1500);
      }
    }, 200);
  }

  private scrollIframeToPin(x: number, y: number) {
    try {
      const doc = this.iframe?.contentDocument;
      if (!doc) return;
      const docW = doc.documentElement.scrollWidth;
      const docH = doc.documentElement.scrollHeight;
      const vpW = this.iframe!.clientWidth;
      const vpH = this.iframe!.clientHeight;
      const targetX = (x / 100) * docW - vpW / 2;
      const targetY = (y / 100) * docH - vpH / 2;
      doc.documentElement.scrollTo({ left: Math.max(0, targetX), top: Math.max(0, targetY), behavior: 'smooth' });
    } catch (_) {}
  }
  // /@axiom: comments.md#interakcja-pinów-z-wątkami

  // ── Render ──────────────────────────────────────────────────────

  updated() {
    this.renderPins();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 340px;
      min-width: 340px;
      background: #f9f9fb;
      border-left: 1px solid #e0e0e0;
      height: 100%;
      overflow: hidden;
    }

    .comments-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .comments-header {
      padding: 12px 16px 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .comments-header h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .comment-count {
      font-size: 13px;
      color: #888;
      margin-left: 8px;
    }

    .comments-view-toggle {
      display: flex;
      gap: 0;
      margin-bottom: 8px;
    }

    .toggle-btn {
      flex: 1;
      padding: 4px 12px;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .toggle-btn:first-child { border-radius: 4px 0 0 4px; }
    .toggle-btn:last-child { border-radius: 0 4px 4px 0; }
    .toggle-btn.active {
      background: #333;
      color: #fff;
      border-color: #333;
    }

    .hide-resolved-toggle {
      display: flex;
      gap: 0;
      margin-top: 4px;
    }

    .hide-toggle-btn {
      flex: 1;
      padding: 4px 12px;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .hide-toggle-btn:first-child { border-radius: 4px 0 0 4px; }
    .hide-toggle-btn:last-child { border-radius: 0 4px 4px 0; }
    .hide-toggle-btn.active {
      background: #333;
      color: #fff;
      border-color: #333;
    }

    .thread-list {
      padding: 0;
    }

    .thread-item {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background 0.15s;
    }
    .thread-item:hover, .thread-item.thread-highlight {
      background: #eef3ff;
    }

    .thread-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }

    .thread-pin-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ff4444;
      color: #fff;
      font-size: 11px;
      font-weight: bold;
    }

    .thread-author {
      font-weight: 600;
    }

    .thread-time {
      color: #999;
      font-size: 11px;
    }

    .thread-page {
      color: #999;
      font-size: 11px;
    }

    .thread-body {
      margin: 2px 0 0;
      font-size: 13px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .thread-reply-count {
      font-size: 11px;
      color: #888;
      margin-top: 2px;
    }

    .page-group-header {
      padding: 6px 16px;
      background: #eee;
      font-size: 12px;
      font-weight: 600;
      color: #555;
    }

    .resolved-section h4 {
      padding: 8px 16px 4px;
      margin: 0;
      font-size: 13px;
      color: #888;
    }

    .resolved-item {
      padding: 8px 16px;
      border-bottom: 1px solid #eee;
      opacity: 0.6;
      font-size: 13px;
    }

    .change-name-section {
      padding: 8px 16px;
      border-top: 1px solid #e0e0e0;
    }

    .btn-change-name {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 12px;
      padding: 0;
      text-decoration: underline;
    }
  `;

  render() {
    const visibleThreads = this.showAll
      ? this.threads
      : this.threads.filter(t => t.page_path === this.pagePath);

    const activeThreads = visibleThreads.filter(t => !t.resolved);
    const resolvedThreads = visibleThreads.filter(t => t.resolved);

    // Pin numbering: only active threads on current page
    const currentPageActive = this.threads.filter(t => t.page_path === this.pagePath && !t.resolved);
    const pinNumMap = new Map<number, number>();
    currentPageActive.forEach((t, idx) => pinNumMap.set(t.id, idx + 1));

    // Group by page when showAll
    const groupByPage = (threads: Thread[]) => {
      const pages = [...new Set(threads.map(t => t.page_path))];
      return pages.map(page => ({
        page,
        threads: threads.filter(t => t.page_path === page),
      }));
    };

    return html`
      <div class="comments-scroll">
        <div class="comments-header">
          <h3>Comments <span class="comment-count">${activeThreads.length}</span></h3>
          <div class="comments-view-toggle">
            <button class="toggle-btn ${!this.showAll ? 'active' : ''}"
              @click=${() => { this.showAll = false; }}>Ta strona</button>
            <button class="toggle-btn ${this.showAll ? 'active' : ''}"
              @click=${() => { this.showAll = true; }}>Wszystkie</button>
          </div>
          <div class="hide-resolved-toggle">
            <button class="hide-toggle-btn ${!this.hideResolved ? 'active' : ''}"
              @click=${() => { this.hideResolved = false; }}>Show resolved</button>
            <button class="hide-toggle-btn ${this.hideResolved ? 'active' : ''}"
              @click=${() => { this.hideResolved = true; }}>Hide resolved</button>
          </div>
        </div>

        <div class="thread-list">
          ${this.showAll
            ? groupByPage(activeThreads).map(g => html`
                <div class="comment-page-group">
                  <div class="page-group-header">${this.basename(g.page)}</div>
                  ${g.threads.map(t => this.renderThreadItem(t, pinNumMap.get(t.id)))}
                </div>
              `)
            : activeThreads.map(t => this.renderThreadItem(t, pinNumMap.get(t.id)))
          }
        </div>

        ${resolvedThreads.length > 0 && !this.hideResolved ? html`
          <div class="resolved-section">
            <h4>Resolved</h4>
            ${this.showAll
              ? groupByPage(resolvedThreads).map(g => html`
                  <div class="comment-page-group">
                    <div class="page-group-header">${this.basename(g.page)}</div>
                    ${g.threads.map(t => this.renderResolvedItem(t))}
                  </div>
                `)
              : resolvedThreads.map(t => this.renderResolvedItem(t))
            }
          </div>
        ` : nothing}
      </div>

      <div class="change-name-section">
        <button class="btn-change-name" id="change-name-btn"
          @click=${() => this.changeName()}>zmie\u0144 imi\u0119</button>
      </div>
    `;
  }

  private renderThreadItem(thread: Thread, pinNum: number | undefined) {
    const firstComment = thread.comments[0];
    const replyCount = thread.comments.length - 1;

    return html`
      <div class="thread-item" data-thread-id=${thread.id}
        @click=${() => this.navigateToThread(thread)}
        @mouseenter=${() => this.highlightPin(thread.id, true)}
        @mouseleave=${() => this.highlightPin(thread.id, false)}>
        <div class="thread-meta">
          ${pinNum ? html`<span class="thread-pin-num">${pinNum}</span>` : nothing}
          <span class="thread-author">${firstComment?.author_name || ''}</span>
          <span class="thread-time">${firstComment ? timeAgo(firstComment.created_at) : ''}</span>
          <span class="thread-page">${this.basename(thread.page_path)}</span>
        </div>
        <div class="thread-body">${firstComment?.body || ''}</div>
        ${replyCount > 0 ? html`<div class="thread-reply-count">${replyCount} ${replyCount === 1 ? 'odpowied\u017A' : 'odpowiedzi'}</div>` : nothing}
      </div>
    `;
  }

  private renderResolvedItem(thread: Thread) {
    const firstComment = thread.comments[0];
    return html`
      <div class="resolved-item">
        <strong>${firstComment?.author_name || ''}</strong>
        <span class="thread-time" style="margin-left: 8px; font-size: 11px;">${firstComment ? timeAgo(firstComment.created_at) : ''}</span>
        <p style="margin:2px 0 0">${firstComment?.body || ''}</p>
      </div>
    `;
  }

  private highlightPin(threadId: number, highlight: boolean) {
    const pin = this.overlay?.querySelector(`.comment-pin[data-thread-id="${threadId}"]`) as HTMLElement | null;
    if (pin) {
      if (highlight) pin.classList.add('pin-highlight');
      else pin.classList.remove('pin-highlight');
    }
  }

  private basename(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  }
}
// /@axiom: comments.md#komponent-lit-smock-comments
