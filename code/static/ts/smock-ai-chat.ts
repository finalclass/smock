// @axiom: mock-builder.md#komponent-smock-ai-chat
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ── Types ───────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
  contentType: 'text' | 'thinking' | 'tool_use' | 'tool_result' | 'error';
  toolName: string;
  sequence: number;
}

// ── Simple markdown renderer ────────────────────────────────────────

function renderMarkdown(text: string): string {
  let out = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks
  out = out.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Headers
  out = out.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  out = out.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  out = out.replace(/^# (.+)$/gm, '<h2>$1</h2>');
  // Lists
  out = out.replace(/^- (.+)$/gm, '<li>$1</li>');
  out = out.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Line breaks
  out = out.replace(/\n/g, '<br>');
  return out;
}

// ── Component ───────────────────────────────────────────────────────

@customElement('smock-ai-chat')
export class SmockAiChat extends LitElement {
  // @axiom: mock-builder.md#stan-komponentu
  @property({ type: Number, attribute: 'project-id' }) projectId = 0;
  @property({ type: Number, attribute: 'mock-id' }) mockId = 0;
  @property({ type: String, attribute: 'session-id' }) sessionId = '';
  @property({ type: String, attribute: 'mock-name' }) mockName = '';

  @state() messages: Message[] = [];
  @state() inputText = '';
  @state() isProcessing = false;
  @state() isConnected = false;
  @state() thinkingContent = '';
  // /@axiom: mock-builder.md#stan-komponentu

  private eventSource: EventSource | null = null;
  private lastSequence = 0;
  private autoScroll = true;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // ── Lifecycle ───────────────────────────────────────────────────

  // @axiom: mock-builder.md#inicjalizacja-i-sesja
  connectedCallback() {
    super.connectedCallback();
    if (this.sessionId) {
      this.loadHistory();
      this.connectSSE();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.closeSSE();
  }

  private async loadHistory() {
    try {
      const res = await fetch(`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/messages?after=${this.lastSequence}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          for (const msg of data) {
            this.addOrUpdateMessage(msg);
          }
        }
      }
    } catch (e) {
      console.error('[smock-ai-chat] Failed to load history:', e);
    }
  }
  // /@axiom: mock-builder.md#inicjalizacja-i-sesja

  // ── SSE Connection ────────────────────────────────────────────

  // @axiom: mock-builder.md#obsługa-sse-stream
  private connectSSE() {
    if (!this.sessionId) return;
    this.closeSSE();

    const url = `/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/stream`;
    this.eventSource = new EventSource(url);
    this.isConnected = true;
    this.reconnectAttempts = 0;

    this.eventSource.addEventListener('status', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.processing !== undefined) {
          this.isProcessing = data.processing;
          if (!data.processing && this.thinkingContent) {
            this.thinkingContent = '';
          }
        }
      } catch (_) {}
    });

    this.eventSource.addEventListener('message', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        this.handleStreamMessage(data);
      } catch (_) {}
    });

    this.eventSource.addEventListener('closed', () => {
      this.isConnected = false;
      this.closeSSE();
    });

    this.eventSource.onerror = () => {
      this.isConnected = false;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.loadHistory();
          this.connectSSE();
        }, 3000);
      }
    };
  }

  private closeSSE() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private handleStreamMessage(data: any) {
    const { contentType, content, toolName, sequence } = data;
    if (sequence) this.lastSequence = Math.max(this.lastSequence, sequence);

    switch (contentType) {
      case 'thinking':
        this.thinkingContent += content || '';
        this.addOrUpdateThinking();
        break;
      case 'text': {
        if (this.thinkingContent) {
          this.thinkingContent = '';
        }
        const last = this.messages[this.messages.length - 1];
        if (last && last.role === 'assistant' && last.contentType === 'text') {
          last.content += content || '';
          this.messages = [...this.messages];
        } else {
          this.messages = [...this.messages, {
            role: 'assistant', content: content || '', contentType: 'text',
            toolName: '', sequence: sequence || 0
          }];
        }
        break;
      }
      case 'tool_use':
        this.messages = [...this.messages, {
          role: 'assistant', content: content || '', contentType: 'tool_use',
          toolName: toolName || '', sequence: sequence || 0
        }];
        break;
      case 'tool_result':
        this.messages = [...this.messages, {
          role: 'assistant', content: content || '', contentType: 'tool_result',
          toolName: '', sequence: sequence || 0
        }];
        this.checkMockUpdated(content || '');
        break;
      case 'error':
        this.messages = [...this.messages, {
          role: 'assistant', content: content || '', contentType: 'error',
          toolName: '', sequence: sequence || 0
        }];
        break;
    }
    this.scrollToBottomIfNeeded();
  }

  private addOrUpdateThinking() {
    const last = this.messages[this.messages.length - 1];
    if (last && last.contentType === 'thinking') {
      last.content = this.thinkingContent;
      this.messages = [...this.messages];
    } else {
      this.messages = [...this.messages, {
        role: 'assistant', content: this.thinkingContent, contentType: 'thinking',
        toolName: '', sequence: 0
      }];
    }
    this.scrollToBottomIfNeeded();
  }

  private addOrUpdateMessage(msg: any) {
    if (msg.sequence && msg.sequence <= this.lastSequence) return;
    if (msg.sequence) this.lastSequence = msg.sequence;
    this.messages = [...this.messages, {
      role: msg.role || 'assistant',
      content: msg.content || '',
      contentType: msg.contentType || 'text',
      toolName: msg.toolName || '',
      sequence: msg.sequence || 0
    }];
  }
  // /@axiom: mock-builder.md#obsługa-sse-stream

  // @axiom: mock-builder.md#odświeżanie-podglądu-mocka
  private checkMockUpdated(content: string) {
    if (content.includes('slug') || content.includes('file_count') || content.includes('upload')) {
      try {
        const data = JSON.parse(content);
        if (data.slug) {
          this.dispatchEvent(new CustomEvent('mock-updated', {
            detail: { mockId: data.id || this.mockId, slug: data.slug, entryFile: data.entry_file },
            bubbles: true, composed: true
          }));
          if (!this.mockId && data.id) {
            this.mockId = data.id;
          }
        }
      } catch (_) {}
    }
  }
  // /@axiom: mock-builder.md#odświeżanie-podglądu-mocka

  // ── Sending messages ──────────────────────────────────────────

  // @axiom: mock-builder.md#pole-wprowadzania-wiadomości
  private async sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.isProcessing) return;

    // Optimistic update
    this.messages = [...this.messages, {
      role: 'user', content: text, contentType: 'text', toolName: '', sequence: 0
    }];
    this.inputText = '';
    this.isProcessing = true;
    this.scrollToBottomIfNeeded();

    // Reset textarea height
    const textarea = this.shadowRoot?.querySelector('.chat-textarea') as HTMLTextAreaElement;
    if (textarea) textarea.style.height = '';

    try {
      // Create session if needed
      if (!this.sessionId) {
        const nameInput = document.getElementById('mock-name-input') as HTMLInputElement;
        const mockName = nameInput?.value?.trim() || this.mockName || 'Untitled';
        const res = await fetch(`/api/projects/${this.projectId}/ai/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: mockName, mockId: this.mockId || null }),
        });
        if (!res.ok) throw new Error('Failed to create session');
        const data = await res.json();
        this.sessionId = data.sessionId;
        if (data.mockId) this.mockId = data.mockId;
        this.connectSSE();
      }

      // Send message
      await fetch(`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
    } catch (e) {
      console.error('[smock-ai-chat] Send failed:', e);
      this.messages = [...this.messages, {
        role: 'assistant', content: 'Błąd wysyłania wiadomości', contentType: 'error',
        toolName: '', sequence: 0
      }];
      this.isProcessing = false;
    }
  }

  private async stopProcessing() {
    if (!this.sessionId) return;
    try {
      await fetch(`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error('[smock-ai-chat] Stop failed:', e);
    }
  }
  // /@axiom: mock-builder.md#pole-wprowadzania-wiadomości

  // ── Auto-scroll ───────────────────────────────────────────────

  // @axiom: mock-builder.md#auto-scroll
  private handleScroll(e: Event) {
    const el = e.target as HTMLElement;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distFromBottom > 100) {
      this.autoScroll = false;
    } else if (distFromBottom < 50) {
      this.autoScroll = true;
    }
  }

  private scrollToBottomIfNeeded() {
    if (!this.autoScroll) return;
    requestAnimationFrame(() => {
      const container = this.shadowRoot?.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
  // /@axiom: mock-builder.md#auto-scroll

  updated() {
    this.scrollToBottomIfNeeded();
  }

  // ── Styles ────────────────────────────────────────────────────

  // @axiom: mock-builder.md#stylizacja-czatu
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 420px;
      flex-shrink: 0;
      border-left: 1px solid var(--border, #e5e7eb);
      background: var(--bg, #fafafa);
      height: 100%;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .chat-header {
      padding: 12px 16px;
      background: #f3f4f6;
      border-bottom: 1px solid var(--border, #e5e7eb);
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      gap: 12px;
      display: flex;
      flex-direction: column;
      scroll-behavior: smooth;
    }

    .msg {
      max-width: 80%;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .msg-user {
      align-self: flex-end;
      background: var(--accent, #2563eb);
      color: #fff;
      border-radius: 12px 12px 0 12px;
      white-space: pre-wrap;
    }

    .msg-text {
      align-self: flex-start;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 12px 12px 12px 0;
    }
    .msg-text pre {
      background: #f3f4f6;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.8rem;
    }
    .msg-text code {
      background: #f3f4f6;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.85em;
    }
    .msg-text pre code {
      background: none;
      padding: 0;
    }

    .msg-thinking {
      align-self: flex-start;
      max-width: 90%;
    }
    .msg-thinking summary {
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--muted, #6b7280);
      font-style: italic;
      padding: 6px 10px;
      background: #f3f0ff;
      border-radius: 8px;
    }
    .msg-thinking .thinking-content {
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--muted, #6b7280);
      padding: 8px 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    .thinking-pulse {
      animation: pulse 1.5s infinite;
    }

    .msg-tool-use, .msg-tool-result {
      align-self: flex-start;
      max-width: 90%;
      background: #f5f5f5;
      font-size: 0.8rem;
      border-radius: 6px;
      padding: 0;
    }
    .msg-tool-use summary, .msg-tool-result summary {
      cursor: pointer;
      padding: 6px 10px;
      font-size: 0.8rem;
    }
    .tool-content {
      padding: 8px 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 0.75rem;
    }

    .msg-error {
      align-self: flex-start;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      border-radius: 8px;
    }

    .processing-indicator {
      display: flex;
      gap: 4px;
      padding: 8px 16px;
      align-self: flex-start;
    }
    @keyframes dot-pulse {
      0%, 100% { transform: scale(0.4); opacity: 0.4; }
      50% { transform: scale(1); opacity: 1; }
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--muted, #6b7280);
    }
    .dot:nth-child(1) { animation: dot-pulse 1.2s 0s infinite; }
    .dot:nth-child(2) { animation: dot-pulse 1.2s 0.2s infinite; }
    .dot:nth-child(3) { animation: dot-pulse 1.2s 0.4s infinite; }

    .chat-input-area {
      flex-shrink: 0;
      border-top: 1px solid var(--border, #e5e7eb);
      padding: 12px;
      background: var(--bg, #fafafa);
      position: relative;
    }

    .input-wrapper {
      position: relative;
    }

    .chat-textarea {
      width: 100%;
      min-height: 44px;
      max-height: 200px;
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 12px;
      padding: 10px 44px 10px 12px;
      font-size: 0.9rem;
      font-family: inherit;
      resize: none;
      outline: none;
      box-sizing: border-box;
    }
    .chat-textarea:focus {
      border-color: var(--accent, #2563eb);
    }
    .chat-textarea::placeholder {
      color: var(--muted, #6b7280);
    }

    .btn-send, .btn-stop {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-send {
      background: var(--accent, #2563eb);
      color: #fff;
    }
    .btn-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-send svg, .btn-stop svg {
      width: 16px;
      height: 16px;
    }
    .btn-stop {
      background: var(--danger, #dc2626);
      color: #fff;
    }

    .reconnecting {
      padding: 4px 16px;
      font-size: 0.75rem;
      color: var(--warning, #d97706);
      text-align: center;
    }

    .welcome {
      padding: 24px 16px;
      text-align: center;
      color: var(--muted, #6b7280);
      font-size: 0.9rem;
    }
  `;
  // /@axiom: mock-builder.md#stylizacja-czatu

  // ── Render ────────────────────────────────────────────────────

  // @axiom: mock-builder.md#renderowanie-wiadomości
  render() {
    const hasMessages = this.messages.length > 0;

    return html`
      <div class="chat-header">
        <span>\u{1F916}</span> AI Chat
      </div>

      <div class="chat-messages" @scroll=${this.handleScroll}>
        ${!hasMessages && !this.sessionId ? html`
          <div class="welcome">
            Opisz mockup, kt\u00F3ry chcesz stworzy\u0107. AI wygeneruje pliki HTML/CSS/JS.
          </div>
        ` : nothing}

        ${this.messages.map(msg => this.renderMessage(msg))}

        ${this.isProcessing && !this.isActiveStreaming() ? html`
          <div class="processing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        ` : nothing}
      </div>

      ${!this.isConnected && this.sessionId && this.reconnectAttempts > 0 ? html`
        <div class="reconnecting">Reconnecting...</div>
      ` : nothing}

      <div class="chat-input-area">
        <div class="input-wrapper">
          <textarea
            class="chat-textarea"
            placeholder="Opisz co chcesz zmieni\u0107..."
            .value=${this.inputText}
            @input=${this.handleInput}
            @keydown=${this.handleKeydown}
          ></textarea>
          ${this.isProcessing ? html`
            <button class="btn-stop" @click=${this.stopProcessing} title="Stop">
              <svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10" rx="1"/></svg>
            </button>
          ` : html`
            <button
              class="btn-send"
              @click=${this.sendMessage}
              ?disabled=${!this.inputText.trim()}
              title="Wy\u015Blij (Ctrl+Enter)"
            >
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2L8 14M8 2L3 7M8 2L13 7"/><path d="M8 2L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 7L8 2L13 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </button>
          `}
        </div>
      </div>
    `;
  }

  private renderMessage(msg: Message) {
    switch (msg.contentType) {
      case 'text':
        if (msg.role === 'user') {
          return html`<div class="msg msg-user">${msg.content}</div>`;
        }
        return html`<div class="msg msg-text" .innerHTML=${renderMarkdown(msg.content)}></div>`;

      case 'thinking': {
        const isActive = this.isProcessing && this.messages[this.messages.length - 1] === msg;
        return html`
          <details class="msg-thinking" ?open=${isActive}>
            <summary class=${isActive ? 'thinking-pulse' : ''}>My\u015Blenie...</summary>
            <div class="thinking-content">${msg.content}</div>
          </details>
        `;
      }

      case 'tool_use':
        return html`
          <details class="msg-tool-use">
            <summary>\u{1F527} ${msg.toolName || 'Tool'}</summary>
            <div class="tool-content">${msg.content.substring(0, 2000)}</div>
          </details>
        `;

      case 'tool_result':
        return html`
          <details class="msg-tool-result">
            <summary>\u2713 Result</summary>
            <div class="tool-content">${msg.content.substring(0, 2000)}</div>
          </details>
        `;

      case 'error':
        return html`<div class="msg msg-error">${msg.content}</div>`;

      default:
        return nothing;
    }
  }
  // /@axiom: mock-builder.md#renderowanie-wiadomości

  private isActiveStreaming(): boolean {
    if (this.messages.length === 0) return false;
    const last = this.messages[this.messages.length - 1];
    return last.role === 'assistant' && (last.contentType === 'text' || last.contentType === 'thinking');
  }

  private handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.inputText = textarea.value;
    // Auto-resize
    textarea.style.height = '';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      this.sendMessage();
    }
  }
}
// /@axiom: mock-builder.md#komponent-smock-ai-chat
