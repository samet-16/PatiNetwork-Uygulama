
import React, { useState, useMemo } from 'react';
import { Station, StationStatus, Veterinarian, AppNotification } from '../types';
import { MOCK_VETS } from '../constants';

interface PointListProps {
  stations: Station[];
  notifications: AppNotification[];
  onSelectStation: (id: string) => void;
  selectedStationId?: string | null;
  onUpdateFillLevel: (id: string, level: number) => void;
  onAddPoints: (amount: number) => void;
}

const StationList: React.FC<PointListProps> = ({ 
  stations, 
  notifications,
  onUpdateFillLevel,
  onAddPoints
}) => {
  const [activeTab, setActiveTab] = useState<'stations' | 'vets'>('stations');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');

  const cities = useMemo(() => {
    const allCities = [...stations.map(s => s.city), ...MOCK_VETS.map(v => v.city)];
    return ['Tümü', ...Array.from(new Set(allCities))].sort();
  }, [stations]);

  const stats = useMemo(() => {
    return {
      total: stations.length,
      full: stations.filter(s => s.status === StationStatus.GREEN).length,
      decreasing: stations.filter(s => s.status === StationStatus.YELLOW).length,
      critical: stations.filter(s => s.status === StationStatus.RED).length,
    };
  }, [stations]);

  const filteredStations = useMemo(() => {
    return stations.filter(s => selectedCity === 'Tümü' || s.city === selectedCity);
  }, [stations, selectedCity]);

  const filteredVets = useMemo(() => {
    return MOCK_VETS.filter(v => selectedCity === 'Tümü' || v.city === selectedCity);
  }, [selectedCity]);

  const handleManualFill = (stationId: string) => {
    onUpdateFillLevel(stationId, 100);
    onAddPoints(50);
    alert("Teşekkürler! İstasyon manuel olarak dolduruldu. +50 Puan!");
  };

  const getStatusBadgeClass = (status: StationStatus) => {
    switch (status) {
      case StationStatus.GREEN: return 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
      case StationStatus.YELLOW: return 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10';
      case StationStatus.RED: return 'border-red-500/40 text-red-400 bg-red-500/10';
      default: return 'border-zinc-700 text-zinc-500';
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-8 font-['Outfit'] pb-20">
      
      {/* Üst Özet Kartları */}
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-[28px] flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-white">{stats.total}</span>
          <span className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.2em] mt-1">SİSTEM</span>
        </div>
        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-[28px] flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-emerald-400">{stats.full}</span>
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">DOLU</span>
        </div>
        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-[28px] flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-yellow-400">{stats.decreasing}</span>
          <span className="text-[8px] font-black text-yellow-500 uppercase tracking-[0.2em] mt-1">AZALAN</span>
        </div>
        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-[28px] flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-red-400">{stats.critical}</span>
          <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.2em] mt-1">KRİTİK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        <div className="lg:col-span-4 hidden lg:block sticky top-5 h-fit max-h-[85vh] overflow-y-auto persistent-custom-scrollbar space-y-6 bg-[#0f172a]/20 p-6 rounded-[40px] border border-white/5 backdrop-blur-3xl lg:pr-10">
           <div className="flex flex-col border-b border-white/10 pb-4 mb-2">
              <h3 className="text-white font-black text-lg tracking-tighter uppercase italic opacity-70">SENSÖR LOGLARI</h3>
              <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-[0.3em] mt-1">CANLI IoT VERİ AKIŞI</p>
           </div>
           
           <div className="space-y-4">
              {notifications.slice(0, 10).map(n => (
                <div key={n.id} className="flex gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 animate-slide-left">
                   <div className="text-lg">🤖</div>
                   <div className="flex-1">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      <p className="text-[10px] text-zinc-300 leading-tight mt-1">{n.message}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-8 z-20 lg:-ml-6 space-y-6 pl-0 lg:pl-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 ml-1">
                {cities.map(city => (
                <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                    selectedCity === city ? 'bg-cyan-400 text-black border-cyan-400 shadow-md' : 'bg-[#0f172a] text-zinc-500 border-white/5 hover:border-white/20'
                    }`}
                >
                    {city}
                </button>
                ))}
            </div>

            <div className="flex bg-[#0f172a] p-1.5 rounded-[28px] border border-white/10 shadow-xl ml-1">
                <button 
                onClick={() => setActiveTab('stations')} 
                className={`flex-1 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stations' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-zinc-500'}`}
                >
                İstasyonlar
                </button>
                <button 
                onClick={() => setActiveTab('vets')} 
                className={`flex-1 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vets' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-zinc-500'}`}
                >
                Klinikler
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === 'stations' ? (
                filteredStations.map((station) => (
                    <div key={station.id} className="bg-[#111827] border-2 border-white/5 rounded-[40px] p-7 shadow-2xl space-y-6 relative overflow-hidden group">
                    
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-white font-black text-lg tracking-tighter uppercase">{station.name}</h3>
                                <span className="px-3 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-cyan-500/10">SENSÖR AKTİF</span>
                            </div>
                            <div className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                                {station.city} • {station.address_full}
                            </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black border tracking-widest ${getStatusBadgeClass(station.status)}`}>
                            {station.fillLevel > 70 ? 'DOLU' : station.fillLevel > 20 ? 'AZALIYOR' : 'KRİTİK'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Mama Miktarı</span>
                            <span className={`font-black text-3xl tracking-tighter ${station.fillLevel < 20 ? 'text-red-500' : 'text-white'}`}>%{station.fillLevel}</span>
                        </div>
                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full transition-all duration-[2000ms] ${
                                station.fillLevel > 70 ? 'bg-emerald-500' : station.fillLevel > 20 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                              }`}
                              style={{ width: `${station.fillLevel}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                          onClick={() => handleManualFill(station.id)}
                          className="flex-1 py-4 bg-white text-black rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all hover:bg-cyan-400"
                        >
                          DOLUM YAP
                        </button>
                        <button 
                          onClick={() => openInMaps(station.location.latitude, station.location.longitude)}
                          className="w-16 bg-[#0f172a] border border-white/20 text-white rounded-[24px] flex items-center justify-center hover:border-cyan-400 transition-all"
                        >
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                filteredVets.map((vet) => (
                    <div key={vet.id} className="bg-[#111827] border-2 border-white/5 p-7 rounded-[40px] shadow-xl space-y-6 animate-slide-up group transition-all hover:border-emerald-500/30">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-[20px] flex items-center justify-center text-emerald-400 border border-emerald-500/10 text-3xl">🏥</div>
                            <div>
                                <h3 className="text-white font-black text-lg tracking-tighter uppercase">{vet.name}</h3>
                                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-0.5 italic">{vet.city} / {vet.district}</p>
                            </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl text-[8px] font-black border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 tracking-widest uppercase">{vet.type}</div>
                        </div>
                        <button 
                            onClick={() => openInMaps(vet.location.latitude, vet.location.longitude)}
                            className="w-full bg-emerald-600 text-white py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg hover:bg-emerald-500"
                        >
                            ACİL YOL TARİFİ
                        </button>
                    </div>
                ))
                )}
            </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slide-left { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-left { animation: slide-left 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .persistent-custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .persistent-custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default StationList;
