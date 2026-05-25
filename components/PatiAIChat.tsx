
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Station, ChatMessage, StationStatus } from '../types';

interface PatiAIChatProps {
  stations: Station[];
  initialQuery?: string;
  onClose: () => void;
}

interface MapGroundingResult {
  title: string;
  uri: string;
  address?: string;
}

const CuteGarfieldAvatar = () => (
  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 relative overflow-hidden">
    <div className="absolute inset-0 bg-orange-500/10 blur-md animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="w-10 h-10 relative z-10">
      {/* Kulaklar */}
      <path d="M30 35 L20 15 L45 25 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <path d="M70 35 L80 15 L55 25 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      {/* Kafa */}
      <circle cx="50" cy="55" r="30" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
      {/* Gözler */}
      <circle cx="42" cy="50" r="6" fill="white" />
      <circle cx="58" cy="50" r="6" fill="white" />
      <circle cx="42" cy="50" r="3" fill="#1e293b" />
      <circle cx="58" cy="50" r="3" fill="#1e293b" />
      {/* Burun */}
      <path d="M48 60 L52 60 L50 63 Z" fill="#f43f5e" />
    </svg>
  </div>
);

const PatiAIChat: React.FC<PatiAIChatProps> = ({ stations, initialQuery, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Mmm... Selam! Ben Garfield. Normalde uyuyor olurdum ama sokaktaki dostlarımızın mama kaplarının boşaldığını duyunca uyandım. Lazanya kadar lezzetli olmasa da, hangi kapların dolması gerektiğini sana söyleyebilirim. Nasıl yardımcı olayım?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mapResults, setMapResults] = useState<MapGroundingResult[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mapResults]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  async function playAudio(base64Data: string) {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    
    const decodeBase64 = (base64: string) => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    };

    const audioData = decodeBase64(base64Data);
    const dataInt16 = new Int16Array(audioData.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    setIsSpeaking(true);
    source.start();
  }

  const generateSpeech = async (text: string) => {
    if (!process.env.API_KEY) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Konuş: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) await playAudio(base64Audio);
    } catch (e) {
      console.error("TTS Error:", e);
    }
  };

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || !process.env.API_KEY) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setMapResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const stationInfo = stations.map(s => `- ${s.name}: %${s.fillLevel} Dolu (${s.status === StationStatus.RED ? 'ACİL/BOŞ' : s.status === StationStatus.YELLOW ? 'AZALIYOR' : 'DOLU'}), Konum: ${s.location.latitude}, ${s.location.longitude}`).join('\n');
      
      const systemInstruction = `Sen Garfield, PatiMap ekosisteminin uykulu ama çok zeki kedi asistanısın. 
      KİŞİLİK: Biraz alaycı, lazanya aşığı, pazartesilerden nefret eden ama sokaktaki kardeşlerine (kedi ve köpekler) karşı son derece şefkatli bir karakterin var.
      
      CANLI VERİLER:
      ${stationInfo}

      GÖREVİN:
      1. Kullanıcıya hangi mama kaplarının boş olduğunu (Kırmızı durumlar) Garfield tarzı bir dille ama aciliyetini vurgulayarak söyle.
      2. Veteriner önerirken en rahat, en güvenli olanları seçmeye çalış.
      3. Sorulara cevap verirken araya bazen "Keşke şu an lazanya yiyor olsaydım" gibi küçük espriler serpiştir ama asla asıl yardımı aksatma.
      4. Durum Mantığı: %20 altı (KRİTİK - KIRMIZI), %20-70 arası (AZALIYOR - SARI), %70 üzeri (DOLU - YEŞİL).`;

      let responseText = "";
      const isMapQuery = /nerede|yakın|veteriner|konum|adres|gitmek|vet|klinik|hastane/i.test(textToSend);

      if (isMapQuery) {
        let userLat = 41.0082;
        let userLng = 28.9784;
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
        } catch (e) {}

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: textToSend,
          config: {
            systemInstruction,
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: { latLng: { latitude: userLat, longitude: userLng } }
            }
          },
        });
        responseText = response.text || "Pazartesi sendromu galiba, şu an haritaya bakamıyorum.";
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
           const results: MapGroundingResult[] = chunks
             .filter((c: any) => c.maps?.uri)
             .map((c: any) => ({ title: c.maps.title, uri: c.maps.uri, address: c.maps.address }));
           setMapResults(results);
        }
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: textToSend,
          config: { 
            systemInstruction,
            thinkingConfig: isThinkingMode ? { thinkingBudget: 32768 } : undefined
          }
        });
        responseText = response.text || "Uykum geldi galiba, ne demiştin?";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: responseText }]);
      await generateSpeech(responseText.split('\n')[0]); 

    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Hata: Birisi lazanyamı çalmış olabilir, sistem hata veriyor.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] rounded-t-[48px] shadow-2xl border-x border-t border-white/10 overflow-hidden font-['Outfit']">
      <div className="bg-gradient-to-r from-orange-500/20 to-amber-600/20 p-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <CuteGarfieldAvatar />
          <div>
            <h3 className="text-white font-black text-xl tracking-tight uppercase italic">Garfield Asistan</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
              <p className="text-[9px] text-orange-400 font-black uppercase tracking-[0.3em]">Mama Dedektifi Aktif</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isThinkingMode ? 'text-orange-400' : 'text-zinc-500'}`}>Analiz Modu</span>
                <div className="relative">
                    <input type="checkbox" checked={isThinkingMode} onChange={() => setIsThinkingMode(!isThinkingMode)} className="sr-only" />
                    <div className={`w-10 h-5 rounded-full transition-colors ${isThinkingMode ? 'bg-orange-500' : 'bg-zinc-800'}`}></div>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isThinkingMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
            </label>
            <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-zinc-500 hover:text-white border border-white/5 active:scale-90 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-black/20 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[85%] p-5 rounded-[32px] text-sm leading-relaxed shadow-xl border ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-black font-bold border-orange-400 rounded-tr-none' 
                : msg.isError 
                  ? 'bg-red-900/20 text-red-400 border-red-500/20 rounded-tl-none'
                  : 'bg-zinc-900 border-white/5 text-zinc-300 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {mapResults.length > 0 && (
          <div className="grid grid-cols-1 gap-4 animate-slide-up pt-4">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pl-2">Kedi Gözüyle Sonuçlar</h4>
            {mapResults.map((res, i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-[32px] flex flex-col gap-4 shadow-2xl hover:border-orange-500/20 transition-all group">
                <div className="flex gap-4">
                     <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center border border-orange-500/10 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>
                     </div>
                     <div className="flex-1">
                        <p className="text-white font-black text-base uppercase tracking-tight">{res.title}</p>
                        <p className="text-zinc-500 text-[11px] mt-1 italic font-medium truncate">{res.address || "Konum detayları yüklendi."}</p>
                     </div>
                </div>
                <a href={res.uri} target="_blank" rel="noopener noreferrer" className="w-full bg-orange-500 text-black py-4 rounded-2xl text-[10px] font-black text-center flex items-center justify-center gap-3 hover:bg-orange-400 transition-all active:scale-95">
                  KONUMA GİT
                </a>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
             <div className="bg-zinc-900 border border-orange-500/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{isThinkingMode ? 'Büyük Veri Analizi Yapılıyor...' : 'Asistan Yazıyor...'}</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 bg-[#09090b] border-t border-white/5">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Boş kapları sor veya bir kedi tavsiyesi iste..."
            className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white placeholder-zinc-700 outline-none focus:border-orange-500/40 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-orange-500 text-black w-16 h-16 rounded-2xl transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center active:scale-90 disabled:opacity-30"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatiAIChat;
