import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {  ServeStyle, MachineId, GrinderId, RoastIdx  } from '../../engine/types';
import { MACHINES, GRINDERS, ROAST_LABELS } from '../../engine/data';

interface Props {
  serveStyle: ServeStyle;
  setServeStyle: (s: ServeStyle) => void;
  machine: MachineId;
  setMachine: (m: MachineId) => void;
  grinder: GrinderId;
  setGrinder: (g: GrinderId) => void;
  roastIdx: RoastIdx;
  setRoastIdx: (r: RoastIdx) => void;
}

export default function ServeAndKit({ serveStyle, setServeStyle, machine, setMachine, grinder, setGrinder, roastIdx, setRoastIdx }: Props) {
  return (
    <div className="space-y-10 mt-16 border-t border-white/5 pt-12 relative">
      <div>
        <h3 className="text-3xl font-heading text-cream mb-8 font-normal"><span className="text-terra/80 mr-4 font-serif italic text-xl">03</span>Make it café-ready</h3>
        
        <p className="text-xs uppercase tracking-widest font-bold text-muted mb-4">Roast Level</p>
        
        <div className="flex rounded-lg overflow-hidden border border-white/5 bg-black/40 p-1 relative z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          {ROAST_LABELS.map((label, idx) => {
            const isActive = roastIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setRoastIdx(idx as RoastIdx)}
                className={`flex-1 py-4 px-2 text-[11px] uppercase tracking-widest text-center transition-colors relative z-20 ${isActive ? 'text-black font-black' : 'text-cream font-bold hover:text-accent'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeRoast"
                    className="absolute inset-0 bg-gradient-to-r from-accent to-[#f5d098] rounded-md -z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`inline-block w-2 h-2 rounded-full mr-2 shadow-[0_0_5px_rgba(0,0,0,0.5)] ${idx === 0 ? 'bg-[#D2A679]' : idx === 1 ? 'bg-[#A67B5B]' : idx === 2 ? 'bg-[#6B4423]' : 'bg-[#3E2723]'}`}></span>
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted/60 mt-3 px-2">
          <span>More origin character</span>
          <span>More roast character</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted mb-4">Serve Style</p>
            <div className="relative group">
              <select 
                value={serveStyle} 
                onChange={(e) => setServeStyle(e.target.value as ServeStyle)}
                className="w-full bg-black/40 border border-white/10 text-cream rounded-lg p-4 focus:outline-none focus:border-accent/50 appearance-none transition-all cursor-pointer font-bold tracking-wide text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
              >
                <option value="espresso">Espresso & milk drinks</option>
                <option value="kaapi">South Indian filter (kaapi)</option>
                <option value="pourover">Pour-over</option>
                <option value="mixed">A mix</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent group-hover:translate-y-[-40%] transition-transform">▼</div>
            </div>
          </div>
          <div>
             <p className="text-xs uppercase tracking-widest font-bold text-muted mb-4">Dose per cup (g)</p>
             <input 
               type="number" 
               defaultValue={18} 
               className="w-full bg-black/40 border border-white/10 text-cream rounded-lg p-4 focus:outline-none focus:border-accent/50 transition-all font-bold tracking-wide text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
             />
          </div>
        </div>

        <AnimatePresence>
          {(serveStyle === 'espresso' || serveStyle === 'mixed') && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 bg-black/20 border border-white/5 rounded-xl p-6"
            >
              <div className="text-xs uppercase tracking-[0.2em] font-black text-accent mb-2">Commercial Equipment Setup</div>
              <div className="text-[10px] uppercase tracking-widest text-muted/80 mb-6 font-semibold">Tweak these for hyper-accurate yield predictions</div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Espresso Machine</p>
                  <select 
                    value={machine} 
                    onChange={(e) => setMachine(e.target.value as MachineId)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-cream outline-none text-xs font-semibold appearance-none"
                  >
                    {MACHINES.map(m => <option key={m.id} value={m.id} className="bg-ink">{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Commercial Grinder</p>
                  <select 
                    value={grinder} 
                    onChange={(e) => setGrinder(e.target.value as GrinderId)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-cream outline-none text-xs font-semibold appearance-none"
                  >
                    {GRINDERS.map(g => <option key={g.id} value={g.id} className="bg-ink">{g.label}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
