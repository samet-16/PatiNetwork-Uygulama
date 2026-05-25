
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MOCK_VETS } from '../constants';

interface VetMapScreenProps {
  onBack: () => void;
}

declare const L: any; // Leaflet is global from script tag

const VetMapScreen: React.FC<VetMapScreenProps> = ({ onBack }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedVetId, setSelectedVetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tümü');

  const cities = useMemo(() => {
    return ['Tümü', ...Array.from(new Set(MOCK_VETS.map(v => v.city)))].sort();
  }, []);

  const filteredVets = useMemo(() => {
    return MOCK_VETS.filter(vet => {
      const matchesCity = selectedCity === 'Tümü' || vet.city === selectedCity;
      const matchesSearch = vet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           vet.address_full.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [selectedCity, searchQuery]);

  useEffect(() => {
    if (viewMode !== 'map') {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([39.1, 35.3], 6);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
    }

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const vetIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="w-5 h-5 bg-emerald-600 rounded-md border border-white shadow-md flex items-center justify-center text-white text-[8px] font-black">H</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12]
    });

    const vetsToDisplay = selectedCity === 'Tümü' ? MOCK_VETS : filteredVets;

    vetsToDisplay.forEach(vet => {
      const marker = L.marker([vet.location.latitude, vet.location.longitude], {
        icon: vetIcon
      }).addTo(mapRef.current);

      const popupHtml = `
        <div class="p-4 bg-[#18181b] rounded-2xl min-w-[200px]">
          <h4 class="text-white font-black text-sm mb-1">${vet.name}</h4>
          <p class="text-zinc-500 text-[10px] mb-4">${vet.city} • ${vet.type}</p>
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${vet.location.latitude},${vet.location.longitude}', '_blank')" 
            class="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
            YOL TARİFİ
          </button>
        </div>
      `;
      marker.bindPopup(popupHtml);
      markersRef.current.push(marker);
    });

    if (vetsToDisplay.length > 0 && selectedCity !== 'Tümü') {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viewMode, selectedCity, filteredVets]);

  const focusVet = (vet: any) => {
    setViewMode('map');
    setSelectedVetId(vet.id);
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.setView([vet.location.latitude, vet.location.longitude], 15, { animate: true });
        const marker = markersRef.current.find(m => m.getLatLng().lat === vet.location.latitude);
        if (marker) marker.openPopup();
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#09090b] flex flex-col animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex flex-col border-b border-white/5 bg-black/40 backdrop-blur-xl z-20 shadow-2xl shrink-0">
        <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-3 bg-zinc-900 border border-white/10 rounded-2xl text-white hover:bg-zinc-800 transition-all active:scale-90 shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                    <h2 className="text-white font-black text-lg tracking-tight">Veteriner Klinikleri</h2>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Türkiye Geneli Sağlık Ağı</p>
                </div>
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
                <button 
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'map' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500'}`}
                >
                    Harita
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500'}`}
                >
                    Liste
                </button>
            </div>
        </div>

        {/* Search & City Filter Bar */}
        <div className="px-6 pb-6 space-y-4">
            <div className="relative group">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Klinik adı veya il ara..."
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3.5 px-12 text-sm text-white placeholder-zinc-600 outline-none transition-all shadow-inner focus:border-emerald-500/30"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {cities.map(city => (
                    <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                        selectedCity === city ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/30' : 'bg-zinc-900 text-zinc-500 border-white/5'
                        }`}
                    >
                        {city}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 relative bg-[#0c0c0e] overflow-hidden">
        {viewMode === 'map' ? (
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        ) : (
          <div className="absolute inset-0 flex flex-col overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center bg-black/40 border-b border-white/5 shrink-0">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sonuçlar</span>
              <span className="text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{filteredVets.length} Veteriner Kayıtlı</span>
            </div>
            
            <div className="flex-1 overflow-y-scroll p-6 pr-8 space-y-4 persistent-custom-scrollbar pb-40">
              {filteredVets.length > 0 ? (
                  filteredVets.map(vet => (
                  <div 
                      key={vet.id} 
                      onClick={() => focusVet(vet)}
                      className="bg-[#18181b] border border-white/5 p-5 rounded-[32px] hover:border-emerald-500/30 transition-all cursor-pointer group shadow-xl active:scale-[0.98]"
                  >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-[22px] flex items-center justify-center text-emerald-400 border border-emerald-500/10 text-2xl shadow-inner group-hover:scale-110 transition-transform">🏥</div>
                            <div>
                                <h4 className="text-white font-black text-base tracking-tight group-hover:text-emerald-400 transition-colors">{vet.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{vet.city}</span>
                                    <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{vet.district}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl text-[9px] font-black border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 tracking-widest uppercase">
                            {vet.type}
                        </div>
                      </div>
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center group-hover:bg-black/60 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <p className="text-zinc-400 text-[10px] font-medium leading-relaxed truncate">
                                {vet.address_full}
                            </p>
                        </div>
                        <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M9 5l7 7-7 7" /></svg>
                      </div>
                  </div>
                  ))
              ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 mb-6">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      <h3 className="text-white font-black text-lg">Kayıt Bulunamadı</h3>
                      <button onClick={() => {setSearchQuery(''); setSelectedCity('Tümü');}} className="mt-4 text-emerald-500 text-xs font-black uppercase tracking-widest border-b border-emerald-500/30">Tümünü Göster</button>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .persistent-custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          display: block;
        }
        
        .persistent-custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(18, 18, 20, 0.8);
          border-radius: 10px;
          margin: 10px 0;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .persistent-custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #065f46);
          border-radius: 10px;
          border: 2px solid #0c0c0e;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }
        
        .persistent-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34d399;
        }

        .persistent-custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 rgba(18, 18, 20, 0.8);
          -webkit-overflow-scrolling: touch;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VetMapScreen;
