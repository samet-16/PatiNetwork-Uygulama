
import React, { useState, useEffect } from 'react';
import { Station, User, Tab, AppNotification, StationStatus } from './types';
import { INITIAL_STATIONS, MOCK_USER } from './constants';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

import Profile from './components/Profile';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import AdsAndAdoption from './components/AdsAndAdoption';
import VaccineSchedule from './components/VaccineSchedule';
import HappyEndings from './components/HappyEndings';
import VetMapScreen from './components/VetMapScreen';
import Leaderboard from './components/Leaderboard';
import VirtualVet from './components/VirtualVet';
import StationMap from './components/StationMap';
import StationList from './components/StationList';
import NotificationPanel from './components/NotificationPanel';
import PatiAIChat from './components/PatiAIChat';
import AuthScreen from './components/AuthScreen';

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
  isOwnShare?: boolean;
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showChat, setShowChat] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('patimap_active_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isInitializingAuth, setIsInitializingAuth] = useState(!user);
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('pati_happy_endings');
    return saved ? JSON.parse(saved) : [
      { id: '1', user: 'Ayşe Y.', time: '2 gün önce', status: 'EVİNE DÖNDÜ!', statusType: 'home', img: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800', desc: "Kedimiz Duman'ı bulduk! Çok mutluyuz.", likes: 128, isLiked: false },
      { id: '2', user: 'Caner B.', time: '5 saat önce', status: 'YUVA OLDU!', statusType: 'adoption', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800', desc: "Yeni dostumuz Paşa evine alıştı.", likes: 245, isLiked: false }
    ];
  });

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 2500);
    const removeTimer = setTimeout(() => setShowSplash(false), 3500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let userData: User;
          if (userDoc.exists()) {
            userData = { ...(userDoc.data() as User), id: firebaseUser.uid };
          } else {
            userData = {
              id: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Pati Dostu',
              points: 100,
              totalFeedings: 0,
              location: { latitude: 41.0082, longitude: 28.9784 }
            } as User;
          }
          setUser(userData);
          localStorage.setItem('patimap_active_session', JSON.stringify(userData));
        } catch (e) {
          console.warn("Firebase sync error.");
        }
      }
      setIsInitializingAuth(false);
    });

    return () => { 
      clearTimeout(fadeTimer); 
      clearTimeout(removeTimer); 
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setStations(currentStations => {
        let newNotifications: AppNotification[] = [];

        const updatedStations = currentStations.map(station => {
          if (station.fillLevel > 0) {
            const decreaseAmount = Math.floor(Math.random() * 8 + 2);
            const newLevel = Math.max(0, station.fillLevel - decreaseAmount);
            
            if (newLevel < 70 && station.fillLevel >= 70) {
              newNotifications.push({
                id: `warn_${station.id}_${Date.now()}`,
                type: 'warning',
                title: '📉 MAMA AZALIYOR',
                message: `${station.name} mama seviyesi azalmaya başladı.`,
                timestamp: new Date().toISOString(),
                isRead: false
              });
            }

            if (newLevel < 20 && station.fillLevel >= 20) {
              newNotifications.push({
                id: `crit_${station.id}_${Date.now()}`,
                type: 'critical',
                title: '🚨 KRİTİK SEVİYE',
                message: `${station.name} kritik eşiğin altına indi!`,
                timestamp: new Date().toISOString(),
                isRead: false
              });
            }

            if (newLevel === 0 && station.fillLevel > 0) {
              newNotifications.push({
                id: `empty_${station.id}_${Date.now()}`,
                type: 'emergency',
                title: '⚠️ MAMA TAMAMEN BİTTİ!',
                message: `${station.name} MAMA KABI BOŞALDI. ACİL DOLUM GEREKLİ!`,
                timestamp: new Date().toISOString(),
                isRead: false
              });
            }

            return { 
              ...station, 
              fillLevel: newLevel,
              status: newLevel < 20 ? StationStatus.RED : newLevel < 70 ? StationStatus.YELLOW : StationStatus.GREEN
            };
          }
          return station;
        });

        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev]);
        }

        return updatedStations;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [!!user]);

  // KULLANICI ÖDÜL SİSTEMİ (DOLUM YAPILDIĞINDA)
  const handleStationFillReward = async (amount: number) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      points: (user.points || 0) + amount,
      totalFeedings: (user.totalFeedings || 0) + 1 
    };

    setUser(updatedUser);
    localStorage.setItem('patimap_active_session', JSON.stringify(updatedUser));

    // Firebase Güncelleme (Gerçek moddaysa)
    if (user.id !== 'demo_user_nisa') {
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          points: increment(amount),
          totalFeedings: increment(1)
        });
      } catch (err) {
        console.warn("Cloud update failed, saved locally.");
      }
    }
  };

  const handleUpdateName = async (newName: string) => {
    if (!user) return;
    const updatedUser = { ...user, displayName: newName };
    setUser(updatedUser);
    localStorage.setItem('patimap_active_session', JSON.stringify(updatedUser));
    
    if (user.id !== 'demo_user_nisa') {
        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, { displayName: newName });
        } catch (err) {
            console.warn("Cloud update failed, saved locally.");
        }
    }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) {}
    localStorage.removeItem('patimap_active_session');
    setUser(null);
    setActiveTab('home');
  };

  // MUTLU SON HİKAYE FONKSİYONLARI
  const handleLikeStory = (id: string) => {
    setStories(prev => {
      const newStories = prev.map(s => {
        if (s.id === id) {
          const isLiked = !s.isLiked;
          return {
            ...s,
            isLiked,
            likes: isLiked ? s.likes + 1 : Math.max(0, s.likes - 1)
          };
        }
        return s;
      });
      localStorage.setItem('pati_happy_endings', JSON.stringify(newStories));
      return newStories;
    });
  };

  const handleDeleteStory = (id: string) => {
    if (!window.confirm("Bu hikayeyi kalıcı olarak silmek istediğinden emin misin?")) return;
    setStories(prev => {
      const newStories = prev.filter(s => s.id !== id);
      localStorage.setItem('pati_happy_endings', JSON.stringify(newStories));
      return newStories;
    });
  };

  if (showSplash) return <SplashScreen isFading={isFading} />;
  if (!user && !isInitializingAuth) return <AuthScreen onLogin={(id, name) => setUser({ ...MOCK_USER, id, displayName: name || 'Pati Dostu' })} />;
  if (!user) return <div className="min-h-screen bg-black" />;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-200 font-sans paw-pattern-overlay overflow-hidden">
      
      {showChat && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/60 backdrop-blur-xl animate-fade-in">
           <div className="h-[85vh] w-full max-w-2xl mx-auto shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
              <PatiAIChat stations={stations} onClose={() => setShowChat(false)} />
           </div>
        </div>
      )}

      <main className={`flex-1 w-full mx-auto relative z-10 transition-all duration-500 ${
        activeTab === 'map' ? 'p-0 max-w-none' : 
        activeTab === 'list' ? 'max-w-6xl p-5 pb-28' : 'max-w-lg p-5 pb-28'
      }`}>
        
        {activeTab === 'home' && (
          <Dashboard 
            onNavigate={(tab) => setActiveTab(tab)} 
            onOpenChat={() => setShowChat(true)} 
            user={user} 
            recentStories={stories} 
            onLikeStory={handleLikeStory}
          />
        )}
        
        {activeTab === 'ads' && <AdsAndAdoption onBack={() => setActiveTab('home')} />}
        {activeTab === 'vaccine' && <VaccineSchedule onBack={() => setActiveTab('home')} />}
        {activeTab === 'happyEndings' && (
          <HappyEndings 
            onBack={() => setActiveTab('home')} 
            stories={stories} 
            onAddStory={(s) => {
              const newStories = [s, ...stories];
              setStories(newStories);
              localStorage.setItem('pati_happy_endings', JSON.stringify(newStories));
            }} 
            onDeleteStory={handleDeleteStory} 
            onLikeStory={handleLikeStory} 
            currentUserName={user.displayName} 
          />
        )}
        {activeTab === 'vetMap' && <VetMapScreen onBack={() => setActiveTab('home')} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'virtualVet' && <VirtualVet />}
        {activeTab === 'notifications' && (
          <NotificationPanel 
            notifications={notifications} 
            onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))} 
            onClearAll={() => setNotifications([])} 
          />
        )}

        {activeTab === 'map' && (
          <div className="fixed inset-0 z-40 bg-black flex flex-col pb-20">
             <div className="px-6 py-5 flex items-center gap-4 border-b border-white/5 bg-black">
                <button onClick={() => setActiveTab('home')} className="p-3 bg-zinc-900 rounded-2xl text-cyan-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                <h2 className="text-white font-extrabold uppercase tracking-tighter">İstasyon Haritası</h2>
             </div>
             <StationMap stations={stations} selectedStationId={null} onSelectStation={() => {}} />
          </div>
        )}

        {activeTab === 'list' && (
          <StationList 
            stations={stations} 
            notifications={notifications}
            onUpdateFillLevel={(id, level) => setStations(prev => prev.map(s => s.id === id ? { ...s, fillLevel: level, status: StationStatus.GREEN } : s))} 
            onSelectStation={() => {}} 
            onAddPoints={handleStationFillReward} 
          />
        )}
        
        {activeTab === 'profile' && (
          <Profile 
            user={user} 
            onLogout={handleLogout} 
            onUpdateName={handleUpdateName}
          />
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-22 px-2">
          <NavBtn active={activeTab === 'home'} icon={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />} label="Keşfet" onClick={() => setActiveTab('home')} />
          <NavBtn active={activeTab === 'map'} icon={<path d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.13a2 2 0 011.106-1.789L9 1m0 19l6-3m-6 3V1m6 16l5.447 2.724A2 2 0 0021 18.512V8.158a2 2 0 00-1.106-1.789L15 4m0 13V4m0 0L9 1" />} label="Harita" onClick={() => setActiveTab('map')} />
          <NavBtn active={activeTab === 'list'} icon={<path d="M4 6h16M4 12h16M4 18h16" />} label="Cihazlar" onClick={() => setActiveTab('list')} />
          <NavBtn 
            active={activeTab === 'notifications'} 
            icon={<path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />} 
            label="Bildirim" 
            onClick={() => setActiveTab('notifications')} 
            badge={unreadCount > 0}
          />
          <NavBtn active={activeTab === 'profile'} icon={<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />} label="Profil" onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
    </div>
  );
};

const NavBtn = ({ active, icon, label, onClick, badge }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 h-full relative space-y-1 transition-colors ${active ? 'text-cyan-400' : 'text-zinc-600'}`}>
    <div className="relative">
      <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">{icon}</svg>
      {badge && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>}
    </div>
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
