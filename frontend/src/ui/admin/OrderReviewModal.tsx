import React from 'react';
import { motion } from 'framer-motion';
import type { Order } from '../../engine/types';
import { api } from '../../api';

interface Props {
  order: Order;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderReviewModal({ order, onClose, onUpdate }: Props) {
  const handleShip = async () => {
    try {
      await api.setOrderStatus(order.id, 'shipped');
      onUpdate();
      onClose();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleComplete = async () => {
    try {
      await api.setOrderOutcome(order.id, 'won');
      onUpdate();
      onClose();
    } catch (e) {
      alert('Failed to update outcome');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-lg rounded-xl border border-white/10 p-8 shadow-glass relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white">✕</button>
        <h2 className="text-2xl font-heading text-cream mb-2">Order: {order.blendName}</h2>
        <p className="text-muted text-sm mb-6">Customer: {order.contactName} ({order.cafeName}) • {order.phone}</p>
        
        <div className="space-y-4 mb-8 text-sm">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-muted">Serve Style</span>
            <span className="text-cream uppercase tracking-widest">{order.serveStyle}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-muted">Sample Size</span>
            <span className="text-cream">{order.sampleGrams}g</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-muted">Status</span>
            <span className="text-accent uppercase tracking-widest">{order.status}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-muted">Notes</span>
            <span className="text-cream">{order.notes || 'None'}</span>
          </div>
        </div>

        <div className="flex gap-4">
          {order.status === 'pending' && (
            <button onClick={handleShip} className="flex-1 bg-accent text-black font-bold py-3 rounded uppercase tracking-widest text-xs hover:bg-accent/80 transition-colors">
              Mark as Shipped
            </button>
          )}
          {order.status === 'shipped' && order.outcome === 'pending' && (
            <button onClick={handleComplete} className="flex-1 bg-green-600/20 text-green-400 border border-green-600/50 font-bold py-3 rounded uppercase tracking-widest text-xs hover:bg-green-600/30 transition-colors">
              Mark Won
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
