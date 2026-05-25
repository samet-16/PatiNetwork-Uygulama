
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  isFading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isFading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 40); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } px-10`}
    >
      <div className="absolute inset-0 opacity-[0.05] paw-pattern-overlay"></div>
      
      <div className="flex flex-col items-center space-y-12 relative z-10 w-full max-w-[320px] animate-fade-in">
        <div className="w-24 h-24 relative animate-soft-pulse">
            <div className="absolute inset-0 bg-cyan-400/20 blur-[50px] rounded-full scale-125"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
              <g transform="translate(15, 15) scale(0.7)" fill="white">
                <path d="M50 55 C35 55 25 65 25 75 C25 88 35 95 50 95 C65 95 75 88 75 75 C75 65 65 55 50 55 Z" />
                <circle cx="22" cy="45" r="10" />
                <circle cx="40" cy="25" r="10" />
                <circle cx="60" cy="25" r="10" />
                <circle cx="78" cy="45" r="10" />
              </g>
            </svg>
        </div>

        <div className="text-center space-y-4 font-rounded">
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight font-rounded">
              Pati<span className="text-cyan-400">Network</span>
            </h1>
            <p className="text-[#F0F0F0] text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">
              Yolun düşerse, <span className="text-cyan-400">İyilik Bırak!</span>
            </p>
        </div>

        <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_#ffffff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style>{`
        @keyframes soft-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
        }
        .animate-soft-pulse { animation: soft-pulse 4s infinite ease-in-out; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default SplashScreen;
