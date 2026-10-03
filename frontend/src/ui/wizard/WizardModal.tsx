import React, { useState } from 'react';
import type {  Answers, Suggestion, ServeStyle, MachineId, GrinderId  } from '../../engine/types';
import { buildSuggestions } from '../../engine/suggest';
import RadarChart from '../builder/RadarChart';
import { useBlend } from '../builder/useBlend';

interface Props {
  blendHook: ReturnType<typeof useBlend>;
  onClose: () => void;
}

export default function WizardModal({ blendHook, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleNext = (key: keyof Answers, val: any) => {
    const nextAnswers = { ...answers, [key]: val };
    setAnswers(nextAnswers);
    
    if (step === 6) {
      const results = buildSuggestions(nextAnswers as Answers, blendHook.settings.roles, blendHook.origins);
      setSuggestions(results);
      setStep(7); // Results screen
    } else {
      setStep(step + 1);
    }
  };

  if (step === 7) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-card w-full max-w-4xl rounded-xl border border-white/10 p-8 shadow-glass max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-heading text-accent">Three ways to build it</h2>
            <button onClick={onClose} className="text-muted hover:text-white">✕</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestions.map(s => {
              const flavor = blendHook.flavor; // In a real scenario, recompute per suggestion
              return (
                <div key={s.variant} className="bg-white/5 border border-white/5 rounded-xl p-6 relative">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-bl-xl rounded-tr-xl uppercase tracking-wider">{s.variantName}</div>
                  <h3 className="text-xl font-heading text-cream mb-2 mt-4">{s.blendName}</h3>
                  <p className="text-sm text-muted mb-4 h-10">{s.why}</p>
                  
                  <div className="h-40 mb-4 bg-ink/50 rounded-lg">
                    {/* Placeholder for mini radar, should compute flavor for this exact suggestion */}
                    <div className="w-full h-full flex items-center justify-center text-muted text-xs">Mini Radar</div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {s.advantages.map((adv, i) => (
                      <li key={i} className="text-xs text-muted leading-relaxed">• {adv}</li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => {
                      blendHook.applySuggestion(s);
                      onClose();
                    }}
                    className="w-full py-3 bg-white/10 hover:bg-accent hover:text-black text-cream font-semibold rounded-lg transition-colors"
                  >
                    Use {s.variantName}
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => setStep(1)} className="text-muted hover:text-cream text-sm">Start over</button>
            <button className="text-accent hover:text-white text-sm font-semibold">Taste all three first (Upgrade A)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-xl border border-white/10 p-8 shadow-glass">
        <div className="flex justify-between items-center mb-6">
          <div className="text-accent text-sm font-semibold tracking-wider">Question {step} of 6</div>
          <button onClick={onClose} className="text-muted hover:text-white">✕</button>
        </div>
        
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-cream mb-6">Who drinks your coffee most?</h2>
            {['students', 'corporate', 'families', 'premium'].map(val => (
              <button key={val} onClick={() => handleNext('audience', val)} className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-cream capitalize transition-colors">
                {val}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-cream mb-6">Where is your cafe?</h2>
            {['south', 'north', 'west', 'east'].map(val => (
              <button key={val} onClick={() => handleNext('region', val)} className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-cream capitalize transition-colors">
                {val} India
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-cream mb-6">Your price point?</h2>
            {['budget', 'mid', 'premium'].map(val => (
              <button key={val} onClick={() => handleNext('price', val)} className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-cream capitalize transition-colors">
                {val}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-cream mb-6">What do you serve most?</h2>
            {[
              { id: 'kaapi', label: 'South Indian filter (kaapi)' },
              { id: 'espresso', label: 'Espresso drinks' },
              { id: 'pourover', label: 'Pour-over' },
              { id: 'mixed', label: 'A mix' }
            ].map(val => (
              <button key={val.id} onClick={() => handleNext('style', val.id)} className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-cream transition-colors">
                {val.label}
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-cream mb-6">Your espresso machine?</h2>
            {[
              { id: 'none', label: 'No machine' },
              { id: 'single', label: 'Single boiler' },
              { id: 'hx', label: 'Heat exchanger' },
              { id: 'double', label: 'Double or multi-boiler' }
            ].map(val => (
              <button key={val.id} onClick={() => handleNext('machine', val.id)} className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-cream transition-colors">
                {val.label}
              </button>
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-cream mb-6">What do you grind on?</h2>
            {[
              { id: 'blade', label: 'Blade grinder' },
              { id: 'entry', label: 'Entry-level burr' },
              { id: 'commercial', label: 'Commercial burr' }
            ].map(val => (
              <button key={val.id} onClick={() => handleNext('grinder', val.id)} className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-cream transition-colors">
                {val.label}
              </button>
            ))}
          </div>
        )}

        {step > 1 && step < 7 && (
          <button onClick={() => setStep(step - 1)} className="mt-6 text-muted hover:text-white text-sm">
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
