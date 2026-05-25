
import React from 'react';

const DeveloperDocs: React.FC = () => {
  const firestoreCollections = [
    {
      name: "users",
      desc: "Kullanıcı profilleri ve sadakat verileri.",
      fields: [
        { key: "uid", type: "string (PK)", note: "Firebase Auth UID" },
        { key: "displayName", type: "string", note: "Kullanıcı adı" },
        { key: "points", type: "number", note: "Toplam kazanılan puan" },
        { key: "role", type: "enum", note: "'admin' | 'user'" },
        { key: "lastKnownLocation", type: "geopoint", note: "En son GPS koordinatı" }
      ],
      relations: "Feedings (1:N), Ads (1:N)"
    },
    {
      name: "stations",
      desc: "IoT cihazlarının anlık telemetri ve durum verileri.",
      fields: [
        { key: "deviceId", type: "string (PK)", note: "IoT MAC adresi / Seri No" },
        { key: "fillLevel", type: "number", note: "0-100 arası doluluk" },
        { key: "status", type: "string", note: "Hesaplanan durum rengi" },
        { key: "telemetry", type: "map", note: "{ battery, temp, rssi }" },
        { key: "lastPing", type: "timestamp", note: "Cihazın son aktif olduğu an" }
      ],
      relations: "Feedings (1:N), Notifications (Trigger)"
    },
    {
      name: "feedings",
      desc: "Gerçekleşen her besleme işleminin kaydı.",
      fields: [
        { key: "id", type: "auto-id", note: "İşlem benzersiz ID" },
        { key: "stationId", type: "reference", note: "Bağlı istasyon ID" },
        { key: "userId", type: "reference", note: "Beslemeyi yapan kullanıcı" },
        { key: "amount", type: "number", note: "Dökülen mama miktarı (gram)" },
        { key: "verificationPhoto", type: "url", note: "Firebase Storage linki" }
      ],
      relations: "Points System (Trigger)"
    },
    {
      name: "community_ads",
      desc: "Sahiplendirme ve kayıp hayvan duyuruları.",
      fields: [
        { key: "adId", type: "auto-id", note: "İlan ID" },
        { key: "type", type: "string", note: "'lost' | 'adoption'" },
        { key: "animalInfo", type: "map", note: "{ breed, color, age, gender }" },
        { key: "status", type: "string", note: "'active' | 'resolved'" }
      ],
      relations: "AI Analysis (Gemini Integration)"
    }
  ];

  return (
    <div className="space-y-12 p-8 bg-[#09090b] text-zinc-300 min-h-screen">
      <div className="relative overflow-hidden bg-emerald-950/20 border border-emerald-500/20 p-10 rounded-[40px] shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">PatiMap Data Engine</h1>
        <p className="text-emerald-500/80 font-bold text-sm tracking-widest uppercase">NoSQL Database Schema Architecture v5.0</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {firestoreCollections.map((col) => (
          <div key={col.name} className="group bg-[#121214] border border-white/5 rounded-[32px] overflow-hidden transition-all hover:border-emerald-500/30 shadow-xl">
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{col.name}</h2>
                </div>
                <p className="text-zinc-500 text-xs mt-2 font-medium italic">{col.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">RELATIONS: {col.relations}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {col.fields.map((f) => (
                  <div key={f.key} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-1 hover:bg-black transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-mono text-sm font-bold">{f.key}</span>
                      <span className="text-[9px] font-black text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded border border-white/5 uppercase">{f.type}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-medium leading-relaxed mt-1 uppercase tracking-tighter">{f.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[40px] space-y-6">
        <h3 className="text-white font-black text-xl uppercase tracking-tighter">Sistem Akış Algoritması (Cloud Functions)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-black/50 rounded-3xl border border-white/5 space-y-3">
             <div className="text-emerald-500 text-2xl">⚡</div>
             <h4 className="text-white font-bold text-sm">Status Trigger</h4>
             <p className="text-zinc-500 text-[11px] leading-relaxed">İstasyonun <code className="text-emerald-400">fillLevel</code> değeri değiştiğinde, sistem otomatik olarak <code className="text-emerald-400">status</code> alanını (Red/Yellow/Green) günceller.</p>
          </div>
          <div className="p-6 bg-black/50 rounded-3xl border border-white/5 space-y-3">
             <div className="text-cyan-500 text-2xl">🔔</div>
             <h4 className="text-white font-bold text-sm">Notification Push</h4>
             <p className="text-zinc-500 text-[11px] leading-relaxed">Status <code className="text-red-500">'Red'</code> olduğunda, 1km yarıçapındaki tüm <code className="text-cyan-400">'active'</code> kullanıcılara anlık bildirim gönderilir.</p>
          </div>
          <div className="p-6 bg-black/50 rounded-3xl border border-white/5 space-y-3">
             <div className="text-yellow-500 text-2xl">🏅</div>
             <h4 className="text-white font-bold text-sm">Reward Engine</h4>
             <p className="text-zinc-500 text-[11px] leading-relaxed">Besleme kaydı oluşturulduğunda kullanıcının <code className="text-yellow-400">points</code> değeri artırılır ve <code className="text-yellow-400">rank</code> tablosu güncellenir.</p>
          </div>
        </div>
      </div>

      <div className="text-center py-10 opacity-20">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">PatiNetwork Data Infrastructure v5.0 - Protected by Matrix</p>
      </div>
    </div>
  );
};

export default DeveloperDocs;
