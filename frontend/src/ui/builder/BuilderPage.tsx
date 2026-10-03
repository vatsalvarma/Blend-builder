import React, { useState, useEffect } from 'react';
import { useBlend } from './useBlend';
import BeanPicker from './BeanPicker';
import RatioSliders from './RatioSliders';
import ServeAndKit from './ServeAndKit';
import RadarChart from './RadarChart';
import WizardModal from '../wizard/WizardModal';
import OrderSampleModal from './OrderSampleModal';
import SavedBlendsModal from './SavedBlendsModal';

import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';

export default function BuilderPage() {
  const blend = useBlend();
  const [showWizard, setShowWizard] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showSavedBlends, setShowSavedBlends] = useState(false);
  const [savedBlends, setSavedBlends] = useState<any[]>([]);
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 });
  
  // Mouse tracking for Spotlight and Magnetic 3D Text
  const mouseX = useMotionValue(500);
  const mouseY = useMotionValue(400);

  // Smooth out the mouse values for the 3D tilt so it doesn't snap abruptly
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse position to 3D rotation (-15 to 15 degrees)
  const tiltX = useTransform(smoothMouseY, [0, windowSize.h], [15, -15]);
  const tiltY = useTransform(smoothMouseX, [0, windowSize.w], [-15, 15]);
  
  // Subtle magnetic tilt for the Tasting Room panel
  const panelTiltX = useTransform(smoothMouseY, [0, windowSize.h], [4, -4]);
  const panelTiltY = useTransform(smoothMouseX, [0, windowSize.w], [-4, 4]);
  
  // Motion Template for Spotlight Background
  const spotlightBg = useMotionTemplate`radial-gradient(circle 800px at ${smoothMouseX}px ${smoothMouseY}px, rgba(212,175,55,0.2) 0%, transparent 70%)`;

  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loaded = localStorage.getItem('savedBlends');
    if (loaded) setSavedBlends(JSON.parse(loaded));
  }, []);

  const handleSaveBlend = () => {
    if (blend.selectedIds.length === 0) return;
    const newBlend = {
      id: Date.now().toString(),
      blendName: blend.blendName,
      selectedIds: blend.selectedIds,
      ratios: blend.ratios,
      roastIdx: blend.roastIdx,
      style: blend.serveStyle,
      machine: blend.machine,
      grinder: blend.grinder,
      date: Date.now()
    };
    const updated = [...savedBlends, newBlend];
    setSavedBlends(updated);
    localStorage.setItem('savedBlends', JSON.stringify(updated));
    alert('Blend saved to My Blends!');
  };

  const handleDeleteBlend = (id: string) => {
    const updated = savedBlends.filter(b => b.id !== id);
    setSavedBlends(updated);
    localStorage.setItem('savedBlends', JSON.stringify(updated));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Advanced Parallax & Scroll Physics
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20, mass: 0.5 });
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const bgY = useTransform(smoothScrollY, [0, 800], [0, 250]);
  const heroOpacity = useTransform(smoothScrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(smoothScrollY, [0, 400], [1, 0.85]);
  const heroRotateX = useTransform(smoothScrollY, [0, 400], [0, 40]);
  const heroY = useTransform(smoothScrollY, [0, 400], [0, 150]);
  const filterBlur = useTransform(smoothScrollY, [0, 400], ["blur(0px)", "blur(15px)"]);

  if (blend.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-bg to-bg animate-pulse-slow"></div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="text-accent font-heading tracking-widest uppercase text-xl relative z-10"
        >
          Curating the Vault...
        </motion.div>
      </div>
    );
  }
  
  if (blend.error) {
    return <div className="min-h-screen flex items-center justify-center text-terra">Could not load beans. Check your connection and refresh.</div>;
  }

  // Kinetic Typography Animation Setup
  const title1 = "Good taste.";
  const title2 = "Made yours.";

  const letterContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.3 }
    }
  };

  const letterVariant: any = {
    hidden: { opacity: 0, y: 50, rotateX: 90, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-32 lg:pb-8 relative perspective-[1500px]" onMouseMove={handleMouseMove}>
      
      {/* Global Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-[#f5d098] to-[#d4af37] z-[100] origin-left shadow-[0_0_20px_rgba(212,175,55,1)]"
        style={{ scaleX: scaleProgress }}
      />

      {/* ULTRA-UNIQUE SUPER-HERO SECTION */}
      <div className="relative w-full h-[90vh] min-h-[750px] flex flex-col justify-between p-4 lg:p-8 overflow-hidden">
        
        {/* Deep Parallax Background */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center origin-top z-0"
          style={{ backgroundImage: 'url(/vasavi_bg_landscape.png)', y: bgY, scale: 1.05 }}
        />
        
        {/* Dynamic Interactive Spotlight overlay linked to MotionValues */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: spotlightBg,
            mixBlendMode: 'screen'
          }}
        />

        {/* Cinematic Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 via-[#0a0a0a]/50 to-[#050505] z-0 pointer-events-none" />
        
        {/* Sweeping Laser Scanline Effect */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent z-0 pointer-events-none shadow-[0_0_30px_rgba(212,175,55,1)]"
        />

        {/* Floating Ambient Orbs (Aurora Effect) */}
        <motion.div 
          animate={{ x: [0, 150, -100, 0], y: [0, -150, 100, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-accent/15 rounded-full blur-[140px] pointer-events-none z-0"
        />

        {/* Floating Dust Motes (Golden Specs) */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute bg-white rounded-full pointer-events-none z-0 shadow-[0_0_15px_rgba(212,175,55,1)]"
            style={{ width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px' }}
            initial={{ 
              x: Math.random() * windowSize.w, 
              y: Math.random() * windowSize.h, 
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{ 
              y: [null, Math.random() * windowSize.h - 200],
              x: [null, Math.random() * windowSize.w + (Math.random() > 0.5 ? 200 : -200)],
              opacity: [null, 0, 1, 0]
            }}
            transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, ease: "linear" }}
          />
        ))}

        <div className="relative z-10 max-w-[1400px] mx-auto w-full h-full flex flex-col justify-between">
          
          {/* Top Logo Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-between items-center py-6 border-b border-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.1, rotate: 180 }} transition={{ duration: 0.6 }} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f5d098] to-[#b38822] text-bg font-bold flex items-center justify-center font-heading text-3xl shadow-[0_0_40px_rgba(212,175,55,0.6)] rounded-sm group-hover:shadow-[0_0_60px_rgba(212,175,55,1)] transition-shadow">V</div>
                <div>
                  <div className="font-heading font-bold text-cream tracking-[0.3em] text-2xl leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-gold transition-all duration-300">VASAVI</div>
                  <div className="text-[9px] text-accent/90 tracking-[0.5em] uppercase mt-1 font-bold">Trading Company</div>
                </div>
              </motion.div>
              <div className="hidden md:flex gap-12 ml-20 text-sm font-semibold text-muted">
                <span className="text-accent border-b border-accent pb-1 uppercase tracking-widest text-xs relative">
                  Blend Lab
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-accent shadow-[0_0_15px_rgba(212,175,55,1)] animate-pulse"></span>
                </span>
                <span onClick={() => setShowSavedBlends(true)} className="uppercase tracking-[0.2em] text-xs hover:text-cream cursor-pointer transition-colors flex items-center gap-3">
                  My blends 
                  <span className="bg-gradient-to-br from-accent to-[#b38822] text-black px-2.5 py-0.5 rounded text-[9px] font-black shadow-[0_0_10px_rgba(212,175,55,0.5)]">{savedBlends.length}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,175,55,0.4)" }} 
                whileTap={{ scale: 0.95 }}
                className="hidden md:block border border-accent bg-accent/5 px-10 py-3 text-accent rounded backdrop-blur-xl uppercase tracking-[0.3em] text-[9px] font-black transition-colors hover:bg-accent hover:text-black"
              >
                Meet Dr. Crema
              </motion.button>
              <button className="text-muted/40 text-3xl hover:text-accent transition-colors hover:drop-shadow-[0_0_15px_rgba(212,175,55,1)]">☾</button>
            </div>
          </motion.div>

          {/* Masterpiece Kinetic Hero Content wrapped in Magnetic 3D Tilt */}
          <motion.div 
            style={{ 
              opacity: heroOpacity, 
              scale: heroScale,
              rotateX: heroRotateX,
              y: heroY,
              filter: filterBlur,
              transformStyle: "preserve-3d"
            }}
            className="mb-16 relative origin-bottom w-full flex flex-col justify-center mt-12 perspective-[1500px]"
          >
            {/* Magnetic Tilt Wrapper */}
            <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }} className="w-fit">
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-accent text-[12px] tracking-[0.6em] font-black uppercase mb-10 flex items-center gap-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
              >
                <span className="w-12 h-[2px] bg-accent"></span> THE COFFEE DESIGN STUDIO <span className="w-[200px] h-[1px] bg-gradient-to-r from-accent/80 to-transparent"></span>
              </motion.div>
              
              <div className="relative mb-10 transform-gpu" style={{ transformStyle: "preserve-3d" }}>
                
                {/* Background Outline Text (Creates massive depth) */}
                <motion.div 
                  variants={letterContainer}
                  initial="hidden"
                  animate="visible"
                  className="absolute inset-0 text-7xl md:text-[10rem] font-heading font-black tracking-tighter leading-[0.8] text-transparent"
                  style={{ WebkitTextStroke: '2px rgba(212,175,55,0.2)', transform: 'translateZ(-80px) translateY(-15px) translateX(-10px)' }}
                >
                  <div className="flex">
                    {title1.split('').map((char, i) => <motion.span key={`bg1-${i}`} variants={letterVariant}>{char === ' ' ? '\u00A0' : char}</motion.span>)}
                  </div>
                  <div className="flex">
                    {title2.split('').map((char, i) => <motion.span key={`bg2-${i}`} variants={letterVariant}>{char === ' ' ? '\u00A0' : char}</motion.span>)}
                  </div>
                </motion.div>

                {/* Foreground Solid Text with Kinetic Reveal */}
                <motion.div 
                  variants={letterContainer}
                  initial="hidden"
                  animate="visible"
                  className="relative text-7xl md:text-[10rem] font-heading font-bold tracking-tighter drop-shadow-2xl leading-[0.8] transform-gpu z-10"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="flex text-cream">
                    {title1.split('').map((char, i) => <motion.span key={`fg1-${i}`} variants={letterVariant} className="inline-block hover:text-accent transition-colors hover:scale-110 cursor-default">{char === ' ' ? '\u00A0' : char}</motion.span>)}
                  </div>
                  <div className="flex">
                    {title2.split('').map((char, i) => (
                      <motion.span 
                        key={`fg2-${i}`} 
                        variants={letterVariant}
                        className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-[#f5d098] via-accent to-[#b38822] italic font-serif font-medium filter drop-shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-110 cursor-default"
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="flex justify-between items-end mt-8 transform-gpu"
                style={{ transform: 'translateZ(20px)' }}
              >
                <p className="text-3xl text-cream/70 max-w-2xl drop-shadow-lg font-light leading-snug tracking-wide border-l-2 border-accent pl-6">
                  Choose your origins. Shape your flavour.<br/>
                  <span className="text-cream font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Find your absolute signature.</span>
                </p>
              </motion.div>

            </motion.div>
          </motion.div>

          {/* Premium Bottom Tabs with Stagger */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center md:justify-start gap-x-20 gap-y-8 border-b border-white/10 pb-8 text-xs font-black uppercase tracking-[0.3em] relative z-20"
          >
            <button className="text-accent relative flex items-center gap-5 transition-colors group">
              <span className="text-2xl group-hover:scale-125 group-hover:rotate-12 transition-transform origin-center filter drop-shadow-[0_0_15px_rgba(212,175,55,1)]">☕</span> Build my own
              <span className="absolute -bottom-8 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_rgba(212,175,55,1)]"></span>
            </button>
            <button className="text-muted hover:text-cream flex items-center gap-5 transition-all group hover:translate-y-[-4px]" onClick={() => setShowWizard(true)}>
              <span className="text-2xl group-hover:rotate-45 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">✨</span> Help me choose
            </button>
            <button className="text-muted hover:text-cream flex items-center gap-5 relative transition-all group hover:translate-y-[-4px]" onClick={() => alert("Coming soon!")}>
              <span className="text-2xl group-hover:animate-spin-slow text-terra">✦</span> AI blend planner 
              <span className="absolute -top-3 -right-6 text-[8px] bg-terra/20 text-terra px-3 py-1 rounded-full border border-terra/50 shadow-[0_0_10px_rgba(193,102,107,0.5)]">BETA</span>
            </button>
            <button className="text-muted hover:text-cream flex items-center gap-5 transition-all group hover:translate-y-[-4px]" onClick={() => alert("Coming soon!")}>
              <span className="text-2xl group-hover:rotate-180 transition-transform duration-700">⇄</span> Switch my blend
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 lg:p-8 relative z-20 mt-12">
        <motion.header 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-6">
            <h2 className="text-5xl font-heading font-normal text-cream tracking-wide"><span className="text-terra/80 mr-6 text-3xl font-serif italic">01</span>Choose your beans</h2>
            <span className="text-xs text-accent font-bold tracking-[0.2em] uppercase bg-accent/10 px-5 py-2.5 rounded-full border border-accent/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">{blend.selectedIds.length} / 4 lots</span>
          </div>
        </motion.header>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          
          {/* Left Column - Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 relative"
          >
            <div className="relative p-6 lg:p-12 border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
              
              {/* Transparent Background using Hero Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none" 
                style={{ backgroundImage: 'url(/vasavi_bg_landscape.png)' }} 
              />
              {/* Dark overlay to maintain contrast */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />

              <div className="relative z-10">
                <BeanPicker origins={blend.origins} selectedIds={blend.selectedIds} toggleBean={blend.toggleBean} />
                
                <div className="my-12 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <RatioSliders 
                  origins={blend.origins} 
                  selectedIds={blend.selectedIds} 
                  ratios={blend.ratios} 
                  setRatio={blend.setRatio} 
                  robustaPct={blend.robustaPct} 
                />
                
                <div className="my-12 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <ServeAndKit 
                  serveStyle={blend.serveStyle} setServeStyle={blend.setServeStyle}
                  machine={blend.machine} setMachine={blend.setMachine}
                  grinder={blend.grinder} setGrinder={blend.setGrinder}
                  roastIdx={blend.roastIdx} setRoastIdx={blend.setRoastIdx}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Live Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:static lg:z-auto lg:mt-[-160px] pointer-events-none perspective-[2000px]">
            {/* Smooth Floating physics on the panel itself with MAGNETIC TILT */}
            <motion.div 
              style={{ rotateX: panelTiltX, rotateY: panelTiltY, transformStyle: "preserve-3d" }}
              className="lg:sticky lg:top-12 w-full max-w-[420px] mx-auto lg:mx-0 pointer-events-auto origin-center"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(60px)" }}
                className="glass-card p-10 space-y-8 bg-gradient-to-b from-[#141712]/95 to-[#0a0a0a]/95 backdrop-blur-[40px] border border-[#4a5f36]/40 shadow-[0_40px_100px_rgba(0,0,0,0.95)] max-h-[50vh] lg:max-h-none overflow-y-auto rounded-t-[2.5rem] lg:rounded-[2.5rem] relative overflow-hidden group"
              >
                
                {/* Intense top glow that brightens on hover */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#8fb36c]/20 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50" />

                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-accent font-bold">The Tasting Room</span>
                  <motion.span 
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#8fb36c] shadow-[0_0_15px_#8fb36c]" 
                  />
                </div>

                <div className="relative z-10">
                  <input 
                    type="text" 
                    value={blend.blendName}
                    onChange={(e) => blend.setBlendName(e.target.value)}
                    className="text-4xl font-heading text-cream mb-3 tracking-tight bg-transparent border-none outline-none w-full focus:ring-0 placeholder-cream/50"
                    placeholder="Name your blend"
                  />
                  <p className="text-xs text-muted/80 tracking-widest uppercase font-semibold">{blend.selectedIds.length > 0 ? `${100-blend.robustaPct}% Arabica · ${blend.robustaPct}% Robusta · Medium-dark` : 'Select beans to begin'}</p>
                </div>

                {/* FLOATING 3D COFFEE BAG ASSET */}
                <div className="relative z-10 h-72 w-full flex items-center justify-center my-2 perspective-[1000px]">
                  <motion.div
                    animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d", transform: "translateZ(80px)" }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {/* Glowing Backlight */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-accent/20 blur-[50px] rounded-full mix-blend-screen" />
                    
                    {/* The Bag */}
                    <motion.img 
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.2}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      src="/luxury_coffee_bag.png" 
                      alt="Luxury Coffee Bag" 
                      className="h-[140%] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.9)] cursor-grab transition-transform" 
                      style={{ mixBlendMode: 'lighten' }}
                    />
                  </motion.div>
                </div>

                {/* Money Line */}
                <div className="flex justify-between items-end border-b border-white/10 pb-10 mb-8 relative z-10">
                  <div>
                    {blend.pricePerKg ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-6xl font-heading font-light text-cream tracking-tighter drop-shadow-lg flex items-center">
                            <span className="text-3xl text-accent mr-1">₹</span>
                            <AnimatePresence mode="popLayout">
                              <motion.span 
                                key={blend.cupCost}
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="inline-block"
                              >
                                {blend.cupCost}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                          <span className="text-sm text-muted font-bold tracking-widest uppercase">/ cup</span>
                        </div>
                        <div className="text-[10px] text-muted tracking-widest uppercase">Coffee only · 18g dose</div>
                      </>
                    ) : (
                      <div className="text-sm text-muted mt-2 tracking-widest uppercase">Price on request</div>
                    )}
                  </div>
                  <div className="text-right">
                    <button className="text-[9px] uppercase tracking-[0.2em] font-bold border border-white/10 px-4 py-2 rounded text-muted hover:text-accent hover:border-accent/50 hover:bg-accent/5 transition-all">
                      Demo Price
                    </button>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-muted font-bold">Sensory Map</span>
                    <span className="text-[9px] text-muted tracking-widest uppercase bg-white/5 px-3 py-1.5 rounded">0–10 · estimate</span>
                  </div>
                  <div className="h-[320px] flex items-center justify-center relative -mx-4">
                    <RadarChart flavor={blend.flavor} />
                  </div>
                </div>
                
                <div className="pt-10 border-t border-white/10 relative z-10">
                  <motion.button 
                    whileHover={{ scale: blend.selectedIds.length > 0 ? 1.03 : 1 }}
                    whileTap={{ scale: blend.selectedIds.length > 0 ? 0.97 : 1 }}
                    disabled={blend.selectedIds.length === 0}
                    onClick={() => setShowOrder(true)}
                    className="w-full bg-gradient-to-r from-accent to-[#f5d098] text-black font-bold py-6 rounded transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] disabled:opacity-30 disabled:hover:shadow-none flex items-center justify-center gap-3 group uppercase tracking-[0.2em] text-[11px]"
                  >
                    Order a sample
                    <span className="group-hover:translate-x-3 transition-transform text-xl leading-none">→</span>
                  </motion.button>
                  <button 
                    onClick={handleSaveBlend}
                    disabled={blend.selectedIds.length === 0}
                    className="w-full mt-4 bg-white/5 border border-white/10 hover:border-accent hover:bg-white/10 text-cream font-bold py-4 rounded transition-colors disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px]"
                  >
                    Save this blend
                  </button>
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="w-full mt-5 py-4 text-[10px] uppercase tracking-[0.2em] text-muted hover:text-cream transition-colors text-center font-bold"
                  >
                    Help me choose instead
                  </button>
                </div>

              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
      
      <AnimatePresence>
        {showWizard && <WizardModal blendHook={blend} onClose={() => setShowWizard(false)} />}
        {showOrder && <OrderSampleModal blendHook={blend} onClose={() => setShowOrder(false)} />}
        {showSavedBlends && <SavedBlendsModal blends={savedBlends} onClose={() => setShowSavedBlends(false)} onLoadBlend={blend.applySuggestion} onDeleteBlend={handleDeleteBlend} />}
      </AnimatePresence>
    </div>
  );
}
