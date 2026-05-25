
import React from 'react';
import { Station, StationStatus } from '../types';
import { getStatusColor, getFillColor } from '../utils/logic';

interface WebDashboardProps {
  stations: Station[];
  onBack: () => void;
  onUpdateLevel: (id: string, level: number) => void;
}

const WebDashboard: React.FC<WebDashboardProps> = ({ stations, onBack, onUpdateLevel }) => {
  const criticalCount = stations.filter(s => s.status === StationStatus.RED).length;
  const warningCount = stations.filter(s => s.status === StationStatus.YELLOW).length;

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">PatiMap Admin</h1>
            <p className="text-gray-500 text-sm font-medium">Merkezi İzleme ve IoT Yönetim Paneli</p>
          </div>
        </div>

        <div className="flex gap-4">
          <StatCard label="Toplam İstasyon" value={stations.length} color="cyan" />
          <StatCard label="Kritik Seviye" value={criticalCount} color="red" />
          <StatCard label="Uyarı Seviyesi" value={warningCount} color="yellow" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Station Table */}
        <div className="col-span-12 lg:col-span-8 bg-[#18181b] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-lg font-bold text-white">İstasyon Durum Takibi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">İstasyon Adı</th>
                  <th className="px-6 py-4">Tür</th>
                  <th className="px-6 py-4">Doluluk Seviyesi</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">Son Güncelleme</th>
                  <th className="px-6 py-4">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-white font-bold text-sm">{station.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase px-2 py-1 bg-gray-800 rounded-md border border-white/5">
                        {station.type === 'Cat' ? 'Kedi' : 'Köpek'}
                      </span>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${getFillColor(station.fillLevel)}`}
                            style={{ width: `${station.fillLevel}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-gray-400">%{station.fillLevel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(station.status)}`}>
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(station.lastUpdated).toLocaleTimeString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onUpdateLevel(station.id, Math.min(100, station.fillLevel + 10))}
                        className="p-2 text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-all active:scale-95"
                        title="Manuel Besleme Ekle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed / System Logs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#18181b] rounded-3xl border border-white/5 p-6 shadow-2xl h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Sistem Logları</h3>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded-full animate-pulse">CANLI</span>
            </div>
            
            <div className="space-y-4">
              <LogEntry 
                time="14:22" 
                msg="Maçka Parkı - Sensör verisi alındı." 
                type="info" 
              />
              <LogEntry 
                time="14:18" 
                msg="Yıldız Parkı - KRİTİK SEVİYE UYARISI!" 
                type="error" 
              />
              <LogEntry 
                time="14:05" 
                msg="Kadıköy - Gönüllü beslemesi doğrulandı." 
                type="success" 
              />
              <LogEntry 
                time="13:55" 
                msg="Sistem - Günlük yedekleme tamamlandı." 
                type="info" 
              />
            </div>

            <button className="w-full mt-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-bold rounded-xl border border-white/5 transition-all">
              Tüm Logları Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: number, color: 'cyan' | 'red' | 'yellow' }) => {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-900/20 border-cyan-800/30 shadow-cyan-900/20',
    red: 'text-red-400 bg-red-900/20 border-red-800/30 shadow-red-900/20',
    yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30 shadow-yellow-900/20'
  };

  return (
    <div className={`px-6 py-4 rounded-2xl border shadow-xl ${colors[color]} flex flex-col min-w-[160px]`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  );
};

const LogEntry = ({ time, msg, type }: { time: string, msg: string, type: 'info' | 'error' | 'success' }) => {
  const typeColors = {
    info: 'bg-blue-500',
    error: 'bg-red-500',
    success: 'bg-emerald-500'
  };

  return (
    <div className="flex gap-4 group">
      <span className="text-[10px] font-mono text-gray-600 pt-1">{time}</span>
      <div className="flex-1 flex gap-3">
        <div className={`w-1 h-1 rounded-full mt-2 ${typeColors[type]}`}></div>
        <p className={`text-xs font-medium leading-relaxed ${type === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
          {msg}
        </p>
      </div>
    </div>
  );
};

export default WebDashboard;
