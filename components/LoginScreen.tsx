
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface LoginScreenProps {
  onLogin: (identifier: string, name?: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting || isSuccess) return;
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          displayName: fullName || 'Pati Dostu',
          email: email,
          points: 100,
          location: { latitude: 41.0082, longitude: 28.9784 },
          role: 'user',
          status: 'active',
          totalFeedings: 0,
          createdAt: new Date().toISOString()
        });

        setIsSuccess(true);
        setTimeout(() => onLogin(user.uid, fullName), 1000);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setIsSuccess(true);
        setTimeout(() => onLogin(userCredential.user.uid), 1000);
      }
    } catch (err: any) {
      setError(err.message?.toUpperCase() || "BAĞLANTI HATASI!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center transition-all duration-1000 ${isSuccess ? 'bg-[#083344]' : 'bg-black'} font-rounded px-8`}>
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.03] paw-pattern-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      
      <div className={`relative w-full max-w-[340px] z-10 transition-all duration-1000 flex flex-col items-center justify-center ${error ? 'animate-shake' : ''}`}>
        
        {/* BRANDING AREA - SYNCED WITH DASHBOARD TYPOGRAPHY */}
        <div className="flex flex-col items-center mb-12 animate-float">
          <div className="relative w-24 h-24 flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
              <g transform="translate(15, 15) scale(0.7)" fill="white">
                <path d="M50 55 C35 55 25 65 25 75 C25 88 35 95 50 95 C65 95 75 88 75 75 C75 65 65 55 50 55 Z" />
                <circle cx="22" cy="45" r="10" />
                <circle cx="40" cy="25" r="10" />
                <circle cx="60" cy="25" r="10" />
                <circle cx="78" cy="45" r="10" />
              </g>
            </svg>
          </div>
          
          <div className="text-center space-y-1">
            <h1 className="text-white text-4xl font-black tracking-tight font-rounded leading-tight">
              Pati<span className="text-cyan-400 italic">Network</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-pulse"></span>
              <p className="text-cyan-400/80 font-bold uppercase tracking-[0.3em] text-[9px] font-rounded">Akıllı Besleme Sistemi</p>
            </div>
          </div>
        </div>

        {/* LOGIN FORM - SaaS MINIMALISM */}
        <div className="w-full bg-white/[0.03] backdrop-blur-3xl rounded-[44px] p-8 border border-white/5 shadow-2xl space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4 font-rounded">Ad Soyad</label>
              <input 
                type="text" 
                placeholder="Örn: Deniz Yılmaz"
                className="w-full bg-black/40 border border-white/5 rounded-[24px] py-4 px-6 text-sm text-white focus:border-cyan-400/40 outline-none transition-all placeholder:text-zinc-800 font-rounded"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4 font-rounded">E-Posta</label>
            <input 
              type="email" 
              placeholder="e-posta@adresiniz.com"
              className="w-full bg-black/40 border border-white/5 rounded-[24px] py-4 px-6 text-sm text-white focus:border-cyan-400/40 outline-none transition-all placeholder:text-zinc-800 font-rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4 font-rounded">Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/5 rounded-[24px] py-4 px-6 text-sm text-white focus:border-cyan-400/40 outline-none transition-all placeholder:text-zinc-800 font-rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[24px] shadow-2xl btn-saas mt-6 font-rounded"
          >
            {isSubmitting ? "BAĞLANILIYOR..." : mode === 'login' ? "GİRİŞ YAP" : "KAYIT OL"}
          </button>

          <div className="pt-4 text-center">
             <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors font-rounded"
             >
               {mode === 'login' ? "HESABIN YOK MU? KAYIT OL" : "ZATEN ÜYE MİSİN? GİRİŞ YAP"}
             </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-6 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
            <p className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center font-rounded">{error}</p>
          </div>
        )}

        {/* BOTTOM MOTIVATION */}
        <div className="mt-16 text-center">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] italic animate-pulse font-rounded">
              Yolun düşerse, <span className="text-cyan-400/40 italic">iyilik bırak!</span>
            </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default LoginScreen;
