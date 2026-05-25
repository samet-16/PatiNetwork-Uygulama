
import React from 'react';
import { User } from '../types';
import { MOCK_VOLUNTEERS } from '../constants';

const Leaderboard: React.FC = () => {
  const sortedVolunteers = [...MOCK_VOLUNTEERS].sort((a, b) => b.points - a.points);

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return {
        card: "bg-gradient-to-br from-yellow-500/25 via-[#0f172a] to-yellow-500/5 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.2)]",
        rankColor: "text-yellow-400",
        ring: "border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.6)]",
        title: "PATİ KRALI"
      };
      case 1: return {
        card: "bg-gradient-to-br from-slate-300/20 via-[#0f172a] to-slate-400/5 border-slate-400/40 shadow-[0_0_30px_rgba(148,163,184,0.15)]",
        rankColor: "text-slate-200",
        ring: "border-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]",
        title: "PATİ KAHRAMANI"
      };
      case 2: return {
        card: "bg-gradient-to-br from-orange-700/20 via-[#0f172a] to-orange-600/5 border-orange-600/40 shadow-[0_0_30px_rgba(234,88,12,0.15)]",
        rankColor: "text-orange-400",
        ring: "border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]",
        title: "GÜMÜŞ PENÇE"
      };
      default: return {
        card: "bg-[#0f172a]/60 border-white/5",
        rankColor: "text-zinc-600",
        ring: "border-zinc-800",
        title: ""
      };
    }
  };

  return (
    <div className="space-y-12 pb-32 animate-fade-in font-['Outfit'] px-2">
      {/* Main Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/60 to-cyan-950/40 p-10 rounded-[48px] border-2 border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Onur Panosu</h2>
            <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
                <p className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.5em] drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">Canlı Sıralama</p>
            </div>
          </div>
          <div className="text-6xl drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">🏆</div>
        </div>
      </div>

      {/* Podium (Top 3) */}
      <div className="grid grid-cols-1 gap-6">
        {sortedVolunteers.slice(0, 3).map((vol, index) => {
          const style = getRankStyle(index);
          return (
            <div key={vol.id} className={`relative flex items-center justify-between p-8 rounded-[44px] border-2 transition-all duration-700 hover:scale-[1.03] ${style.card}`}>
              <div className="flex items-center gap-8 relative z-10">
                <div className="flex flex-col items-center">
                   <span className={`text-2xl font-black italic mb-2 ${style.rankColor}`}>#{index + 1}</span>
                   <div className={`w-20 h-20 rounded-[28px] border-2 flex items-center justify-center bg-zinc-950 overflow-hidden ${style.ring}`}>
                      <span className="text-3xl font-black text-white">{vol.displayName.charAt(0)}</span>
                   </div>
                </div>
                <div className="space-y-3">
                  <span className={`text-[10px] font-black tracking-[0.3em] ${style.rankColor}`}>{style.title}</span>
                  <h3 className="text-white font-black text-2xl tracking-tight uppercase">{vol.displayName}</h3>
                </div>
              </div>
              <div className="text-right relative z-10 pr-4">
                <span className={`bottom text-4xl font-black tracking-tighter ${style.rankColor}`}>
                  {vol.points.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] block">PUAN</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* General List */}
      <div className="space-y-4 px-1">
        {sortedVolunteers.slice(3).map((vol, index) => (
          <div key={vol.id} className="group flex items-center justify-between p-6 bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-[35px] hover:border-cyan-500/40 transition-all shadow-xl">
            <div className="flex items-center gap-6">
              <span className="text-white/20 font-black italic text-lg tracking-tighter group-hover:text-cyan-400">#{index + 4}</span>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-sm font-black text-zinc-400">{vol.displayName.charAt(0)}</div>
              <h4 className="text-white font-black text-base tracking-tight uppercase">{vol.displayName}</h4>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-cyan-400 tracking-tighter">{vol.points.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Slogan Update */}
      <div className="flex flex-col items-center justify-center py-20 opacity-80">
        <div className="flex gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
        </div>
        <p className="text-[12px] text-white font-black uppercase tracking-[0.4em] text-center max-w-[320px] leading-relaxed italic animate-fade-in">
          Rekorunu tazeledin! <br/> 
          <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] underline decoration-2">PatiNetwork</span> seninle daha güçlü.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
