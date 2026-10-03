import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Origin } from '../../engine/types';
import VasaviSignature from './VasaviSignature';
import TypesAndVarieties from './TypesAndVarieties';

interface Props {
  origins: Origin[];
  selectedIds: string[];
  toggleBean: (id: string) => void;
}

// Removed hardcoded EXTRA_LOTS - they now come from the DB

const TABS = ['All beans', 'India', 'Around the world', 'Vasavi Signature', 'Types & varieties'];

export default function BeanPicker({ origins, selectedIds, toggleBean }: Props) {
  const [activeTab, setActiveTab] = useState('All beans');

  if (origins.length === 0) return <p className="text-muted">Beans back soon.</p>;

  const filteredOrigins = origins.filter(o => {
    if (activeTab === 'India') return o.flag === 'IN';
    if (activeTab === 'Around the world') return o.flag !== 'IN';
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Animated Tabs */}
      <div className="flex flex-wrap gap-4 text-xs tracking-widest uppercase font-bold mb-8 mt-4 relative z-10">
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-sm relative transition-colors duration-300 ${isActive ? 'text-black font-black' : (tab === 'Vasavi Signature' ? 'text-terra border border-terra/30 hover:bg-terra/10' : 'text-muted hover:text-cream bg-white/5')}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabPill" 
                  className={`absolute inset-0 rounded-sm -z-10 ${tab === 'Vasavi Signature' ? 'bg-terra shadow-[0_0_15px_rgba(193,102,107,0.6)]' : 'bg-gradient-to-r from-cream to-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === 'Vasavi Signature' && !isActive && <span className="mr-2">✨</span>}
              {tab}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {activeTab === 'Vasavi Signature' && <VasaviSignature />}
          {activeTab === 'Types & varieties' && <TypesAndVarieties />}

          {(activeTab === 'All beans' || activeTab === 'India' || activeTab === 'Around the world') && (
            <>
              <div className="relative mb-6 group">
                <span className="absolute left-4 top-3.5 text-muted group-focus-within:text-accent transition-colors">🔎</span>
                <input type="text" placeholder="Find a bean, variety or process" className="w-full bg-black border border-white/10 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-accent/50 transition-all text-cream placeholder-muted/50" disabled />
              </div>
              
              <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">{selectedIds.length} / 4 lots selected</span>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={{
                  show: { transition: { staggerChildren: 0.05 } }
                }}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {filteredOrigins.map(o => {
                    const isSelected = selectedIds.includes(o.id);
                    const isDisabled = !isSelected && selectedIds.length >= 4;
                    return (
                      <motion.button
                        layout
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={o.id}
                        disabled={isDisabled}
                        onClick={() => toggleBean(o.id)}
                        whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!isDisabled ? { scale: 0.98 } : {}}
                        className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-black border-accent shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                            : 'bg-black border-white/10 hover:border-white/30'
                        } ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                      >
                        {/* Dynamic Side Color Strip */}
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2" 
                          style={{ backgroundColor: o.color }} 
                          layoutId={`color-${o.id}`}
                        />
                        
                        {isSelected && (
                          <motion.div layoutId="selectedGlow" className="absolute inset-0 bg-accent/5 pointer-events-none" />
                        )}

                        <div className="flex items-center justify-between mb-2 pl-2">
                          <span className={`font-heading font-bold text-lg truncate pr-2 transition-colors ${isSelected ? 'text-accent' : 'text-cream'}`}>{o.name}</span>
                          <span className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 text-muted whitespace-nowrap border border-white/5">{o.type}</span>
                        </div>
                        <p className="text-xs text-muted/80 line-clamp-1 pl-2 font-medium tracking-wide">{o.tag}</p>
                        
                        {/* Checkmark overlay */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute top-4 right-4 text-accent drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"
                            >
                              ✓
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
