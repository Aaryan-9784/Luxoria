import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, ShieldCheck, Trash2, CheckCircle2, Lock } from 'lucide-react';

const MOCK_CARDS = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '5555', expiry: '08/26', isDefault: false }
];

export default function PaymentsDashboard() {
  const [cards, setCards] = useState(MOCK_CARDS);

  const handleSetDefault = (id) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
  };

  const handleDelete = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Payment Methods</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Manage your saved cards and payment preferences securely.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#0F0F0F] text-white px-6 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] transition-colors shadow-sm group">
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Add New Card
        </button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-[#ECECEC] border-dashed rounded-2xl shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-[#C9A75D] opacity-60" />
          </div>
          <h2 className="text-2xl font-serif text-[#0F0F0F] mb-3">No Saved Cards</h2>
          <p className="text-[14px] text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
            Add a credit or debit card for faster checkout on your future luxury rentals.
          </p>
          <button className="flex items-center gap-2 bg-[#0F0F0F] text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#C9A75D] hover:shadow-lg transition-all">
             Add Payment Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`relative bg-white border ${card.isDefault ? 'border-[#C9A75D]' : 'border-[#ECECEC]'} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group overflow-hidden`}
              >
                {/* Default Badge */}
                {card.isDefault && (
                  <div className="absolute top-0 right-0 bg-[#C9A75D] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                    Default
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-8 bg-[#F5F5F5] rounded flex items-center justify-center border border-[#ECECEC]">
                    <CreditCard className={`w-5 h-5 ${card.brand === 'Visa' ? 'text-blue-700' : 'text-red-500'}`} />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!card.isDefault && (
                      <button onClick={() => handleSetDefault(card.id)} className="p-1.5 rounded-lg text-[#666666] hover:text-[#16A34A] hover:bg-[#F5F5F5] transition-colors" title="Set as Default">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(card.id)} className="p-1.5 rounded-lg text-[#666666] hover:text-[#DC2626] hover:bg-[#F5F5F5] transition-colors" title="Delete Card">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[15px] font-mono font-medium text-[#0F0F0F] tracking-[0.2em]">
                    **** **** **** {card.last4}
                  </p>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-[#ECECEC]">
                  <div>
                    <p className="text-[10px] text-[#666666] uppercase tracking-widest font-bold mb-1">Expires</p>
                    <p className="text-[13px] font-medium text-[#0F0F0F]">{card.expiry}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                    <Lock className="w-3 h-3 text-[#C9A75D]" />
                    Secure
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Security Banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#ECECEC] mt-8 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#FBFBFB] border border-[#ECECEC] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#C9A75D]" />
        </div>
        <div className="flex-1 mt-0.5">
          <h4 className="text-[14px] font-bold text-[#0F0F0F] mb-1">Bank-Level Security</h4>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            Your payment information is encrypted and securely stored using <span className="text-[#C9A75D] font-medium">AES-256</span> military-grade encryption. Luxoria does not store your full card details directly on our servers.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
