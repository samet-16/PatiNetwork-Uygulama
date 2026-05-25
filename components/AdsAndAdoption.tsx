
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Ad {
  id: string;
  baslik: string;
  aciklama: string;
  sehir: string;
  iletisim: string;
  resimUrl: string;
  tur: string;
  olusturulmaTarihi: string;
  yayinlayan: string;
  isOwn?: boolean;
}

interface AdsAndAdoptionProps {
  onBack: () => void;
}

const AdsAndAdoption: React.FC<AdsAndAdoptionProps> = ({ onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'myAds' | 'create'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);

  // Mevcut kullanıcıyı localstorage'dan al (Demo için)
  const currentUser = JSON.parse(localStorage.getItem('patimap_active_session') || '{"displayName": "Pati Dostu"}');

  useEffect(() => {
    const savedAds = localStorage.getItem('patinetwork_ads');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    } else {
      const defaultAds: Ad[] = [
        {
          id: "101",
          baslik: "Kayıp Beyaz Kedi - Pamuk",
          aciklama: "Beşiktaş Çarşı civarında kayboldu. Kırmızı tasması var.",
          sehir: "İstanbul",
          iletisim: "0532 000 00 00",
          resimUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400",
          tur: "Kedi",
          olusturulmaTarihi: new Date(Date.now() - 86400000).toISOString(),
          yayinlayan: "Deniz A.",
          isOwn: false
        },
        {
          id: "102",
          baslik: "Sahiplendirme: Altın Kalpli Golden",
          aciklama: "Bahçeli ev arıyoruz, tüm aşıları tam.",
          sehir: "Ankara",
          iletisim: "0544 111 22 33",
          resimUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400",
          tur: "Köpek",
          olusturulmaTarihi: new Date(Date.now() - 3600000).toISOString(),
          yayinlayan: "Mert Y.",
          isOwn: false
        }
      ];
      setAds(defaultAds);
      localStorage.setItem('patinetwork_ads', JSON.stringify(defaultAds));
    }
  }, []);

  const saveAdsToLocal = (updatedAds: Ad[]) => {
    setAds(updatedAds);
    localStorage.setItem('patinetwork_ads', JSON.stringify(updatedAds));
  };

  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    sehir: '',
    iletisim: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
      analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    if (!process.env.API_KEY) return;
    setIsAnalyzing(true);
    setDetectedType(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            { text: "Resimdeki canlı 'Kedi' mi yoksa 'Köpek' mi? Sadece tek bir kelime dön." }
          ]
        }
      });

      const result = response.text.trim();
      setDetectedType(result.includes('Kedi') ? 'Kedi' : result.includes('Köpek') ? 'Köpek' : 'Diğer');
    } catch (error) {
      setDetectedType('Bilinmeyen');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateAd = async () => {
    if (!formData.baslik || !formData.aciklama || !formData.sehir || !formData.iletisim || !selectedImage) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAd: Ad = {
        id: Date.now().toString(),
        baslik: formData.baslik,
        aciklama: formData.aciklama,
        sehir: formData.sehir,
        iletisim: formData.iletisim,
        resimUrl: selectedImage,
        tur: detectedType || 'Bilinmeyen',
        olusturulmaTarihi: new Date().toISOString(),
        yayinlayan: currentUser.displayName,
        isOwn: true
      };

      const updatedAds = [newAd, ...ads];
      saveAdsToLocal(updatedAds);

      setFormData({ baslik: '', aciklama: '', sehir: '', iletisim: '' });
      setSelectedImage(null);
      setDetectedType(null);
      setActiveSubTab('all'); // Direkt akışa yönlendir
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    const isFound = window.confirm("Can dostumuz bulunduğu veya sahiplenildiği için mi siliyorsunuz? \n\n(Evet derseniz kutlama başlatacağız!)");
    
    setDeletingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedAds = ads.filter(ad => ad.id !== id);
      saveAdsToLocal(updatedAds);
      
      if (isFound) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAds = activeSubTab === 'myAds' ? ads.filter(ad => ad.isOwn) : ads;

  return (
    <div className="flex flex-col min-h-screen bg-black animate-fade-in text-gray-200 relative font-rounded">
      
      {showCelebration && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {[...Array(30)].map((_, i) => (
               <div key={i} className="confetti" style={{
                 left: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 3}s`,
                 backgroundColor: ['#00ffff', '#ec4899', '#f59e0b', '#10b981', '#ffffff'][Math.floor(Math.random() * 5)]
               }}></div>
             ))}
          </div>
          <div className="relative z-10 space-y-6 animate-bounce-slow flex flex-col items-center">
            <div className="text-8xl mb-4 drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">🏆</div>
            <h2 className="text-4xl font-black text-white tracking-tighter">HAYATA DOKUNDUN!</h2>
            <p className="text-xl text-cyan-400 font-bold max-w-sm">
              Bir dostumuzun daha yaşamına ışık oldun. Duyarlılığın için tüm pati topluluğu adına teşekkürler!
            </p>
            <button 
              onClick={() => setShowCelebration(false)}
              className="mt-8 px-10 py-4 bg-[#00ffff] text-black font-black rounded-full text-sm uppercase tracking-widest shadow-lg shadow-cyan-500/40 active:scale-95 transition-all"
            >
              HARİKA!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 py-6 px-4 bg-black/40 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
        <button onClick={onBack} className="p-2.5 bg-zinc-900 rounded-2xl border border-white/10 text-cyan-400 hover:text-white transition-all active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none uppercase italic">İlan Merkezi</h1>
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-1">Sahiplendirme ve Kayıp İhbarları</p>
        </div>
      </div>

      {/* Tri-Tab Navigation */}
      <div className="px-4 mt-6">
        <div className="flex bg-zinc-900/50 p-1.5 rounded-[24px] border border-white/5 w-full">
          <button 
            onClick={() => setActiveSubTab('all')}
            className={`flex-1 py-3.5 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'all' ? 'bg-[#00ffff] text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500'}`}
          >
            İLAN AKIŞI
          </button>
          <button 
            onClick={() => setActiveSubTab('myAds')}
            className={`flex-1 py-3.5 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'myAds' ? 'bg-[#00ffff] text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500'}`}
          >
            İLANLARIM
          </button>
          <button 
            onClick={() => setActiveSubTab('create')}
            className={`flex-1 py-3.5 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'create' ? 'bg-white text-black shadow-lg' : 'text-zinc-500'}`}
          >
            YENİ EKLE
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto no-scrollbar">
        {activeSubTab === 'create' ? (
          <div className="space-y-6 max-w-md mx-auto animate-slide-up">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video w-full rounded-[40px] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${selectedImage ? 'border-cyan-500/60 shadow-2xl shadow-cyan-500/10' : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50'}`}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                  <div className={`absolute top-4 left-4 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/10 ${isAnalyzing ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
                    {isAnalyzing ? "Analiz Ediliyor..." : `Tespit: ${detectedType || 'Pati'}`}
                  </div>
                </>
              ) : (
                <div className="text-center text-zinc-600 group">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/5 transition-transform group-hover:scale-110">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-[0.2em]">Pati Fotoğrafı Ekle</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>

            {selectedImage && (
              <div className="space-y-4 animate-fade-in">
                <input 
                  type="text" 
                  placeholder="İLAN BAŞLIĞI"
                  className="w-full bg-zinc-900 border border-white/5 rounded-3xl py-5 px-6 text-xs font-black uppercase tracking-widest outline-none focus:border-cyan-500/40"
                  value={formData.baslik}
                  onChange={(e) => setFormData({...formData, baslik: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="ŞEHİR" className="w-full bg-zinc-900 border border-white/5 rounded-3xl py-5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500/40" value={formData.sehir} onChange={(e) => setFormData({...formData, sehir: e.target.value})} />
                  <input type="tel" placeholder="İLETİŞİM" className="w-full bg-zinc-900 border border-white/5 rounded-3xl py-5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500/40" value={formData.iletisim} onChange={(e) => setFormData({...formData, iletisim: e.target.value})} />
                </div>
                <textarea 
                  rows={4}
                  placeholder="HİKAYENİZ VEYA DURUM DETAYLARI..."
                  className="w-full bg-zinc-900 border border-white/5 rounded-3xl py-5 px-6 text-xs font-bold outline-none focus:border-cyan-500/40 resize-none"
                  value={formData.aciklama}
                  onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                />
                <button 
                  onClick={handleCreateAd}
                  disabled={isSubmitting || isAnalyzing}
                  className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-zinc-800 text-zinc-600' : 'bg-cyan-600 text-white shadow-2xl active:scale-95'}`}
                >
                  {isSubmitting ? "YAYINLANIYOR..." : "İLANİ YAYINLA"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 max-w-md mx-auto">
            {filteredAds.length > 0 ? (
              filteredAds.map(ad => (
                <div 
                  key={ad.id} 
                  className={`bg-[#121214] border-2 border-white/5 rounded-[44px] p-6 flex flex-col gap-5 shadow-2xl transition-all relative overflow-hidden group ${deletingId === ad.id ? 'opacity-40 blur-sm' : 'hover:border-cyan-500/20'}`}
                >
                  {ad.isOwn && (
                    <button 
                      onClick={() => handleDeleteAd(ad.id)}
                      disabled={deletingId === ad.id}
                      className="absolute top-6 right-6 z-10 p-3.5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}

                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-[28px] overflow-hidden border border-white/10 shadow-lg bg-zinc-800 shrink-0">
                      <img src={ad.resimUrl} className="w-full h-full object-cover" alt="Pet" />
                    </div>
                    <div className="flex-1 pr-10">
                      <h4 className="text-white font-black text-base tracking-tight leading-tight mb-1 italic uppercase">{ad.baslik}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[8px] font-black uppercase text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md tracking-widest border border-cyan-500/10">{ad.tur}</span>
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{ad.sehir}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-5 rounded-[32px] border border-white/5 space-y-4">
                    <p className="text-zinc-400 text-xs leading-relaxed italic font-medium">"{ad.aciklama}"</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/10">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12,12A4,4 0 1,1 16,8A4,4 0 0,1 12,12M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
                          </div>
                          <div>
                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Yayınlayan</p>
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">{ad.yayinlayan}</span>
                          </div>
                       </div>
                       <a href={`tel:${ad.iletisim}`} className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10 active:scale-90 transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" /></svg>
                       </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 opacity-40">
                <div className="text-6xl">📭</div>
                <h3 className="text-white font-black text-base uppercase tracking-widest">Henüz İlan Yok</h3>
                <button 
                  onClick={() => setActiveSubTab('create')}
                  className="px-8 py-3 bg-cyan-900/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest border border-cyan-500/20 rounded-2xl"
                >
                  İLK İLANİ SEN VER
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .confetti { position: absolute; width: 8px; height: 8px; top: -10px; border-radius: 2px; animation: confetti-fall 3s linear infinite; }
        @keyframes confetti-fall { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      `}</style>
    </div>
  );
};

export default AdsAndAdoption;
