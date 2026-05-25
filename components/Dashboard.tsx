
import React, { useState } from 'react';
import { User } from '../types';

interface Story {
  id: string;
  user: string;
  time: string;
  status: string;
  statusType: 'home' | 'adoption';
  img: string;
  desc: string;
  likes: number;
  isLiked?: boolean;
}

interface DashboardProps {
  onNavigate: (tab: any, params?: any) => void;
  onOpenChat: () => void;
  user: User;
  recentStories: Story[];
  onLikeStory: (id: string) => void;
}

const PetBowlIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 17C2 15.8954 2.89543 15 4 15H20C21.1046 15 22 15.8954 22 17V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V17Z" fill="currentColor"/>
    <path opacity="0.4" d="M4 15C4 11 7 8 12 8C17 8 20 11 20 15H4Z" fill="currentColor"/>
    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V8H9V5Z" fill="currentColor" opacity="0.6"/>
  </svg>
);

const CuteOrangeCat = () => (
  <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
    <div className="absolute inset-0 bg-orange-500/30 blur-md rounded-full animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full drop-shadow-[0_2px_5px_rgba(249,115,22,0.4)]">
      {/* Kulaklar */}
      <path d="M25 35 L15 15 L40 25 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <path d="M75 35 L85 15 L60 25 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      {/* Kafa */}
      <circle cx="50" cy="55" r="35" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
      {/* Gözler */}
      <circle cx="38" cy="50" r="7" fill="white" />
      <circle cx="62" cy="50" r="7" fill="white" />
      <circle cx="38" cy="50" r="4" fill="#1e293b" />
      <circle cx="62" cy="50" r="4" fill="#1e293b" />
      {/* Burun ve Ağız */}
      <path d="M47 62 L53 62 L50 65 Z" fill="#f43f5e" />
      <path d="M40 70 Q50 80 60 70" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenChat, user, recentStories, onLikeStory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'İlan & Sahiplendirme', icon: '🐾', tab: 'ads' },
    { label: 'Veteriner Haritası', icon: '🏥', tab: 'vetMap' },
    { label: 'Aşı Takvimi', icon: '💉', tab: 'vaccine' },
    { label: 'Sanal Veteriner', icon: '👨‍⚕️', tab: 'virtualVet' },
    { label: 'Mutlu Sonlar', icon: '💗', tab: 'happyEndings' },
    { label: 'Liderlik Tablosu', icon: '🏆', tab: 'leaderboard' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative font-rounded">
      {/* Sidebar Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-[280px] bg-[#09090b] z-[110] border-r border-white/5 animate-slide-right flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-white text-lg font-black tracking-tight">PatiMenu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => { onNavigate(item.tab); setIsMenuOpen(false); }} 
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all text-left group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-gray-300 font-bold text-sm group-hover:text-white">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-3 bg-[#18181b] rounded-xl border border-white/5 text-gray-400 active:scale-90 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">Selam, <span className="text-cyan-400">{user.displayName}!</span></h2>
            <p className="text-gray-500 text-xs font-medium">Bugün bir patiye dokunmaya ne dersin?</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Updated with White Borders & New Icon */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111113] p-8 rounded-[32px] border-2 border-white/10 hover:border-white/30 transition-all flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
           <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <PetBowlIcon />
           </div>
           <span className="text-4xl font-black text-white tracking-tighter">{user.totalFeedings || 0}</span>
           <span className="text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Doldurulan Kap</span>
        </div>
        <div className="bg-[#111113] p-8 rounded-[32px] border-2 border-white/10 hover:border-white/30 transition-all flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
           <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
           </div>
           <span className="text-4xl font-black text-white tracking-tighter">{user.points || 0}</span>
           <span className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Pati Puan</span>
        </div>
      </div>

      {/* HIZLI İŞLEMLER */}
      <section>
        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">HIZLI İŞLEMLER</h3>
        <div className="grid grid-cols-4 gap-3">
          <QuickAction label="İlan Aç" color="text-orange-500" icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>} onClick={() => onNavigate('ads')} />
          <QuickAction label="Harita" color="text-teal-500" icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} onClick={() => onNavigate('map')} />
          <QuickAction label="Vet Bul" color="text-rose-500" icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/></svg>} onClick={() => onNavigate('vetMap')} />
          <QuickAction label="Garfield" color="text-orange-500" icon={<CuteOrangeCat />} onClick={onOpenChat} />
        </div>
      </section>

      {/* Mutlu Son Hikayeleri */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">GÜNCEL HAREKETLİLİK</h3>
          <button onClick={() => onNavigate('happyEndings')} className="text-cyan-500 text-xs font-bold">Tümü</button>
        </div>
        <div className="space-y-4">
           {recentStories.slice(0, 2).map(story => (
             <div key={story.id} className="bg-[#18181b] p-5 rounded-[24px] border border-white/5 shadow-lg flex gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  <img src={story.img} className="w-full h-full object-cover" alt="Story" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white font-bold text-sm">{story.user}</h4>
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">{story.status}</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] line-clamp-2 mt-1">"{story.desc}"</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-right { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-slide-right { animation: slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ label, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-[#18181b] aspect-square rounded-[20px] border border-white/5 flex flex-col items-center justify-center gap-3 group active:scale-95 transition-all shadow-lg"
  >
    <div className={`${color} transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <span className="text-gray-300 text-[10px] font-bold tracking-tight">{label}</span>
  </button>
);

export default Dashboard;
