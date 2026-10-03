import React from 'react';

export default function VasaviSignature() {
  const signatures = [
    { num: '01', name: 'Vasavi House No. 01', desc: 'The everyday espresso', fit: '100%', score: 83, specs: 'Espresso & milk drinks · Medium-dark', recipe: '70% Chikmagalur Arabica + 30% Robusta Kaapi Royale' },
    { num: '02', name: 'Vasavi Golden Crema', desc: 'Sweetness meets backbone', fit: '100%', score: 85, specs: 'Espresso & milk drinks · Medium-dark', recipe: '70% Coorg Arabica + 30% Robusta Kaapi Royale' },
    { num: '03', name: 'Vasavi Monsoon Velvet', desc: 'A mellow milk-coffee base', fit: '100%', score: 81, specs: 'Espresso & milk drinks · Medium-dark', recipe: '70% Monsooned Malabar AA + 30% Robusta Kaapi Royale' },
    { num: '04', name: 'Vasavi Deccan Kaapi', desc: 'Made for the milk ritual', fit: '100%', score: 78, specs: 'South Indian kaapi · Dark', recipe: '70% Chikmagalur Arabica + 30% Robusta Kaapi Royale' },
    { num: '05', name: 'Vasavi Araku Bloom', desc: 'Origin-forward filter', fit: '100%', score: 90, specs: 'Pour-over · Medium', recipe: '70% Araku Valley Arabica + 30% Coorg Arabica' },
    { num: '06', name: 'Vasavi Café Harmony', desc: 'For a versatile menu', fit: '100%', score: 90, specs: 'Mixed espresso + filter · Medium', recipe: '60% Coorg Arabica + 40% Colombia Huila' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-[#C86D3F] text-white p-8 rounded-sm">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4 opacity-90">✦ Vasavi Signature Collection</h3>
        <h2 className="text-3xl md:text-5xl font-heading mb-4 leading-tight">Six personalities.<br/>One house.</h2>
        <p className="text-sm md:text-base opacity-90 max-w-xl">
          Proposed house recipes, ready for your tasting bench. Scores are calculated—not promotional promises. Fit shown for each recipe’s target setup.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signatures.map(s => (
          <div key={s.num} className="bg-white text-[#1c1a17] p-6 rounded-sm border border-black/5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-[#C86D3F] tracking-widest uppercase mb-4">{s.num} / VASAVI</div>
              <h3 className="text-2xl font-heading mb-1">{s.name}</h3>
              <p className="text-sm text-black/60 mb-6">{s.desc}</p>
              
              <div className="flex gap-2 mb-6">
                <span className="bg-[#fcf5f3] text-[#C86D3F] px-2 py-1 text-xs font-semibold rounded-sm">🤩 {s.fit} Menu Fit</span>
                <span className="bg-[#fff9e6] text-[#b38822] px-2 py-1 text-xs font-semibold rounded-sm">🙂 {s.score} Cup Score</span>
              </div>
              
              <p className="text-xs text-black/50 mb-1">{s.specs}</p>
              <p className="text-sm font-medium mb-6">{s.recipe}</p>
            </div>
            
            <button className="w-full bg-[#1c1a17] text-white py-3 font-semibold text-sm rounded-sm hover:bg-black/80 transition-colors">
              Explore this signature
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
