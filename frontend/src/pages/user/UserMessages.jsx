import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Paperclip, CheckCheck, Clock, ShieldCheck, MoreVertical, Phone, Video } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    vendor: { name: 'Elite Motors Beverly Hills', initials: 'EM' },
    lastMessage: 'Your Rolls-Royce Ghost is confirmed for tomorrow 9 AM delivery.',
    time: '10:30 AM',
    unread: 2,
    online: true,
    vehicle: 'Rolls-Royce Ghost'
  },
  {
    id: '2',
    vendor: { name: 'Miami Supercars', initials: 'MS' },
    lastMessage: 'Thank you for choosing us! Here is the pre-inspection report.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    vehicle: 'Lamborghini Urus'
  },
  {
    id: '3',
    vendor: { name: 'Luxoria Support', initials: 'LS' },
    lastMessage: 'We have processed your refund for booking #BKG-9821.',
    time: 'Monday',
    unread: 0,
    online: true,
    vehicle: 'Concierge'
  }
];

const MOCK_MESSAGES = [
  { id: 'm1', text: 'Hello! I noticed you booked the Rolls-Royce Ghost for this weekend.', time: '10:15 AM', isOwn: false },
  { id: 'm2', text: 'Yes, that is correct. I am looking forward to it.', time: '10:20 AM', isOwn: true },
  { id: 'm3', text: 'Could you arrange delivery to the Beverly Hills Hotel?', time: '10:21 AM', isOwn: true },
  { id: 'm4', text: 'Absolutely. Your Rolls-Royce Ghost is confirmed for tomorrow 9 AM delivery. Our chauffeur will hand over the keys at the main lobby.', time: '10:30 AM', isOwn: false },
];

export default function UserMessages() {
  const [activeId, setActiveId] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const activeConversation = MOCK_CONVERSATIONS.find(c => c.id === activeId);
  const filteredConversations = MOCK_CONVERSATIONS.filter(c => 
    c.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-serif text-[#0F0F0F] tracking-tight mb-1">Inbox</h1>
          <p className="text-[12px] text-[#666666] tracking-wide">Secure communication with vendors and your concierge.</p>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="flex-1 bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0 relative">
        
        {/* Sidebar (Conversations List) */}
        <div className="w-full md:w-[340px] border-b md:border-b-0 md:border-r border-[#ECECEC] flex flex-col shrink-0 bg-[#FBFBFB]">
          
          <div className="h-[76px] px-4 border-b border-[#ECECEC] bg-white flex items-center shrink-0">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F5F5] border-none rounded-full pl-10 pr-4 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#999999] focus:outline-none focus:ring-1 focus:ring-[#C9A75D] transition-shadow"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[12px] text-[#666666]">No conversations found.</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all relative ${
                    activeId === conv.id 
                      ? 'bg-white shadow-sm border border-[#ECECEC]' 
                      : 'hover:bg-white border border-transparent'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {activeId === conv.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#C9A75D] rounded-r-full"></div>
                  )}

                  <div className="relative shrink-0 ml-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1A1A1A] to-[#333333] flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-[#C9A75D] text-sm font-bold tracking-wider">{conv.vendor.initials}</span>
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#16A34A] border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className={`text-[13px] truncate ${activeId === conv.id ? 'font-bold text-[#0F0F0F]' : 'font-semibold text-[#1A1A1A]'}`}>
                        {conv.vendor.name}
                      </h3>
                      <span className="text-[9px] font-bold text-[#999999] shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-[9px] font-bold text-[#C9A75D] uppercase tracking-widest mb-1 truncate">{conv.vehicle}</p>
                    <p className={`text-[12px] truncate ${conv.unread > 0 ? 'text-[#0F0F0F] font-semibold' : 'text-[#666666]'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unread > 0 && (
                    <div className="shrink-0 w-4 h-4 rounded-full bg-[#C9A75D] flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{conv.unread}</span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF]">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-[76px] px-6 border-b border-[#ECECEC] flex items-center justify-between bg-white shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-[#0F0F0F] flex items-center justify-center shadow-sm">
                      <span className="text-[#C9A75D] text-[13px] font-bold tracking-wider">{activeConversation.vendor.initials}</span>
                    </div>
                    {activeConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A] border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#0F0F0F] leading-tight">{activeConversation.vendor.name}</h2>
                    <p className="text-[12px] font-medium text-[#666666] mt-0.5">
                      {activeConversation.vehicle}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="p-2.5 text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] rounded-full transition-colors hidden sm:block">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 text-[#666666] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 bg-[#F8F9FA] relative">
                
                {/* Date Divider */}
                <div className="flex items-center justify-center my-6">
                  <div className="bg-[#E5E7EB]/70 px-3 py-1 rounded-full text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                    Today
                  </div>
                </div>

                {MOCK_MESSAGES.map((msg, idx) => {
                  const isLastInGroup = idx === MOCK_MESSAGES.length - 1 || MOCK_MESSAGES[idx + 1].isOwn !== msg.isOwn;
                  const isFirstInGroup = idx === 0 || MOCK_MESSAGES[idx - 1].isOwn !== msg.isOwn;
                  
                  return (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} ${isFirstInGroup && idx !== 0 ? 'mt-4' : ''}`}>
                      <div className={`flex items-end gap-2 max-w-[85%] lg:max-w-[70%] ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        {/* Avatar */}
                        {!msg.isOwn && (
                          <div className={`w-8 h-8 rounded-full bg-[#0F0F0F] flex items-center justify-center shrink-0 shadow-sm ${isLastInGroup ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-[#C9A75D] text-[10px] font-bold">{activeConversation.vendor.initials}</span>
                          </div>
                        )}

                        <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`px-4 py-2.5 min-w-[110px] max-w-full rounded-[20px] ${
                              msg.isOwn 
                                ? 'bg-[#0F0F0F] text-white shadow-sm' 
                                : 'bg-white border border-[#E5E7EB] text-[#1A1A1A] shadow-sm'
                            } ${
                              isLastInGroup && msg.isOwn ? 'rounded-br-[4px]' : ''
                            } ${
                              isLastInGroup && !msg.isOwn ? 'rounded-bl-[4px]' : ''
                            }`}
                          >
                            <div className="flex flex-col">
                              <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>
                              <div className={`flex items-center self-end gap-1 mt-1 ${msg.isOwn ? 'text-[#999999]' : 'text-[#999999]'}`}>
                                <span className="text-[10px] font-medium">{msg.time}</span>
                                {msg.isOwn && <CheckCheck className="w-4 h-4 text-[#C9A75D]" />}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="px-4 py-4 bg-white border-t border-[#ECECEC] shrink-0">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <button className="p-3 text-[#999999] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] rounded-xl transition-colors shrink-0 mb-0.5">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-[#FBFBFB] border border-[#ECECEC] rounded-2xl flex items-end focus-within:bg-white transition-all">
                    <textarea 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="flex-1 max-h-32 min-h-[52px] bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] text-[#0F0F0F] placeholder-[#999999] resize-none py-3.5 px-5"
                      rows="1"
                      onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey && inputMessage.trim()) {
                          e.preventDefault();
                          setInputMessage('');
                        }
                      }}
                    />
                  </div>
                  <button 
                    disabled={!inputMessage.trim()}
                    className="p-3.5 rounded-xl bg-[#0F0F0F] text-white disabled:bg-[#F5F5F5] disabled:text-[#CCCCCC] hover:bg-[#C9A75D] hover:shadow-lg transition-all shrink-0 mb-0.5"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAFAFA]">
              <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-[#ECECEC]" />
              </div>
              <h2 className="text-[16px] font-bold text-[#0F0F0F] mb-2">Select a Conversation</h2>
              <p className="text-[13px] text-[#666666] text-center max-w-sm">
                Choose an active chat from the sidebar to view your messages and communicate with vendors.
              </p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
