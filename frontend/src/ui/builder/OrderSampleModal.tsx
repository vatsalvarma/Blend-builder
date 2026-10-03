import React, { useState } from 'react';
import { api } from '../../api';

interface Props {
  blendHook: any;
  onClose: () => void;
}

export default function OrderSampleModal({ blendHook, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [cafeName, setCafeName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [sampleGrams, setSampleGrams] = useState(blendHook.settings?.sampleSizesGrams[0] || 250);
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cafeName || !contactName || !city) {
      setError('Fill cafe name, your name and city.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a 10-digit mobile number.');
      return;
    }
    if (!consent) {
      setError('Tick the box so Vasavi can contact you.');
      return;
    }

    setLoading(true);
    try {
      const order = await api.createOrder({
        blendName: blendHook.blendName,
        serveStyle: blendHook.serveStyle,
        selectedIds: blendHook.selectedIds,
        ratios: blendHook.ratios,
        roastIdx: blendHook.roastIdx,
        cafeName,
        contactName,
        phone,
        city,
        sampleGrams,
        notes,
        consentAt: Date.now()
      });

      const wa = blendHook.settings.salesWhatsApp;
      if (wa) {
        const text = encodeURIComponent(`Hi, I'm ${contactName} from ${cafeName}, ${city}.\nI built a blend: ${blendHook.blendName}\nServe style: ${blendHook.serveStyle}\nSample: ${sampleGrams}g\nOrder ID: ${order.id}`);
        window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
      }
      
      alert('Sample requested. Vasavi will contact you.');
      onClose();
    } catch (err) {
      setError('Could not send. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl border border-white/10 p-8 shadow-glass">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading text-cream">Order a sample</h2>
          <button onClick={onClose} className="text-muted hover:text-white">✕</button>
        </div>
        
        {error && <div className="mb-4 p-3 bg-terra/20 border border-terra/30 text-terra rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input placeholder="Cafe Name" value={cafeName} onChange={e => setCafeName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-accent outline-none" />
          </div>
          <div>
            <input placeholder="Your Name" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-accent outline-none" />
          </div>
          <div>
            <input placeholder="Mobile Number (10 digits)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-accent outline-none" />
          </div>
          <div>
            <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-accent outline-none" />
          </div>
          <div>
            <select value={sampleGrams} onChange={e => setSampleGrams(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-cream focus:border-accent outline-none">
              {(blendHook.settings?.sampleSizesGrams || [250]).map((g: number) => (
                <option key={g} value={g} className="bg-ink">{g}g Sample</option>
              ))}
            </select>
          </div>
          
          <label className="flex items-start gap-3 mt-4 cursor-pointer group">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 accent-accent" />
            <span className="text-sm text-muted group-hover:text-cream transition-colors">
              Vasavi may contact me on this number about this sample. <a href="/privacy" target="_blank" className="text-accent hover:underline">Privacy notice</a>.
            </span>
          </label>

          <button type="submit" disabled={loading} className="w-full mt-6 luxury-button disabled:opacity-50">
            {loading ? 'Sending...' : 'Request Sample'}
          </button>
        </form>
      </div>
    </div>
  );
}
