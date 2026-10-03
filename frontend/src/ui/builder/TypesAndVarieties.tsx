import React, { useState } from 'react';

export default function TypesAndVarieties() {
  const [subTab, setSubTab] = useState('Variety index · 116');
  
  const varieties = [
    'AB3', 'Anacafe 14', 'Batian', 'Bourbon', 'Bourbon Mayaguez 139', 
    'Bourbon Mayaguez 71', 'BPL10', 'Caripe', 'Casiopea', 'Catigua MG2', 
    'Catimor 129', 'Catisic', 'Catuai', 'Caturra', 'Centroamericano', 
    'Costa Rica 95', 'Cuscatleco', 'EC15', 'Esperanza L4 A5', 'Evaluna', 
    'Fronton', 'Geisha (Panama)', 'H3', 'Harar (Rwanda)', 'IAPAR 59', 
    'IHCAFE 90', 'IPR 103', 'IPR 107', 'Jackson 2/1257', 'Java', 'K7', 
    'Kartika 1', 'KP423', 'Lempira', 'Limani', 'Maragogipe', 'Marsellesa', 
    'Mibirizi', 'Milenio', 'Monte Claro', 'Mundo Maya', 'Mundo Novo', 
    'Nayarita', 'Nyasaland', 'Obata (Red)', 'Oro Azteca', 'Pacamara', 'Pacas'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="mb-8">
        <h2 className="text-3xl font-heading text-cream mb-2">Same bean world. Different labels.</h2>
        <p className="text-muted text-sm max-w-2xl">
          Origin ≠ variety ≠ process ≠ grade. Explore coffee types with editable demo profiles; botanical varieties are reference entries.
        </p>
      </div>

      <div className="flex gap-2 text-sm font-semibold border-b border-white/10 pb-4">
        <button 
          onClick={() => setSubTab('Specialty & trade lots')}
          className={`px-4 py-2 ${subTab === 'Specialty & trade lots' ? 'bg-[#1c1a17] text-white' : 'bg-white/5 text-muted hover:bg-white/10'}`}
        >
          Specialty & trade lots
        </button>
        <button 
          onClick={() => setSubTab('Variety index · 116')}
          className={`px-4 py-2 ${subTab === 'Variety index · 116' ? 'bg-[#1c1a17] text-white' : 'bg-white/5 text-muted hover:bg-white/10'}`}
        >
          Variety index · 116
        </button>
        <button 
          onClick={() => setSubTab('Understand the types')}
          className={`px-4 py-2 ${subTab === 'Understand the types' ? 'bg-[#1c1a17] text-white' : 'bg-white/5 text-muted hover:bg-white/10'}`}
        >
          Understand the types
        </button>
      </div>

      {subTab === 'Variety index · 116' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {varieties.map(v => (
            <div key={v} className="bg-white text-[#1c1a17] p-5 border border-black/5 rounded-sm">
              <div className="text-[10px] uppercase tracking-widest text-black/50 mb-2">Arabica · BOTANICAL VARIETY</div>
              <h3 className="text-xl font-heading font-medium mb-4">{v}</h3>
              <p className="text-sm text-black/70 mb-6 leading-relaxed">
                Research index entry. Not evidence of Vasavi stock or a calibrated roast profile.
              </p>
              <a href="#" className="text-xs text-[#C86D3F] font-medium hover:underline">
                Source: World Coffee Research · Arabica catalog
              </a>
            </div>
          ))}
        </div>
      )}

      {subTab === 'Specialty & trade lots' && (
        <div className="bg-white/5 border border-white/10 p-8 rounded-sm text-center">
          <p className="text-muted">Explore the catalog to see specialty & trade lots.</p>
        </div>
      )}
      
      {subTab === 'Understand the types' && (
        <div className="bg-white/5 border border-white/10 p-8 rounded-sm text-center">
          <p className="text-muted">Learn about origins, varieties, processes, and grades.</p>
        </div>
      )}
    </div>
  );
}
