import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';

export default function FeedbackPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');

  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<{ blendName: string; flightCodes?: any[] } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function load() {
      if (!orderId || !token) {
        setLoading(false);
        return;
      }
      try {
        const t = await api.getFeedbackTarget(orderId, token);
        setTarget(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId, token]);

  const submit = async (verdict: any) => {
    if (!orderId || !token) return;
    setSubmitting(true);
    setError('');
    try {
      await api.submitFeedback(orderId, token, { verdict, at: Date.now() });
      setDone(true);
    } catch (err) {
      setError('Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-cream">Loading...</div>;
  if (!target && !done) return <div className="min-h-screen flex items-center justify-center text-muted">This link was already used or has expired. Thank you!</div>;
  if (done) return <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <h1 className="text-3xl font-heading text-good mb-4">Thank you!</h1>
    <p className="text-cream">This helps us tune your next blend.</p>
  </div>;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-8 text-center">
        <h1 className="text-2xl font-heading text-cream mb-2">How did it taste?</h1>
        <p className="text-accent mb-8">{target?.blendName}</p>
        
        {error && <div className="mb-4 text-terra text-sm">{error}</div>}

        <div className="grid grid-cols-1 gap-3">
          {['perfect', 'too-bitter', 'too-weak', 'too-sour', 'flat'].map(v => (
            <button 
              key={v}
              disabled={submitting}
              onClick={() => submit(v)}
              className="py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-cream rounded-lg capitalize transition-colors"
            >
              {v.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
