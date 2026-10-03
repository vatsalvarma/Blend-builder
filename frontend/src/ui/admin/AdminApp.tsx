import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import type { Order, Origin, Settings, AuditEntry } from '../../engine/types';
import { motion, AnimatePresence } from 'framer-motion';
import OrderReviewModal from './OrderReviewModal';

const pageVariants: any = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

const itemVariants: any = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [ord, org, set, aud] = await Promise.all([
        api.listOrders(0),
        api.getOrigins({ includeOutOfStock: true }),
        api.getSettings(),
        api.listAudit(0)
      ]);
      setOrders(ord);
      setOrigins(org);
      setSettings(set);
      setAudit(aud);
      setIsAuthenticated(true);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setIsAuthenticated(false);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await api.login(username, password);
      setIsAuthenticated(true);
      loadData();
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoginError('Invalid username or password');
      } else {
        setLoginError('Failed to connect to server');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-bg to-bg animate-pulse-slow"></div>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="text-accent font-heading tracking-widest uppercase text-xl relative z-10 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
      >
        Initializing Core...
      </motion.div>
    </div>
  );

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.1),_transparent_60%)] animate-pulse-slow"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 w-full max-w-md shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-white/10 relative overflow-hidden backdrop-blur-2xl"
        >
          {/* Animated glowing border line */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" 
          />
          
          <div className="text-center mb-10 relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-heading text-cream mb-2 tracking-wide"
            >
              VASAVI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-accent text-xs tracking-[0.3em] uppercase font-bold"
            >
              Secure Command Center
            </motion.p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <motion.div variants={itemVariants} initial="initial" animate="animate">
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-semibold">Identification</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-md p-4 text-cream focus:border-accent focus:shadow-[0_0_15px_rgba(212,175,55,0.3)] outline-none transition-all duration-300 backdrop-blur-sm"
                autoComplete="username"
                placeholder="Enter your username"
              />
            </motion.div>
            <motion.div variants={itemVariants} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-semibold">Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-md p-4 text-cream focus:border-accent focus:shadow-[0_0_15px_rgba(212,175,55,0.3)] outline-none transition-all duration-300 backdrop-blur-sm"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </motion.div>
            
            <AnimatePresence>
              {loginError && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-terra text-sm text-center font-semibold bg-terra/10 py-2 rounded border border-terra/20"
                >
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>
            
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(212,175,55,0.5)' }}
              whileTap={{ scale: 0.97 }}
              type="submit" 
              className="w-full bg-accent text-black font-bold py-4 rounded-md transition-all uppercase tracking-[0.2em] text-xs mt-6 relative overflow-hidden group"
            >
              <span className="relative z-10">Authenticate</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-bg via-[#111] to-[#1a1a1a] z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] z-0"></div>
      
      <header className="bg-black/40 border-b border-white/10 p-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-heading text-xl text-cream tracking-widest mr-8">VASAVI <span className="text-accent text-sm">ADMIN</span></div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
            {['orders', 'beans', 'roles', 'audit'].map(tab => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize py-2 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === tab ? 'bg-accent text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-muted hover:text-cream hover:bg-white/5'}`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-10 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div key="orders" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-heading text-cream">Incoming Transmissions</h2>
                <span className="px-4 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs tracking-widest">{orders.length} ACTIVE</span>
              </div>
              <div className="grid gap-6">
                {orders.map(o => (
                  <motion.div variants={itemVariants} key={o.id} className="glass-card p-6 group cursor-pointer hover:bg-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-cream group-hover:text-accent transition-colors">{o.blendName}</h3>
                        <p className="text-sm text-muted mt-1">{o.cafeName} • {o.contactName} ({o.phone})</p>
                      </div>
                      <span className="px-3 py-1 bg-accent/20 border border-accent/30 rounded text-xs uppercase tracking-widest text-accent shadow-[0_0_10px_rgba(212,175,55,0.2)]">{o.status}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/5 my-4"></div>
                    <div className="flex items-center justify-between text-sm text-cream">
                      <span className="opacity-70">{o.sampleGrams}g Sample • {o.serveStyle}</span>
                      <motion.button onClick={() => setReviewOrder(o)} whileHover={{ x: 5 }} className="text-accent text-xs font-bold tracking-widest uppercase">Review &rarr;</motion.button>
                    </div>
                  </motion.div>
                ))}
                {orders.length === 0 && <p className="text-muted text-center py-20 italic">Awaiting new signals...</p>}
              </div>
            </motion.div>
          )}

          {activeTab === 'beans' && (
            <motion.div key="beans" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-heading text-cream">Botanical Database</h2>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await api.saveOrigins(origins);
                      alert('Prices saved successfully');
                    } catch (e) {
                      alert('Failed to save prices');
                    }
                    setLoading(false);
                  }}
                  className="px-6 py-2 bg-accent text-black font-bold rounded transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  Save Changes
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {origins.map(o => (
                  <motion.div variants={itemVariants} key={o.id} className={`glass-card p-6 flex flex-col justify-between ${!o.inStock ? 'opacity-40 grayscale' : ''}`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-cream leading-tight">{o.name}</h3>
                        <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full tracking-widest uppercase">{o.type}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-6 text-accent font-semibold">
                        <span>₹</span>
                        <input 
                          type="number" 
                          value={o.pricePerKg}
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            setOrigins(origins.map(orig => orig.id === o.id ? { ...orig, pricePerKg: newPrice } : orig));
                          }}
                          className="bg-transparent border-b border-accent/30 outline-none w-24 text-accent focus:border-accent"
                        />
                        <span className="text-sm">/ kg</span>
                      </div>
                      <p className="text-xs text-muted mb-6 leading-relaxed line-clamp-3">{o.tag}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div key="audit" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <h2 className="text-3xl font-heading text-cream mb-8">System Audit Log</h2>
              <div className="glass-card rounded-xl overflow-hidden border border-white/10 p-1">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 text-xs uppercase tracking-widest text-muted">
                    <tr>
                      <th className="p-4 font-semibold">Timestamp</th>
                      <th className="p-4 font-semibold">Operator</th>
                      <th className="p-4 font-semibold">Event Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {audit.map((a, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={a.id} 
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4 text-muted/70 text-xs">{new Date(a.at).toLocaleString()}</td>
                        <td className="p-4 text-cream font-medium">{a.who}</td>
                        <td className="p-4 text-accent group-hover:text-gold transition-colors">{a.what}</td>
                      </motion.tr>
                    ))}
                    {audit.length === 0 && (
                      <tr><td colSpan={3} className="p-10 text-muted text-center italic">No events recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {reviewOrder && (
          <OrderReviewModal 
            order={reviewOrder} 
            onClose={() => setReviewOrder(null)} 
            onUpdate={loadData} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
