
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

const VirtualVet: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Selam! Ben Veteriner Hekim Ali. Dostlarımızın sağlığı için modern ve bilimsel çözümlerle buradayım. Giriş ekranındaki o harika enerjiyle devam edelim! Sorununu detaylıca yazabilirsin, her adımı tek tek inceleyelim.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `Sen Uzman Veteriner Hekim Ali'sin. Genç, dinamik ve modern tıbbı takip eden profesyonel bir hekimsin. 
      
      YAZIM KURALLARI VE ÜSLUP:
      - Profesyonel, enerjik ve çözüm odaklı bir dil kullan.
      - Giriş ekranındaki modern cyan/mavi estetiğine uygun bir teknolojik vizyona sahipsin.
      - Cevapların doyurucu, açıklayıcı ve BİLGİ DOLU olsun. 
      - Paragraflara böl ve önemli noktaları madde madde sun.
      - Teknik terimleri halkın anlayabileceği şekilde açıkla ama tıbbi ciddiyetten ödün verme.
      
      İÇERİK KURALLARI:
      - Belirtilen semptomlara yönelik modern veterinerlik tavsiyeleri ver.
      - Yanıtın sonunda, teşhis koymadığını, bu bilgilerin tavsiye niteliğinde olduğunu ve acil durumlarda vakit kaybetmeden bir VETERİNER KLİNİĞİNE gidilmesi gerektiğini net bir cümleyle belirt.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: { 
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      });

      const responseText = response.text || "Şu an yanıtımı oluştururken bir teknik aksaklık yaşadım, lütfen tekrar iletebilir misin?";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Bağlantı hatası oluştu. Lütfen tekrar dene.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-[#09090b] rounded-[48px] border border-white/5 shadow-2xl overflow-hidden animate-slide-up font-['Outfit']">
      {/* Modern Header - Synced with Auth Blue/Cyan */}
      <div className="bg-gradient-to-r from-cyan-600/20 via-cyan-900/10 to-transparent p-6 border-b border-white/5 flex items-center gap-5">
        <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-3xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative group">
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10">👨‍⚕️</span>
        </div>
        <div>
          <h3 className="text-white font-black text-lg tracking-tight uppercase italic">Vet. Ali Hekim</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em]">AI Sağlık Protokolü</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/40 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-5 rounded-[32px] text-sm leading-relaxed shadow-lg transition-all whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-cyan-600 text-black font-bold rounded-tr-none border border-cyan-400/20' 
                : 'bg-zinc-900/80 backdrop-blur-md text-zinc-300 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-[32px] rounded-tl-none flex items-center gap-3 animate-pulse">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-[9px] text-cyan-500 font-black uppercase tracking-[0.4em] ml-2">Teşhis Analizi...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Field */}
      <div className="p-8 bg-black/60 backdrop-blur-xl border-t border-white/5">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Belirti veya bakım sorusu yaz..."
            className="flex-1 bg-zinc-900 border-2 border-white/5 rounded-2xl px-6 py-5 text-sm text-white placeholder-zinc-700 outline-none focus:border-cyan-500/30 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-black w-16 h-16 rounded-2xl transition-all shadow-2xl shadow-cyan-900/20 active:scale-90 flex items-center justify-center"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualVet;
