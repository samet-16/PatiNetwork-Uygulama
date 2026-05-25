import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const PatiStudio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt || !process.env.API_KEY) return;

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: `Edit this pet photo according to this instruction: ${prompt}. Return only the edited image.` }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("AI Studio Error:", error);
      alert("Düzenleme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
        <h2 className="text-2xl font-black uppercase tracking-tight">Pati Studio AI 🪄</h2>
        <p className="text-cyan-100 text-xs mt-1">Sokak hayvanlarının fotoğraflarını yapay zeka ile profesyonelleştirin.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
            selectedImage ? 'border-cyan-500/50' : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          {resultImage ? (
            <img src={resultImage} alt="Edited" className="w-full h-full object-cover" />
          ) : selectedImage ? (
            <div className="relative w-full h-full">
              <img src={selectedImage} alt="Original" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="bg-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">Görsel Seçildi</span>
              </div>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-500 text-sm font-medium">Fotoğraf Yükle</span>
            </>
          )}
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
        </div>

        {selectedImage && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Örn: 'Fotoğrafa retro bir filtre ekle', 'Arka planı yemyeşil bir park yap'..."
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 outline-none min-h-[100px] resize-none"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                 <button 
                  onClick={() => setPrompt('Retro filtre ekle')}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-[10px] rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  Retro
                </button>
                <button 
                  onClick={() => setPrompt('Arka planı park yap')}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-[10px] rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  Park
                </button>
              </div>
            </div>

            <button
              onClick={handleEdit}
              disabled={isProcessing || !prompt}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isProcessing 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/40 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Düzenleniyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Sihri Uygula
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {resultImage && (
        <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-2xl flex items-center gap-3 animate-bounce-short">
           <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
           </div>
           <div>
              <p className="text-sm font-bold text-emerald-400">Pati Hazır!</p>
              <p className="text-[10px] text-emerald-500/80">Artık bu harika fotoğrafı paylaşabilirsin.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatiStudio;