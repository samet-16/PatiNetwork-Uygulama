
import React, { useState } from 'react';

interface DashboardProps {
  onNavigate: (tab: any, params?: any) => void;
  onOpenChat: () => void;
  userName: string;
}

const MiniAIRobot = () => (
  <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
    <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-full animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full drop-shadow-[0_2px_5px_rgba(234,179,8,0.4)]">
       <rect x="25" y="35" width="50" height="40" rx="10" fill="#1e293b" stroke="#eab308" strokeWidth="3" />
       <rect x="35" y="15" width="30" height="25" rx="8" fill="#1e293b" stroke="#eab308" strokeWidth="3" />
       <circle cx="43" cy="27" r="3" fill="#eab308" className="animate-pulse" />
       <circle cx="57" cy="27" r="3" fill="#eab308" className="animate-pulse" />
       <line x1="50" y1="15" x2="50" y2="8" stroke="#eab308" strokeWidth="3" />
       <circle cx="50" cy="5" r="3" fill="#eab308" />
    </svg>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenChat, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'İlan & Sahiplendirme', icon: '🐾', tab: 'ads' },
    { label: 'Veteriner Haritası', icon: '🏥', tab: 'vetMap' },
    { label: 'Aşı Takvimi', icon: '💉', tab: 'vaccine' },
    { label: 'Pati Studio AI', icon: '🪄', tab: 'studio' },
    { label: 'Mutlu Sonlar', icon: '💗', tab: 'happyEndings' },
    { label: 'Liderlik Tablosu', icon: '🏆', tab: 'leaderboard' },
    { label: 'Geliştirici Dokümanları', icon: '📂', tab: 'docs' },
  ];

  const activities = [
    { id: 1, user: 'Ayşe Y.', initials: 'AY', action: 'Cumhuriyet Parkı istasyonuna mama bıraktı. 🍲', time: '2dk' },
    { id: 2, user: 'Mehmet K.', initials: 'MK', action: 'Yeni bir "Kayıp Kedi" ilanı oluşturdu. 🐱', time: '15dk' },
    { id: 3, user: 'Sistem', initials: 'S', action: 'Sahil Yolu istasyonu doluluk seviyesi kritik! 🚨', time: '1sa' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
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
            <div className="p-6 border-t border-white/5">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">PatiNetwork v3.0</p>
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
            <h2 className="text-xl font-black text-white leading-tight">Merhaba, {userName}!</h2>
            <p className="text-gray-500 text-xs font-medium">Bugün bir patiye dokunmaya ne dersin?</p>
          </div>
        </div>
        <button onClick={() => onNavigate('profile')} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-white/10 overflow-hidden shadow-lg shadow-black/20">
          <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#18181b] p-8 rounded-[24px] border border-white/5 flex flex-col items-center justify-center text-center shadow-xl">
           <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 text-orange-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17,5C15.9,5 15,5.9 15,7C15,8.1 15.9,9 17,9C18.1,9 19,8.1 19,7C19,5.9 18.1,5 17,5M7,5C5.9,5 5,5.9 5,7C5,8.1 5.9,9 7,9C8.1,9 9,8.1 9,7C9,5.9 8.1,5 7,5M17,11C15,11 13.3,12.3 12.6,14H11.4C10.7,12.3 9,11 7,11C4.2,11 2,13.2 2,16C2,18.8 4.2,21 7,21C9,21 10.7,19.7 11.4,18H12.6C13.3,19.7 15,21 17,21C19.8,21 22,18.8 22,16C22,13.2 19.8,11 17,11Z" /></svg>
           </div>
           <span className="text-3xl font-black text-white">128</span>
           <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Doldurulan Kap</span>
        </div>
        <div className="bg-[#18181b] p-8 rounded-[24px] border border-white/5 flex flex-col items-center justify-center text-center shadow-xl">
           <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-4 text-teal-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
           </div>
           <span className="text-3xl font-black text-white">~350</span>
           <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Mutlu Pati</span>
        </div>
      </div>

      {/* HIZLI İŞLEMLER */}
      <section>
        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">HIZLI İŞLEMLER</h3>
        <div className="grid grid-cols-4 gap-3">
          <QuickAction 
            label="İlan Aç" 
            color="text-orange-500" 
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>} 
            onClick={() => onNavigate('ads')}
          />
          <QuickAction 
            label="Harita" 
            color="text-teal-500" 
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} 
            onClick={() => onNavigate('map')}
          />
          <QuickAction 
            label="Vet Bul" 
            color="text-rose-500" 
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/></svg>} 
            onClick={() => onNavigate('vetMap')}
          />
          <QuickAction 
            label="Asistan" 
            color="text-yellow-500" 
            icon={<MiniAIRobot />} 
            onClick={onOpenChat}
          />
        </div>
      </section>

      {/* YAKININDAKİ HAREKETLİLİK */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">YAKININDAKİ HAREKETLİLİK</h3>
          <button className="text-orange-500 text-xs font-bold">Tümü</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {activities.map(activity => (
             <div key={activity.id} className="min-w-[280px] bg-[#18181b] p-5 rounded-[24px] border border-white/5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-300">
                        {activity.initials}
                      </div>
                      <h4 className="text-white font-bold text-sm">{activity.user}</h4>
                   </div>
                   <span className="text-zinc-600 text-[10px] font-bold">{activity.time}</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                   {activity.action}
                </p>
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
