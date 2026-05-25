
import React from 'react';
import { AppNotification } from '../types';

interface NotificationPanelProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAsRead, onClearAll }) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-black rounded-xl text-zinc-600 font-['Outfit']">
        <div className="w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center mb-6 border border-white/5">
          <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p className="text-lg font-black uppercase tracking-widest text-white">Sistem Sakin</p>
        <p className="text-xs uppercase tracking-tighter mt-1">Tüm IoT cihazları normal çalışıyor. 🐾</p>
      </div>
    );
  }

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'emergency':
        return {
          bg: 'bg-fuchsia-500/10 border-fuchsia-500/40 shadow-[0_10px_30px_rgba(217,70,239,0.2)]',
          iconBg: 'bg-fuchsia-500/20 text-fuchsia-400',
          indicator: 'bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,1)]'
        };
      case 'critical':
        return {
          bg: 'bg-red-500/10 border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.1)]',
          iconBg: 'bg-red-500/20 text-red-400',
          indicator: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)]'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/5 border-yellow-500/20 shadow-[0_10px_30px_rgba(234,179,8,0.05)]',
          iconBg: 'bg-yellow-500/20 text-yellow-400',
          indicator: 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,1)]'
        };
      default:
        return {
          bg: 'bg-[#0f172a] border-white/5',
          iconBg: 'bg-cyan-500/20 text-cyan-400',
          indicator: 'bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,1)]'
        };
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col font-['Outfit'] animate-fade-in pb-20">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex flex-col">
          <h3 className="font-black text-white text-2xl tracking-tighter uppercase flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
            BİLDİRİMLER
          </h3>
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Sistem Telemetri Kayıtları</span>
        </div>
        <button 
          onClick={onClearAll}
          className="text-[10px] text-red-400 font-black uppercase tracking-widest px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
        >
          Temizle
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          return (
            <div 
              key={notification.id}
              onClick={() => onMarkAsRead(notification.id)}
              className={`relative p-6 rounded-[32px] border-2 transition-all duration-300 cursor-pointer overflow-hidden group ${styles.bg}`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-start gap-5">
                  <div className={`mt-1 p-3 rounded-2xl ${styles.iconBg}`}>
                    {notification.type === 'emergency' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : notification.type === 'critical' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-black text-sm uppercase tracking-tight ${notification.type === 'emergency' ? 'text-fuchsia-400' : notification.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-2 font-medium leading-relaxed italic opacity-90">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(notification.timestamp).toLocaleTimeString('tr-TR')}
                      </span>
                      {notification.type === 'emergency' && (
                        <span className="text-[8px] font-black text-fuchsia-500 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20 uppercase animate-pulse">ALARM: HEMEN DOLUM</span>
                      )}
                      {notification.type === 'critical' && (
                        <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">Acil Durum</span>
                      )}
                    </div>
                  </div>
                </div>
                {!notification.isRead && (
                  <span className={`w-2.5 h-2.5 rounded-full absolute top-4 right-4 animate-pulse ${styles.indicator}`}></span>
                )}
              </div>
              {/* IoT Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPanel;
