'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Chatbot.module.css';

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

import { Brain, Bot, Zap } from 'lucide-react';

const SUGGESTIONS = [
  { icon: <Brain size={14} />, text: 'Tuấn có kinh nghiệm gì?' },
  { icon: <Bot size={14} />, text: 'Bài viết về AI Engineer' },
  { icon: <Zap size={14} />, text: 'LLMOps là gì?' },
];

const DEFAULT_SIZE = { w: 370, h: 540 };
const MIN_W = 280, MAX_W = 640, MIN_H = 360, MAX_H = 820;

// ── Subcomponents ─────────────────────────────────────────────────────────────
function MessageItem({ m }: { m: Message }) {
  return (
    <div className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.assistantRow}`}>
      {m.role === 'assistant' && (
        <div className={`${styles.avatarBot} ${m.error ? styles.avatarError : ''}`}>
          {m.error ? <AlertCircle size={12} /> : <BrainIcon />}
        </div>
      )}
      <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant} ${m.error ? styles.bubbleError : ''}`}>
        {m.content === '' ? (
          <span className={styles.typingDots}><span /><span /><span /></span>
        ) : m.role === 'assistant' ? (
          <div className={styles.mdContent}>
            <ReactMarkdown components={{
              p: ({node, ...props}) => <p className={styles.mdPara} {...props} />,
              ul: ({node, ...props}) => <ul className={styles.mdList} {...props} />,
              a: ({node, ...props}) => <a className={styles.mdLink} {...props} />
            }}>
              {m.content}
            </ReactMarkdown>
          </div>
        ) : m.content}
      </div>
      {m.role === 'user' && (
        <div className={styles.avatarUser}><UserIcon /></div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
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
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // Global mouse/touch handlers for both drag & resize
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (dragging.current) {
        setPos({
          x: dragOrigin.current.px + (clientX - dragOrigin.current.mx),
          y: dragOrigin.current.py + (clientY - dragOrigin.current.my),
        });
      }
      if (resizing.current) {
        const dw = clientX - resizeOrigin.current.mx;
        const dh = clientY - resizeOrigin.current.my;
        setSize({
          w: Math.min(MAX_W, Math.max(MIN_W, resizeOrigin.current.w + dw)),
          h: Math.min(MAX_H, Math.max(MIN_H, resizeOrigin.current.h + dh)),
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

    const onUp = () => {
      dragging.current  = false;
      resizing.current  = false;
      document.body.style.userSelect = '';
      document.body.style.cursor     = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  // Drag handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    dragging.current = true;
    dragOrigin.current = { mx: clientX, my: clientY, px: pos.x, py: pos.y };
    document.body.style.userSelect = 'none';
  };

  const onHeaderMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const onHeaderTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);

  // Resize handler
  const handleResizeStart = (clientX: number, clientY: number, e: React.UIEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeOrigin.current = { mx: clientX, my: clientY, w: size.w, h: size.h };
    document.body.style.userSelect = 'none';
    document.body.style.cursor     = 'nwse-resize';
  };

  const onResizeMouseDown = (e: React.MouseEvent) => handleResizeStart(e.clientX, e.clientY, e);
  const onResizeTouchStart = (e: React.TouchEvent) => handleResizeStart(e.touches[0].clientX, e.touches[0].clientY, e);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

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
            onTouchStart={onHeaderTouchStart}
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
              onTouchStart={e => e.stopPropagation()}
              aria-label="Close chat"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            {messages.map((m) => (
              <MessageItem key={m.id} m={m} />
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
              <TextareaAutosize
                ref={inputRef}
                className={styles.inputField}
                minRows={1}
                maxRows={4}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi gì đó về Tuấn..."
                disabled={isLoading}
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
            onTouchStart={onResizeTouchStart}
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
