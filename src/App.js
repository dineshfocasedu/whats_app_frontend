import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

export default function App() {
  const [activePhone, setActivePhone] = useState(null);

  return (
    <div className={`app-container${activePhone ? ' chat-active' : ''}`}>
      <Sidebar activePhone={activePhone} onSelect={setActivePhone} />
      <ChatWindow phone={activePhone} onBack={() => setActivePhone(null)} />
    </div>
  );
}
