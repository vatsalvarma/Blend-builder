# Magnetic 3D Hover Effect & Parallax Depth

This document explains how to recreate the jaw-dropping **Magnetic 3D Tilt Parallax** effect used in premium web interfaces. You can provide this file to any AI assistant (or use it yourself) to quickly implement this effect in any React project.

## 1. Prerequisites
To use this effect, your project must have:
- React
- `framer-motion` (v10 or higher recommended)
- Tailwind CSS (optional, but used in the examples below for rapid styling)

```bash
npm install framer-motion
```

## 2. Core Concepts
The effect relies on three core concepts:
1. **Mouse Tracking**: Capture the user's cursor position (`X` and `Y`) over the screen or a specific container.
2. **Spring Physics**: Instead of rotating instantly, apply `useSpring` to the mouse coordinates to give the rotation weight and momentum.
3. **Axis Mapping**: Use `useTransform` to convert mouse coordinates (e.g., `0px` to `1000px`) into rotation degrees (e.g., `-15deg` to `15deg`).
4. **Z-Axis Separation**: Place multiple elements inside the tilted container and push them back (`translateZ(-50px)`) or forward (`translateZ(50px)`). This creates physical parallax depth when the container rotates.

## 3. Reusable Component Template

Here is a highly reusable `Magnetic3DContainer` component. You can drop this into any project and wrap your content inside it.

```tsx
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Magnetic3DContainerProps {
  children: React.ReactNode;
  tiltRange?: number; // How far it tilts in degrees (default: 15)
}

export default function Magnetic3DContainer({ children, tiltRange = 15 }: Magnetic3DContainerProps) {
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 });

  // 1. Raw Mouse Trackers
  const mouseX = useMotionValue(windowSize.w / 2);
  const mouseY = useMotionValue(windowSize.h / 2);

  // 2. Spring Physics (Buttery Smooth Momentum)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // 3. Map Mouse Position to Rotation Degrees
  // Y-axis mouse movement controls X-axis rotation (tilt up/down)
  const rotateX = useTransform(smoothMouseY, [0, windowSize.h], [tiltRange, -tiltRange]);
  // X-axis mouse movement controls Y-axis rotation (tilt left/right)
  const rotateY = useTransform(smoothMouseX, [0, windowSize.w], [-tiltRange, tiltRange]);

  // Keep window size updated for accurate mapping
  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse anywhere on the screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    // The perspective wrapper is CRITICAL. It defines the depth of the 3D space.
    <div style={{ perspective: 1500 }} className="flex items-center justify-center min-h-screen">
      
      {/* The Magnetic Container */}
      <motion.div
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" // CRITICAL: Allows children to have Z-depth
        }}
        className="relative"
      >
        {children}
      </motion.div>
      
    </div>
  );
}
```

## 4. How to Create Massive Depth (Usage Example)

To make the effect look "mind-blowing", you must use `translateZ` on the child elements inside the container. 

```tsx
import Magnetic3DContainer from './Magnetic3DContainer';

export default function MyHeroSection() {
  return (
    <Magnetic3DContainer tiltRange={20}>
      <div className="relative w-[600px] h-[400px] flex items-center justify-center">
        
        {/* BACKGROUND LAYER (Pushed deep into the screen) */}
        <div 
          className="absolute inset-0 bg-blue-900 rounded-3xl opacity-50"
          style={{ transform: "translateZ(-100px)" }} 
        />

        {/* MIDDLE LAYER (Sits flat at 0px) */}
        <h1 
          className="text-white text-8xl font-black absolute"
        >
          Foreground
        </h1>

        {/* FRONT LAYER (Popping out at the user) */}
        <div 
          className="absolute bottom-10 right-10 bg-yellow-400 p-4 rounded-full text-black font-bold"
          style={{ transform: "translateZ(100px)" }}
        >
          Floating Button!
        </div>

      </div>
    </Magnetic3DContainer>
  );
}
```

## 5. Critical Rules for Success
1. **Perspective Container**: The outermost non-animated div MUST have a `perspective` applied (e.g., `perspective-[1500px]` in Tailwind or `style={{ perspective: 1500 }}`). Without this, 3D rotations will look completely flat.
2. **Preserve 3D**: The `motion.div` that is rotating MUST have `style={{ transformStyle: "preserve-3d" }}`. Without this, the children will be flattened into a 2D plane and `translateZ` won't work.
3. **Z-Translations**: If you just rotate a flat div, it's boring. The magic comes from assigning `translateZ` (or `translateZ(-50px)`) to elements *inside* the rotating container.
