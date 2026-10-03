import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  blends: any[];
  onClose: () => void;
  onLoadBlend: (blend: any) => void;
  onDeleteBlend: (id: string) => void;
}

export default function SavedBlendsModal({ blends, onClose, onLoadBlend, onDeleteBlend }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card w-full max-w-2xl rounded-xl border border-white/10 p-8 shadow-glass relative max-h-[80vh] flex flex-col"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-muted hover:text-white transition-colors">✕</button>
        <h2 className="text-3xl font-heading text-cream mb-2">My Saved Blends</h2>
        <p className="text-muted text-sm mb-8 tracking-widest uppercase">{blends.length} blends stored locally</p>
        
        <div className="overflow-y-auto pr-2 space-y-4">
          {blends.length === 0 ? (
            <div className="text-center py-10 text-muted italic">You haven't saved any blends yet.</div>
          ) : (
            blends.map(b => (
              <motion.div 
                key={b.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 border border-white/5 p-6 rounded-lg group hover:border-accent/30 transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-cream mb-1">{b.blendName}</h3>
                  <p className="text-xs text-muted uppercase tracking-widest mb-2">
                    {new Date(b.date).toLocaleDateString()} • {b.selectedIds.length} Beans • {b.style}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onDeleteBlend(b.id)}
                    className="px-4 py-2 text-xs uppercase tracking-widest text-terra/70 hover:text-terra border border-terra/20 rounded hover:bg-terra/10 transition-colors font-bold"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => {
                      onLoadBlend(b);
                      onClose();
                    }}
                    className="px-6 py-2 text-xs uppercase tracking-widest bg-white/5 text-cream hover:bg-accent hover:text-black border border-white/10 hover:border-accent rounded transition-all font-bold shadow-[0_0_15px_rgba(212,175,55,0)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  >
                    Load Blend
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
