import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {  Origin, Ratios  } from '../../engine/types';

interface Props {
  origins: Origin[];
  selectedIds: string[];
  ratios: Ratios;
  setRatio: (id: string, val: number) => void;
  robustaPct: number;
}

export default function RatioSliders({ origins, selectedIds, ratios, setRatio, robustaPct }: Props) {
  
  return (
    <AnimatePresence>
      {selectedIds.length >= 2 && (
        <motion.div 
          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
          animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 mt-8"
        >
          <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-8">
            <h3 className="text-3xl font-heading text-cream font-normal"><span className="text-terra/80 mr-4 font-serif italic text-xl">02</span>Find your balance</h3>
            <motion.span 
              animate={{ color: selectedIds.length > 0 ? '#d4af37' : '#737373' }}
              className="text-[9px] uppercase tracking-[0.3em] font-bold border border-white/10 px-3 py-1 rounded"
            >
              100% total ✓
            </motion.span>
          </div>
          
          <AnimatePresence>
            {robustaPct > 30 && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-4 rounded-lg bg-terra/10 border border-terra/30 text-terra text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(193,102,107,0.15)] flex items-center gap-3"
              >
                <span className="text-lg">⚠</span> Robusta over 30%: expect harshness.
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div layout className="space-y-8 p-2">
            <AnimatePresence>
              {selectedIds.map(id => {
                const origin = origins.find(o => o.id === id);
                if (!origin) return null;
                const currentVal = ratios[id] || 0;
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={id} 
                    className="space-y-3 relative group"
                  >
                    <div className="flex justify-between items-end">
                      <span className="text-cream font-bold text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: origin.color }}></span>
                        {origin.name}
                      </span>
                      <motion.span 
                        key={currentVal}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent font-black text-xl drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                      >
                        {currentVal}%
                      </motion.span>
                    </div>
                    
                    <div className="relative w-full h-1.5 bg-black/50 rounded-full border border-white/5 overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-accent to-[#f5d098] shadow-[0_0_10px_rgba(212,175,55,1)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentVal}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={currentVal}
                        onChange={(e) => setRatio(id, parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          <p className="text-[10px] uppercase tracking-widest text-muted mt-8 font-semibold opacity-70">
            Ratios always add up to 100%. Other beans adjust together.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
