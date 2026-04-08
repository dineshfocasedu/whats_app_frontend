import { useEffect, useRef, useState } from 'react';
import { getChatByPhone } from '../services/api';
import './ChatWindow.css';

export default function ChatWindow({ phone, onBack }) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    if (!phone) return;
    setLoading(true);
    setError('');
    getChatByPhone(phone)
      .then(({ data }) => setChat(data))
      .catch(() => setError('Failed to load chat.'))
      .finally(() => setLoading(false));
  }, [phone]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView();
  }, [chat]);

  if (!phone) return <EmptyState />;
  if (loading) return <div className="chat-loading">Loading...</div>;
  if (error) return <div className="chat-loading" style={{ color: '#e74c3c' }}>{error}</div>;
  if (!chat) return null;

  let lastDate = '';
  const grouped = [];
  for (const msg of chat.messages) {
    const dateStr = msg.time ? msg.time.split(' ')[0] : '';
    if (dateStr !== lastDate) {
      grouped.push({ type: 'date', label: dateStr });
      lastDate = dateStr;
    }
    grouped.push({ type: 'msg', msg });
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="avatar chat-avatar">{phone.slice(-2)}</div>
        <div>
          <div className="chat-header-name">+{phone}</div>
          <div className="chat-header-sub">{chat.messageCount} messages</div>
        </div>
      </div>

      <div className="legend">
        <span><span className="dot user-dot" /> User (incoming)</span>
        <span><span className="dot bot-dot" /> Bot / Agent (outgoing)</span>
        <span><span className="dot sys-dot" /> System</span>
      </div>

      <div className="messages">
        {grouped.map((item, i) => {
          if (item.type === 'date') {
            return (
              <div key={`d-${i}`} className="date-sep">
                <span>{item.label}</span>
              </div>
            );
          }
          const { msg } = item;
          const timeOnly = msg.time ? msg.time.split(' ')[1]?.slice(0, 5) : '';

          if (msg.type === 'system') {
            return (
              <div key={i} className="msg-row system">
                <div className="bubble system-bubble">
                  {msg.text}
                  <span className="time">{timeOnly}</span>
                </div>
              </div>
            );
          }

          const side = msg.type === 'outgoing' ? 'outgoing' : 'incoming';
          return (
            <div key={i} className={`msg-row ${side}`}>
              <div className="bubble-wrap">
                {msg.sender && msg.sender !== 'Bot' && (
                  <div className={`sender-label ${side}`}>{msg.sender}</div>
                )}
                <div className={`bubble ${side}-bubble`}>
                  <span className="bubble-text">{msg.text}</span>
                  <span className="time">{timeOnly}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="40" fill="#25D366" opacity="0.12" />
        <path d="M40 55c8.284 0 15-6.716 15-15s-6.716-15-15-15-15 6.716-15 15c0 2.756.745 5.338 2.046 7.553L25 55l7.447-2.046A14.95 14.95 0 0 0 40 55z" fill="#25D366" opacity="0.3" />
      </svg>
      <p>Select a contact to view chat</p>
      <p style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Select a contact from the sidebar to get started</p>
    </div>
  );
}
