'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import styles from './Chatbot.module.css';

// ── Lightweight markdown renderer ─────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    const emMatch = part.match(/^\*([^*]+)\*$/);
    if (emMatch) return <em key={i}>{emMatch[1]}</em>;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch)
      return <a key={i} href={linkMatch[2]} className={styles.mdLink}>{linkMatch[1]}</a>;
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;
  const flushList = () => {
    if (listItems.length) {
      nodes.push(
        <ul key={key++} className={styles.mdList}>
          {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ul>
      );
      listItems = [];
    }
  };
  for (const line of lines) {
    const listMatch = line.match(/^[*\-]\s+(.+)/);
    if (listMatch) { listItems.push(listMatch[1]); continue; }
    flushList();
    if (line.trim() === '') { nodes.push(<br key={key++} />); continue; }
    nodes.push(<p key={key++} className={styles.mdPara}>{renderInline(line)}</p>);
  }
  flushList();
  return nodes;
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const BrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
  </svg>
);

const SparkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#3b82f6"/>
      </linearGradient>
    </defs>
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z" fill="url(#sparkGrad)"/>
    <circle cx="12" cy="12" r="2" fill="white" opacity="0.7"/>
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
};

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content: 'Chào bạn! Mình là **Bravee AI** — trợ lý thông minh của Tuấn Nguyễn Đình.\n\nBạn có thể hỏi mình về:\n* Kinh nghiệm & kỹ năng của Tuấn\n* Các bài viết về AI Engineer\n* Series LLMOps, RAG, AI Agents',
};

const SUGGESTIONS = [
  { icon: '🧠', text: 'Tuấn có kinh nghiệm gì?' },
  { icon: '🤖', text: 'Bài viết về AI Engineer' },
  { icon: '⚡', text: 'LLMOps là gì?' },
];

const DEFAULT_SIZE = { w: 370, h: 540 };
const MIN_W = 280, MAX_W = 640, MIN_H = 360, MAX_H = 820;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Drag
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging   = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  // Resize
  const [size, setSize] = useState(DEFAULT_SIZE);
  const resizing      = useRef(false);
  const resizeOrigin  = useRef({ mx: 0, my: 0, w: DEFAULT_SIZE.w, h: DEFAULT_SIZE.h });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // Global mouse handlers for both drag & resize
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        setPos({
          x: dragOrigin.current.px + (e.clientX - dragOrigin.current.mx),
          y: dragOrigin.current.py + (e.clientY - dragOrigin.current.my),
        });
      }
      if (resizing.current) {
        const dw = e.clientX - resizeOrigin.current.mx;
        const dh = e.clientY - resizeOrigin.current.my;
        setSize({
          w: Math.min(MAX_W, Math.max(MIN_W, resizeOrigin.current.w + dw)),
          h: Math.min(MAX_H, Math.max(MIN_H, resizeOrigin.current.h + dh)),
        });
      }
    };
    const onUp = () => {
      dragging.current  = false;
      resizing.current  = false;
      document.body.style.userSelect = '';
      document.body.style.cursor     = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  // Drag handlers
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    document.body.style.userSelect = 'none';
  };

  // Resize handler (bottom-right corner)
  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeOrigin.current = { mx: e.clientX, my: e.clientY, w: size.w, h: size.h };
    document.body.style.userSelect = 'none';
    document.body.style.cursor     = 'nwse-resize';
  };

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    const assistantId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Có lỗi xảy ra. Vui lòng thử lại.' }));
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: data.error || 'Có lỗi xảy ra.', error: true } : m));
        return;
      }
      const reader  = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';
      if (!reader) throw new Error('No response body');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          if (line.startsWith('0:')) {
            try {
              full += JSON.parse(line.slice(2));
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full } : m));
            } catch { /* skip */ }
          }
        }
      }
      if (!full) setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: 'Không có phản hồi. Vui lòng thử lại.', error: true } : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '❌ Không thể kết nối AI. Thử lại nhé!', error: true } : m));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const containerStyle = {
    transform: (pos.x !== 0 || pos.y !== 0) ? `translate(${pos.x}px, ${pos.y}px)` : undefined,
  };

  return (
    <div className={styles.chatbotContainer} style={containerStyle}>
      {isOpen && (
        <div
          className={styles.chatbotWindow}
          style={{ width: size.w, height: size.h }}
        >
          {/* Header — drag handle */}
          <div
            className={styles.chatbotHeader}
            onMouseDown={onHeaderMouseDown}
          >
            <div className={styles.headerInfo}>
              <div className={styles.botAvatarHeader}>
                <BrainIcon />
                <span className={styles.onlineDot} />
              </div>
              <div>
                <h3 className={styles.headerName}>Bravee AI</h3>
                <p className={styles.headerSub}>✦ Trợ lý thông minh · Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              onMouseDown={e => e.stopPropagation()}
              aria-label="Close chat"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            {messages.map((m) => (
              <div key={m.id} className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.assistantRow}`}>
                {m.role === 'assistant' && (
                  <div className={`${styles.avatarBot} ${m.error ? styles.avatarError : ''}`}>
                    {m.error ? <AlertCircle size={12} /> : <BrainIcon />}
                  </div>
                )}
                <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant} ${m.error ? styles.bubbleError : ''}`}>
                  {m.content === '' ? (
                    <span className={styles.typingDots}><span /><span /><span /></span>
                  ) : m.role === 'assistant' ? (
                    <div className={styles.mdContent}>{renderMarkdown(m.content)}</div>
                  ) : m.content}
                </div>
                {m.role === 'user' && (
                  <div className={styles.avatarUser}><UserIcon /></div>
                )}
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div className={styles.suggestions}>
                {SUGGESTIONS.map(s => (
                  <button key={s.text} className={styles.chip} onClick={() => sendMessage(s.text)}>
                    <span>{s.icon}</span> {s.text}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                className={styles.inputField}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Hỏi gì đó về Tuấn..."
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={styles.sendBtn}
                aria-label="Send"
              >
                {isLoading ? <Loader2 size={15} className={styles.spin} /> : <Send size={15} />}
              </button>
            </div>
          </form>

          {/* Resize handle — bottom-right corner */}
          <div
            className={styles.resizeHandle}
            onMouseDown={onResizeMouseDown}
            title="Kéo để thay đổi kích thước"
          />
        </div>
      )}

      {/* FAB */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className={styles.fabButton} aria-label="Open AI chat">
          <SparkIcon />
        </button>
      )}
    </div>
  );
}
