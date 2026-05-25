
import React, { useEffect, useRef, useState } from 'react';
import { Station, StationStatus, AnimalType } from '../types';
import { MOCK_VETS } from '../constants';

interface StationMapProps {
  stations: Station[];
  onSelectStation: (stationId: string) => void;
  selectedStationId: string | null;
}

declare const L: any; // Leaflet is global from script tag

const StationMap: React.FC<StationMapProps> = ({ stations, onSelectStation, selectedStationId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [showStations, setShowStations] = useState(true);
  const [showVets, setShowVets] = useState(true);

  useEffect(() => {
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

    const createStationIcon = (status: StationStatus) => {
      let color = '#10b981';
      if (status === StationStatus.YELLOW) color = '#f59e0b';
      if (status === StationStatus.RED) color = '#ef4444';

      const isCritical = status === StationStatus.RED;

      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute w-4 h-4 bg-red-500/40 rounded-full critical-pulse"></div>` : ''}
            <div class="w-2.5 h-2.5 rounded-full border border-white/80 shadow-sm" style="background-color: ${color};"></div>
          </div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, -8]
      });
    };

    const vetIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="w-5 h-5 bg-emerald-600 rounded-md border border-white shadow-md flex items-center justify-center text-white text-[8px] font-black">
          H
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12]
    });

    if (showStations) {
      stations.forEach(station => {
        const marker = L.marker([station.location.latitude, station.location.longitude], {
          icon: createStationIcon(station.status)
        }).addTo(mapRef.current);

        const popupHtml = `
          <div class="p-4 bg-[#18181b]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[9px] font-black uppercase tracking-widest text-[#00ffff] bg-cyan-900/30 px-2 py-0.5 rounded">İSTASYON</span>
            </div>
            <h4 class="text-white font-black text-sm mb-1">${station.name}</h4>
            <p class="text-zinc-500 text-[10px] mb-3">${station.city} • ${station.type === AnimalType.CAT ? 'Kedi' : 'Köpek'}</p>
            
            <div class="bg-black/40 p-3 rounded-xl border border-white/5 mb-4">
               <div class="flex justify-between items-center mb-1.5">
                  <span class="text-[9px] font-bold text-zinc-400">Mama Seviyesi</span>
                  <span class="text-[10px] font-mono font-black text-white">%${station.fillLevel}</span>
               </div>
               <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full ${station.fillLevel > 50 ? 'bg-emerald-500' : station.fillLevel > 10 ? 'bg-yellow-500' : 'bg-red-500'}" style="width: ${station.fillLevel}%"></div>
               </div>
            </div>

            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${station.location.latitude},${station.location.longitude}', '_blank')" 
              class="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
              YOL TARİFİ
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          onSelectStation(station.id);
        });
        markersRef.current.push(marker);
      });
    }

    if (showVets) {
      MOCK_VETS.forEach(vet => {
        const marker = L.marker([vet.location.latitude, vet.location.longitude], {
          icon: vetIcon
        }).addTo(mapRef.current);

        const popupHtml = `
          <div class="p-4 bg-[#18181b]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded">VETERİNER</span>
            </div>
            <h4 class="text-white font-black text-sm mb-1">${vet.name}</h4>
            <p class="text-zinc-500 text-[10px] mb-4">${vet.city} • ${vet.type}</p>

            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${vet.location.latitude},${vet.location.longitude}', '_blank')" 
              class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
              YOL TARİFİ
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);
        markersRef.current.push(marker);
      });
    }

  }, [stations, showStations, showVets]);

  useEffect(() => {
    if (selectedStationId && mapRef.current) {
      const station = stations.find(s => s.id === selectedStationId);
      if (station) {
        mapRef.current.setView([station.location.latitude, station.location.longitude], 14, { animate: true });
        const marker = markersRef.current.find(m => {
          const pos = m.getLatLng();
          return pos.lat === station.location.latitude && pos.lng === station.location.longitude;
        });
        if (marker) marker.openPopup();
      }
    }
  }, [selectedStationId, stations]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0c0c0e]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[180px] animate-fade-in">
           <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={showStations} 
                    onChange={() => setShowStations(!showStations)}
                    className="peer w-5 h-5 rounded-md border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-zinc-800 text-xs font-bold tracking-tight group-hover:text-blue-600 transition-colors">Besleme Noktaları</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={showVets} 
                    onChange={() => setShowVets(!showVets)}
                    className="peer w-5 h-5 rounded-md border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-zinc-800 text-xs font-bold tracking-tight group-hover:text-blue-600 transition-colors">Veterinerler</span>
              </label>
           </div>
        </div>

        <div className="bg-black/60 backdrop-blur-lg p-3 rounded-2xl border border-white/10 flex flex-col gap-2 pointer-events-none shadow-xl mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Dolu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Azalıyor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 relative">
               <div className="absolute inset-0 bg-red-500/50 rounded-full animate-ping"></div>
            </div>
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Kritik</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationMap;
