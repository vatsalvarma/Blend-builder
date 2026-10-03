import React from 'react';
import { motion } from 'framer-motion';
import type {  AxisValue  } from '../../engine/types';

export default function RadarChart({ flavor, compare }: { flavor: AxisValue[], compare?: AxisValue[] }) {
  if (!flavor || flavor.length === 0) return null;

  const size = 260;
  const center = size / 2;
  const radius = (size / 2) - 30; // leave room for labels
  const angleStep = (Math.PI * 2) / flavor.length;

  const getPoint = (val: number, i: number) => {
    // val is 0-10, scale to radius
    const r = (val / 10) * radius;
    const angle = i * angleStep - Math.PI / 2; // start at top
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const drawPolygon = (data: AxisValue[]) => {
    return data.map((d, i) => {
      const p = getPoint(d.value, i);
      return `${p.x},${p.y}`;
    }).join(' ');
  };

  const points = drawPolygon(flavor);
  const comparePoints = compare ? drawPolygon(compare) : '';

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible font-body drop-shadow-2xl">
      
      {/* Animated Grid Rings (Pulse on load) */}
      {[2.5, 5, 7.5, 10].map((val, idx) => {
        const r = (val / 10) * radius;
        return (
          <motion.circle 
            initial={{ r: 0, opacity: 0 }}
            animate={{ r, opacity: 1 }}
            transition={{ duration: 1, delay: idx * 0.1, type: "spring", damping: 20 }}
            key={val} 
            cx={center} 
            cy={center} 
            fill="none" 
            stroke="currentColor" 
            strokeOpacity="0.15" 
            strokeWidth="1" 
          />
        );
      })}
      
      {/* Axes and Labels */}
      {flavor.map((d, i) => {
        const pOuter = getPoint(10, i);
        const pLabel = getPoint(12, i); // push label out further
        const isNeg = d.axis === 'Bitter' || d.axis === 'Roasted';
        return (
          <g key={d.axis}>
            <line x1={center} y1={center} x2={pOuter.x} y2={pOuter.y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3 3" />
            <motion.text 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              x={pLabel.x} 
              y={pLabel.y} 
              textAnchor="middle" 
              dominantBaseline="middle"
              className={`text-[10px] uppercase tracking-widest ${isNeg ? 'fill-terra font-bold' : 'fill-muted/80 font-bold'}`}
            >
              {d.axis}
            </motion.text>
          </g>
        );
      })}

      {/* Compare Polygon (Optional) */}
      {compare && (
        <motion.polygon 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, points: comparePoints }}
          transition={{ type: "spring", damping: 15, stiffness: 60 }}
          fill="none" 
          stroke="currentColor" 
          strokeOpacity="0.3" 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
        />
      )}

      {/* Main Morphing Polygon */}
      <motion.polygon 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, points: points }}
        transition={{ type: "spring", damping: 12, stiffness: 80, mass: 0.8 }}
        fill="url(#goldGradient)" 
        fillOpacity="0.4" 
        stroke="#d4af37" 
        strokeWidth="2.5" 
        className="drop-shadow-[0_0_15px_rgba(212,175,55,0.7)] transform-origin-center" 
      />
      
      {/* Morphing Nodes */}
      {flavor.map((d, i) => {
        const p = getPoint(d.value, i);
        return (
          <motion.circle 
            key={`node-${d.axis}`} 
            initial={{ cx: center, cy: center }}
            animate={{ cx: p.x, cy: p.y }}
            transition={{ type: "spring", damping: 12, stiffness: 80, mass: 0.8 }}
            r={4} 
            className="fill-accent drop-shadow-[0_0_8px_rgba(255,255,255,1)]" 
          />
        );
      })}

      {/* Defs for Glow Gradient */}
      <defs>
        <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#f5d098" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}
