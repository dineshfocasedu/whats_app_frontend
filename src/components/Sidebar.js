import { useState, useEffect } from 'react';
import { getContacts, deleteChat } from '../services/api';
import './Sidebar.css';

export default function Sidebar({ activePhone, onSelect }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const fetchContacts = async (q = '') => {
    try {
      const { data } = await getContacts(q);
      setContacts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchContacts(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async (e, phone) => {
    e.stopPropagation();
    if (!window.confirm(`Delete chat for +${phone}?`)) return;
    await deleteChat(phone);
    fetchContacts(search);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="avatar header-avatar">W</div>
        <span className="header-title">WATI Chats</span>
      </div>

      <div className="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search by phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {contacts.length === 0 ? (
          <div className="empty-list">
            {search ? 'No results found' : 'No chats found'}
          </div>
        ) : (
          contacts.map((c) => (
            <div
              key={c.phone}
              className={`contact-item${activePhone === c.phone ? ' active' : ''}`}
              onClick={() => onSelect(c.phone)}
            >
              <div className="avatar">{c.phone.slice(-2)}</div>
              <div className="contact-info">
                <div className="contact-name">+{c.phone}</div>
                <div className="contact-preview">{c.lastMessage || 'No messages'}</div>
              </div>
              <div className="contact-right">
                <div className="msg-count">{c.messageCount}</div>
                <button className="del-btn" onClick={(e) => handleDelete(e, c.phone)} title="Delete">✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
