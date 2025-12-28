'use client';

import { useEffect, useState, useRef } from 'react';

type Expression = 
  | 'neutral' 
  | 'confusion' 
  | 'suspicion' 
  | 'delight' 
  | 'surprise' 
  | 'content' 
  | 'stoned' 
  | 'angry' 
  | 'sleepy' 
  | 'excited' 
  | 'skeptical' 
  | 'scheming' 
  | 'heart-eyes';

interface ExpressionStyles {
  eyelidTop: string;
  eyelidBottom: string;
  eyebrowL: string;
  eyebrowR: string;
  eyeColor?: string;
  pupilType?: 'default' | 'heart';
}

const expressionMap: Record<Expression, ExpressionStyles> = {
  neutral: {
    eyelidTop: '0%',
    eyelidBottom: '0%',
    eyebrowL: 'translateY(0) rotate(0)',
    eyebrowR: 'translateY(0) rotate(0)',
  },
  confusion: {
    eyelidTop: '10%',
    eyelidBottom: '10%',
    eyebrowL: 'translateY(-25px) rotate(-15deg)',
    eyebrowR: 'translateY(15px) rotate(10deg)',
  },
  suspicion: {
    eyelidTop: '45%',
    eyelidBottom: '45%',
    eyebrowL: 'translateY(20px) rotate(20deg)',
    eyebrowR: 'translateY(20px) rotate(-20deg)',
  },
  delight: {
    eyelidTop: '0%',
    eyelidBottom: '30%',
    eyebrowL: 'translateY(-30px) rotate(-10deg)',
    eyebrowR: 'translateY(-30px) rotate(10deg)',
  },
  surprise: {
    eyelidTop: '-10%',
    eyelidBottom: '-10%',
    eyebrowL: 'translateY(-50px) scaleY(1.3)',
    eyebrowR: 'translateY(-50px) scaleY(1.3)',
  },
  content: {
    eyelidTop: '55%',
    eyelidBottom: '0%',
    eyebrowL: 'translateY(-10px) rotate(0)',
    eyebrowR: 'translateY(-10px) rotate(0)',
  },
  stoned: {
    eyelidTop: '75%',
    eyelidBottom: '15%',
    eyebrowL: 'translateY(10px) rotate(-8deg)',
    eyebrowR: 'translateY(10px) rotate(8deg)',
    eyeColor: '#fee2e2', // red-100
  },
  angry: {
    eyelidTop: '20%',
    eyelidBottom: '0%',
    eyebrowL: 'translateY(15px) rotate(35deg)',
    eyebrowR: 'translateY(15px) rotate(-35deg)',
    eyeColor: '#ffedd5', // orange-100
  },
  sleepy: {
    eyelidTop: '80%',
    eyelidBottom: '0%',
    eyebrowL: 'translateY(5px) rotate(0)',
    eyebrowR: 'translateY(5px) rotate(0)',
  },
  excited: {
    eyelidTop: '0%',
    eyelidBottom: '0%',
    eyebrowL: 'translateY(-40px) rotate(-15deg)',
    eyebrowR: 'translateY(-40px) rotate(15deg)',
  },
  skeptical: {
    eyelidTop: '40%',
    eyelidBottom: '20%',
    eyebrowL: 'translateY(10px) rotate(10deg)',
    eyebrowR: 'translateY(-15px) rotate(-5deg)',
  },
  scheming: {
    eyelidTop: '60%',
    eyelidBottom: '0%',
    eyebrowL: 'translateY(25px) rotate(25deg)',
    eyebrowR: 'translateY(25px) rotate(-25deg)',
  },
  'heart-eyes': {
    eyelidTop: '0%',
    eyelidBottom: '10%',
    eyebrowL: 'translateY(-30px) rotate(-5deg)',
    eyebrowR: 'translateY(-30px) rotate(5deg)',
    eyeColor: '#fce7f3', // pink-100
    pupilType: 'heart',
  },
};

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [expression, setExpression] = useState<Expression>('neutral');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Randomly change expression
  useEffect(() => {
    const timer = setInterval(() => {
      const expressions = Object.keys(expressionMap) as Expression[];
      const randomIdx = Math.floor(Math.random() * expressions.length);
      setExpression(expressions[randomIdx]);
    }, 10000 + Math.random() * 8000);

    return () => clearInterval(timer);
  }, []);

  // Track mouse movement and calculate shared pupil offset
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      const speed = Math.sqrt(dx*dx + dy*dy);

      setMousePos({ x: e.clientX, y: e.clientY });
      setLastMousePos({ x: e.clientX, y: e.clientY });

      // Reactive surprise
      if (speed > 150) {
        setExpression('surprise');
      }

      // Calculate shared pupil offset based on a central point between the eyes
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        // Using a fixed max distance for the shared offset
        const maxDist = 35; // Matches common eye socket size constraints
        
        setPupilOffset({
          x: Math.cos(angle) * maxDist,
          y: Math.sin(angle) * maxDist,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastMousePos]);

  const styles = expressionMap[expression];

  const Eye = ({ side }: { side: 'L' | 'R' }) => (
    <div className="relative flex flex-col items-center">
      {/* Eyebrow */}
      <div 
        className="absolute -top-12 h-5 w-56 bg-slate-800 rounded-full transition-all duration-700 ease-in-out shadow-sm z-20"
        style={{ transform: side === 'L' ? styles.eyebrowL : styles.eyebrowR }}
      />
      
      {/* Eye Socket */}
      <div
        className="relative flex h-72 w-72 items-center justify-center rounded-full bg-white shadow-[inset_0_-10px_30px_rgba(0,0,0,0.15)] overflow-hidden transition-colors duration-1000"
        style={{ backgroundColor: styles.eyeColor || 'white' }}
      >
        {/* Top Eyelid */}
        <div 
          className="absolute top-0 left-0 w-full bg-slate-200 z-10 transition-all duration-500 ease-in-out border-b border-slate-300"
          style={{ height: styles.eyelidTop }}
        />
        
        {/* Bottom Eyelid */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-slate-200 z-10 transition-all duration-500 ease-in-out border-t border-slate-300"
          style={{ height: styles.eyelidBottom }}
        />

        {/* Pupil */}
        <div
          className="h-32 w-32 rounded-full bg-slate-900 transition-transform duration-75 ease-out shadow-2xl relative flex items-center justify-center"
          style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}
        >
          {styles.pupilType === 'heart' ? (
            <svg viewBox="0 0 32 32" className="w-24 h-24 fill-red-500 animate-pulse">
              <path d="M16 28.5L13.7 26.4C5.6 19.1 0.2 14.3 0.2 8.4C0.2 3.6 3.9 0 8.7 0C11.4 0 14 1.3 15.7 3.3C17.4 1.3 20 0 22.7 0C27.5 0 31.2 3.6 31.2 8.4C31.2 14.3 25.8 19.1 17.7 26.4L15.7 28.5H16Z" />
            </svg>
          ) : (
            <>
              {/* Pupil Highlight */}
              <div className="absolute top-6 left-6 h-8 w-8 rounded-full bg-white/20" />
              <div className="absolute bottom-8 right-8 h-4 w-4 rounded-full bg-white/10" />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 overflow-hidden px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
      </div>

      <div ref={containerRef} className="flex gap-24 mb-16 relative z-10">
        <Eye side="L" />
        <Eye side="R" />
      </div>

      <div className="text-center space-y-6 max-w-2xl relative z-10">
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-white drop-shadow-2xl">
            EYE <span className="text-blue-500">TRAKER</span> PRO
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
              Expression: {expression}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 text-slate-700 font-mono text-[10px] uppercase tracking-[0.4em]">
        Neural Stalker Interface v2.6.0 // Autonomously Aware
      </div>
    </main>
  );
}
