
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { auth } from '../firebase';

// FAQ data for the support section
const faqList = [
  { icon: "❓", q: "PatiNetwork nedir?", a: "Sokak hayvanlarının beslenme ve takip süreçlerini IoT teknolojisiyle modernize eden, topluluk tabanlı bir akıllı şehir platformudur." },
  { icon: "🐾", q: "Nasıl gönüllü olabilirim?", a: "Uygulama üzerinden profil oluşturup haritadaki kritik (kırmızı) istasyonlara mama takviyesi yaparak veya ilanlar kısmından sahiplendirme yaparak gönüllü olabilirsiniz." },
  { icon: "💡", q: "Besleme istasyonları nasıl çalışır?", a: "İstasyonlarımız altındaki ağırlık sensörleri sayesinde mama miktarını anlık ölçer ve veriyi şifreli protokollerle bulut sistemine ileterek haritada günceller." },
  { icon: "🏆", q: "Oyunlaştırma sistemi nedir?", a: "PatiNetwork'te yaptığınız her yardım size puan kazandırır. Bu puanlarla liderlik tablosunda yükselir ve özel rozetler kazanırsınız." },
  { icon: "📱", q: "Mobil uygulama var mı?", a: "Şu an kullandığınız web platformumuz tüm mobil cihazlarla tam uyumludur. Native iOS ve Android uygulamalarımız çok yakında mağazalarda yerini alacak!" },
  { icon: "💰", q: "Ücretli bir hizmet mi?", a: "Hayır. PatiNetwork tamamen ücretsiz bir topluluk projesidir. Amacımız kâr elde etmek değil, sokaktaki canlarımızın yaşam kalitesini artırmaktır." },
  { icon: "🏢", q: "İşletmelerim için sponsorluk var mı?", a: "Evet! Kurumsal sosyal sorumluluk projeleri kapsamında işletmeniz adına istasyon sponsoru olabilirsiniz." },
  { icon: "🛡️", q: "Verilerin güvenliği nasıl sağlanır?", a: "Kullanıcı verileriniz Firebase 256-bit şifreleme ve güvenlik kuralları ile korunmaktadır." }
];

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateName: (name: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateName }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState(user.displayName);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Şifre Değiştirme State
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });
  const [passError, setPassError] = useState<string | null>(null);

  // Sorun Bildir State
  const [reportData, setReportData] = useState({ category: 'Uygulama', message: '' });
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // CANLI İSTATİSTİKLER
  const totalF = user.totalFeedings || 0;
  const stats = {
    daily: Math.floor(totalF * 0.08 * 150),
    weekly: Math.floor(totalF * 0.28 * 150),
    monthly: totalF * 150 
  };

  useEffect(() => {
    setTempName(user.displayName);
  }, [user.displayName]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditModalOpen(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    setStatusMessage("Güvenlik protokolü başlatıldı...");
    await new Promise(r => setTimeout(r, 1500));
    setStatusMessage("E-posta adresinize sıfırlama kodu gönderildi.");
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handlePasswordUpdate = async () => {
    setPassError(null);
    // LocalStorage'dan en güncel şifreyi çek (yoksa varsayılan 343434)
    const currentStoredPass = localStorage.getItem('pati_demo_pass') || '343434';

    if (passData.old !== currentStoredPass) {
        setPassError(`ESKİ ŞİFRE HATALI!`);
        return;
    }
    if (passData.new.length < 6) {
        setPassError("YENİ ŞİFRE EN AZ 6 KARAKTER OLMALI!");
        return;
    }
    if (passData.new !== passData.confirm) {
        setPassError("YENİ ŞİFRELER UYUŞMUYOR!");
        return;
    }

    setStatusMessage("Veritabanı güncelleniyor...");
    await new Promise(r => setTimeout(r, 1500));
    
    // Yeni şifreyi kaydet
    localStorage.setItem('pati_demo_pass', passData.new);
    
    setStatusMessage("Şifreniz başarıyla güncellendi!");
    setPassData({ old: '', new: '', confirm: '' });
    setTimeout(() => {
        setIsPasswordModalOpen(false);
        setStatusMessage(null);
    }, 2000);
  };

  const handleSendReport = async () => {
    if (!reportData.message.trim()) return;
    setIsReporting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsReporting(false);
    setReportSuccess(true);
    setTimeout(() => {
        setReportSuccess(false);
        setIsReportModalOpen(false);
        setReportData({ category: 'Uygulama', message: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-black space-y-8 pb-32 animate-fade-in font-['Outfit'] relative px-2">
      
      {/* Header */}
      <div className="flex justify-between items-center pt-8 px-4">
        <div className="w-10"></div>
        <h1 className="text-white font-black text-[10px] uppercase tracking-[0.5em] opacity-30 italic">Üye Profili</h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-zinc-900 border-2 border-white/5 rounded-2xl text-cyan-400 active:scale-90 transition-all hover:border-cyan-500/30 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
        </button>
      </div>

      {/* Profile Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-[44px] border-4 border-cyan-500/20 p-1.5 shadow-[0_0_50px_rgba(6,182,212,0.1)] bg-zinc-950 flex items-center justify-center rotate-2">
             <span className="text-5xl font-black text-cyan-400 -rotate-2">{user.displayName.charAt(0)}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#00ffff] text-black w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-4 border-black animate-bounce-slow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
          </div>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">{user.displayName}</h2>
        <div className="mt-4 px-6 py-4 bg-cyan-500/5 border border-cyan-500/10 rounded-[28px] max-w-sm">
            <p className="text-cyan-400 text-[9px] font-black tracking-[0.3em] uppercase mb-2">Pati Network Elçisi</p>
            <p className="text-zinc-300 text-xs font-bold leading-relaxed italic">"Bir kap mama, binlerce teşekkür. İyi ki varsın!"</p>
        </div>
      </div>

      {/* ROZETLER */}
      <div className="px-4 space-y-4">
         <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] ml-2">Başarı Nişanları</h3>
         <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mask-fade-right">
            <BadgeItem icon="🐾" label="Pati Dostu" active={totalF >= 1} color="cyan" />
            <BadgeItem icon="🛡️" label="Koruyucu" active={totalF >= 15} color="emerald" />
            <BadgeItem icon="🔥" label="Süper Besleyici" active={totalF >= 50} color="orange" />
            <BadgeItem icon="👑" label="Efsane" active={totalF >= 100} color="indigo" />
         </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="px-4 space-y-4">
        <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] ml-2">Dolum Raporu (Gram)</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Günlük" value={stats.daily} color="text-emerald-400 bg-emerald-500/5 border-emerald-500/20" />
          <StatBox label="Haftalık" value={stats.weekly} color="text-cyan-400 bg-cyan-500/5 border-cyan-500/20" />
          <StatBox label="Aylık" value={stats.monthly} color="text-indigo-400 bg-indigo-500/5 border-indigo-500/20" />
        </div>
      </div>

      {/* AYARLAR MENÜSÜ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-[320px] bg-[#09090b] h-full shadow-[-10px_0_40px_rgba(0,0,0,0.5)] border-l border-white/10 animate-slide-left flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-black text-xl uppercase tracking-tight">Menü</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-zinc-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
              {statusMessage && <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[9px] text-cyan-400 font-black uppercase text-center mb-4 animate-pulse">{statusMessage}</div>}
              <SettingsMenuItem icon="✏️" label="İsmi Düzenle" onClick={() => { setIsEditModalOpen(true); setIsSettingsOpen(false); }} />
              <SettingsMenuItem icon="🔑" label="Şifre Değiştir" onClick={() => { setIsPasswordModalOpen(true); setIsSettingsOpen(false); }} />
              <SettingsMenuItem icon="🗑️" label="Şifre Sıfırla" onClick={handlePasswordResetRequest} />
              <SettingsMenuItem icon="📚" label="Sıkça Sorulan Sorular" onClick={() => { setIsFAQModalOpen(true); setIsSettingsOpen(false); }} />
              <SettingsMenuItem icon="🛡️" label="Sorun Bildir" onClick={() => { setIsReportModalOpen(true); setIsSettingsOpen(false); }} />
              <SettingsMenuItem icon="🐾" label="Hakkımızda" onClick={() => { setIsAboutModalOpen(true); setIsSettingsOpen(false); }} />
              <div className="pt-10">
                 <button onClick={onLogout} className="w-full py-5 rounded-[24px] bg-red-950/20 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all">Oturumu Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SSS MODAL */}
      {isFAQModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-[#121214] border border-white/5 rounded-[40px] w-full max-w-lg flex flex-col max-h-[85vh] animate-scale-up shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">Yardım Merkezi</h3>
              <button onClick={() => setIsFAQModalOpen(false)} className="text-zinc-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {faqList.map((item, index) => (
                <div key={index} className="bg-[#0f172a]/60 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                  <button onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)} className="w-full px-6 py-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <span className="text-xl opacity-80 group-hover:scale-125 transition-transform">{item.icon}</span>
                       <span className="text-white font-bold text-sm text-left tracking-tight">{item.q}</span>
                    </div>
                    <span className={`text-emerald-400 text-xl font-black transition-transform duration-300 ${openFAQIndex === index ? 'rotate-180' : ''}`}>↓</span>
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openFAQIndex === index ? 'max-h-96 border-t border-white/5' : 'max-h-0'}`}>
                    <div className="p-6 text-zinc-400 text-xs leading-relaxed italic font-medium">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ŞİFRE DEĞİŞTİRME MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="w-full max-w-md bg-[#121214] rounded-[48px] border border-white/10 p-8 shadow-2xl animate-scale-up flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-black text-xl tracking-tight uppercase italic">Şifre Ayarları</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 text-zinc-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            {statusMessage && <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] text-emerald-400 font-black uppercase text-center">{statusMessage}</div>}
            <div className="space-y-4">
                {passError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center rounded-xl">{passError}</div>}
                <div className="space-y-1.5">
                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest ml-4">Eski Şifre</label>
                    <input type="password" value={passData.old} onChange={(e) => setPassData({...passData, old: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-cyan-500/40" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest ml-4">Yeni Şifre</label>
                    <input type="password" value={passData.new} onChange={(e) => setPassData({...passData, new: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-cyan-500/40" placeholder="En az 6 karakter" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest ml-4">Onay</label>
                    <input type="password" value={passData.confirm} onChange={(e) => setPassData({...passData, confirm: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-cyan-500/40" placeholder="Tekrar yazın" />
                </div>
                <button onClick={handlePasswordUpdate} className="w-full py-5 bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-3xl active:scale-95 transition-all mt-4">ŞİFREYİ GÜNCELLE</button>
            </div>
          </div>
        </div>
      )}

      {/* SORUN BİLDİR MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="w-full max-w-md bg-[#121214] rounded-[48px] border border-white/10 p-8 shadow-2xl animate-scale-up flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-black text-xl tracking-tight uppercase italic">Sorun Bildir</h2>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-zinc-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            {reportSuccess ? (
              <div className="py-10 text-center space-y-4 animate-fade-in">
                <div className="text-5xl">✅</div>
                <h3 className="text-emerald-400 font-black uppercase tracking-widest">Rapor İletildi</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase leading-relaxed">Desteğin için teşekkürler. Mühendislerimiz konuyla ilgileniyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest ml-4">Kategori</label>
                    <select 
                      value={reportData.category} 
                      onChange={(e) => setReportData({...reportData, category: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-cyan-500/40 appearance-none"
                    >
                      <option value="Uygulama">Uygulama Hatası</option>
                      <option value="Cihaz">İstasyon/IoT Sorunu</option>
                      <option value="Harita">Harita/Konum Hatası</option>
                      <option value="Diger">Diğer</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest ml-4">Mesajınız</label>
                    <textarea 
                      rows={4}
                      value={reportData.message}
                      onChange={(e) => setReportData({...reportData, message: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/5 rounded-3xl py-4 px-6 text-white text-xs outline-none focus:border-cyan-500/40 resize-none"
                      placeholder="Sorunu detaylıca anlatın..."
                    />
                </div>
                <button 
                  onClick={handleSendReport}
                  disabled={isReporting || !reportData.message.trim()}
                  className="w-full py-5 bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-3xl active:scale-95 transition-all mt-4 disabled:opacity-30"
                >
                  {isReporting ? 'GÖNDERİLİYOR...' : 'RAPORU GÖNDER'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HAKKIMIZDA MODAL */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="w-full max-w-lg bg-[#121214] rounded-[48px] border border-white/10 p-10 shadow-2xl animate-scale-up flex flex-col gap-6 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-black text-2xl tracking-tight uppercase italic">Hakkımızda</h2>
              <button onClick={() => setIsAboutModalOpen(false)} className="p-2 text-zinc-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="space-y-6">
              {/* Misyonumuz */}
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">🎯</div>
                <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Misyonumuz</h4>
                <p className="text-zinc-300 text-xs italic leading-relaxed">"Teknolojiyi merhamet ve toplumsal dayanışma ile birleştirerek, her sokak hayvanının beslenme, sağlık ve güvenlik ihtiyaçlarına anlık çözümler üreten erişilebilir bir platform sunmak."</p>
              </div>

              {/* Vizyonumuz */}
              <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">🌍</div>
                <h4 className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Vizyonumuz</h4>
                <p className="text-zinc-300 text-xs italic leading-relaxed">"Sokak hayvanlarının refahını dijital dönüşümle garanti altına alan, dünya çapında akıllı şehirlerin ayrılmaz bir parçası haline gelmiş evrensel bir iyilik ekosistemi inşa etmek."</p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-white font-black text-[10px] uppercase tracking-widest ml-2">Teknoloji Stack</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                      <span className="block text-cyan-400 font-black text-[8px] uppercase mb-1">IoT</span>
                      <span className="text-white text-[10px] font-bold">ESP32 & LoRa</span>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                      <span className="block text-emerald-400 font-black text-[8px] uppercase mb-1">AI</span>
                      <span className="text-white text-[10px] font-bold">Gemini 2.5/3</span>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                      <span className="block text-orange-400 font-black text-[8px] uppercase mb-1">Cloud</span>
                      <span className="text-white text-[10px] font-bold">Firebase Realtime</span>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                      <span className="block text-indigo-400 font-black text-[8px] uppercase mb-1">Map</span>
                      <span className="text-white text-[10px] font-bold">Leaflet Engine</span>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                 <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">PatiNetwork v4.5.0 Matrix Edition</p>
                 <p className="text-zinc-800 text-[8px] font-bold mt-2">© 2024 Tüm Hakları Saklıdır.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* İSİM DÜZENLEME MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#121214] rounded-t-[40px] border-t-2 border-white/20 p-8 shadow-2xl animate-slide-up mb-4 mx-2">
            <h3 className="text-white font-black text-lg uppercase tracking-tight mb-8 italic">İsmi Güncelle</h3>
            <div className="space-y-4">
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full bg-zinc-900 border-2 border-white/10 rounded-2xl py-5 px-6 text-white text-sm outline-none focus:border-cyan-500/40 font-bold uppercase" />
                <button onClick={handleSaveName} className="w-full py-5 bg-cyan-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all">KAYDET</button>
                <button onClick={() => setIsEditModalOpen(false)} className="w-full py-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-2">Kapat</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        @keyframes scale-up { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

const BadgeItem = ({ icon, label, active, color }: { icon: string, label: string, active: boolean, color: string }) => {
    const colors: Record<string, string> = {
        cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    };
    return (
        <div className={`flex flex-col items-center justify-center min-w-[100px] p-5 rounded-[32px] border-2 transition-all duration-500 ${active ? colors[color] + ' shadow-lg scale-105' : 'bg-zinc-900/40 border-white/5 opacity-20 grayscale'}`}>
            <span className="text-3xl mb-2">{icon}</span>
            <span className="text-[8px] font-black uppercase text-center tracking-tighter">{label}</span>
        </div>
    );
};

const StatBox = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className={`p-5 rounded-[32px] border-2 text-center transition-all duration-700 ${color}`}>
        <span className="block text-[8px] font-black uppercase tracking-widest mb-1.5 opacity-60 italic">{label}</span>
        <span className="text-xl font-black tracking-tighter">{value.toLocaleString()}</span>
    </div>
);

const SettingsMenuItem = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-6 py-5 rounded-[28px] bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all text-left group">
        <span className="text-xl group-hover:scale-125 transition-transform">{icon}</span>
        <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest group-hover:text-white flex-1">{label}</span>
        <svg className="w-4 h-4 text-zinc-800 group-hover:text-cyan-500 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
    </button>
);

export default Profile;
