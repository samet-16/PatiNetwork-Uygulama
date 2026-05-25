
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout, onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 py-6 px-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-all text-white active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-black text-white tracking-tight">Ayarlar</h1>
      </div>

      <div className="p-6 space-y-8 max-w-md mx-auto w-full">
        {/* Account Section */}
        <section className="space-y-4">
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Hesap Bilgileri</h3>
          <div className="bg-[#121214] rounded-[32px] border border-white/5 p-6 shadow-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 text-xl font-black shadow-inner">
              {user.displayName.charAt(0)}
            </div>
            <div>
              <h4 className="text-white font-bold text-base">{user.displayName}</h4>
              <p className="text-zinc-500 text-xs truncate max-w-[200px]">{user.email || 'E-posta belirtilmedi'}</p>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Uygulama Tercihleri</h3>
          <div className="bg-[#121214] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
            <SettingToggle 
              label="Bildirimler" 
              desc="İstasyon durumu ve güncellemeler" 
              active={notifications} 
              onToggle={() => setNotifications(!notifications)} 
              icon="🔔"
            />
            <SettingToggle 
              label="Karanlık Mod" 
              desc="Matrix görünümünü koru" 
              active={darkMode} 
              onToggle={() => setDarkMode(!darkMode)} 
              icon="🌙"
            />
            <SettingToggle 
              label="Konum Paylaşımı" 
              desc="En yakın istasyonları bulmak için" 
              active={locationSharing} 
              onToggle={() => setLocationSharing(!locationSharing)} 
              icon="📍"
            />
          </div>
        </section>

        {/* Security & Support Section */}
        <section className="space-y-4">
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Destek ve Güvenlik</h3>
          <div className="bg-[#121214] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
             <div className="p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-xl">🛡️</div>
                  <span className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Şifre Değiştir</span>
                </div>
                <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
             </div>
             <div className="p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="text-xl">💬</div>
                  <span className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Bize Ulaşın</span>
                </div>
                <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
             </div>
          </div>
        </section>

        {/* Logout Section */}
        <section className="pt-4">
          <button 
            onClick={() => {
              if(window.confirm("Oturumu kapatmak istediğinizden emin misiniz?")) {
                onLogout();
              }
            }}
            className="w-full bg-red-500/10 border border-red-500/20 py-5 rounded-[28px] flex items-center justify-center gap-3 text-red-500 font-black text-xs uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-900/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Oturumu Kapat
          </button>
          <p className="text-center text-[9px] text-zinc-700 font-black uppercase tracking-widest mt-6">PatiNetwork Matrix v4.2.0 • 2024</p>
        </section>
      </div>
    </div>
  );
};

const SettingToggle = ({ label, desc, active, onToggle, icon }: any) => (
  <div className="p-5 flex items-center justify-between border-b border-white/5 last:border-0">
    <div className="flex items-center gap-4">
      <div className="text-xl">{icon}</div>
      <div>
        <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">{label}</h4>
        <p className="text-[10px] text-zinc-600 font-medium">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default Settings;
