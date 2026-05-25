
import React, { useState, useRef } from 'react';

interface Story {
  id: string;
  user: string;
  time: string;
  status: string;
  statusType: 'home' | 'adoption';
  img: string;
  desc: string;
  likes: number;
  isLiked?: boolean;
  isOwnShare?: boolean;
}

interface HappyEndingsProps {
  onBack: () => void;
  stories: Story[];
  onAddStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onLikeStory: (id: string) => void;
  currentUserName: string;
}

const HappyEndings: React.FC<HappyEndingsProps> = ({ 
  onBack, 
  stories, 
  onAddStory, 
  onDeleteStory, 
  onLikeStory,
  currentUserName 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newStoryDesc, setNewStoryDesc] = useState('');
  const [newStoryImg, setNewStoryImg] = useState<string | null>(null);
  const [newStoryType, setNewStoryType] = useState<'home' | 'adoption'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewStoryImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleShareStory = async () => {
    if (!newStoryDesc.trim() || !newStoryImg) {
      alert("Lütfen bir fotoğraf seçin ve hikayenizi yazın.");
      return;
    }

    setIsSubmitting(true);
    // Yapay zeka analizi veya kayıt simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newStory: Story = {
      id: Date.now().toString(),
      user: currentUserName,
      time: 'Az önce',
      status: newStoryType === 'home' ? 'EVİNE DÖNDÜ!' : 'YUVA OLDU!',
      statusType: newStoryType,
      img: newStoryImg,
      desc: newStoryDesc,
      likes: 0,
      isLiked: false,
      isOwnShare: true
    };

    onAddStory(newStory);
    setNewStoryDesc('');
    setNewStoryImg(null);
    setIsCreating(false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black animate-fade-in relative pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 py-6 px-4 bg-black/40 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
        <button onClick={onBack} className="p-2 text-white hover:bg-white/5 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-white tracking-tight">Mutlu Sonlar</h1>
      </div>

      {/* Hikaye Paylaşma Formu (Modal) */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121214] w-full max-w-md rounded-[40px] p-8 border border-white/5 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-white font-black text-xl uppercase tracking-tighter">Hikayeni Paylaş</h2>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Topluluğa ilham ver</p>
              </div>
              <button onClick={() => setIsCreating(false)} className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all group"
            >
              {newStoryImg ? (
                <img src={newStoryImg} className="w-full h-full object-cover" alt="New Story" />
              ) : (
                <div className="text-center group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-zinc-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fotoğraf Ekle</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setNewStoryType('home')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${newStoryType === 'home' ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/5 text-zinc-500 bg-zinc-900'}`}>Evine Döndü 🏠</button>
              <button onClick={() => setNewStoryType('adoption')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${newStoryType === 'adoption' ? 'bg-cyan-600 border-cyan-600 text-black' : 'border-white/5 text-zinc-500 bg-zinc-900'}`}>Yuva Oldu 💗</button>
            </div>

            <textarea 
                rows={4} 
                value={newStoryDesc} 
                onChange={(e) => setNewStoryDesc(e.target.value)} 
                placeholder="Bu güzel anı birkaç cümleyle anlat..." 
                className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-5 text-sm text-white placeholder-zinc-700 outline-none focus:border-cyan-500/30 resize-none" 
            />
            
            <button 
                onClick={handleShareStory} 
                disabled={isSubmitting}
                className="w-full py-5 bg-cyan-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl shadow-xl shadow-cyan-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'HİKAYEYİ YAYINLA'}
            </button>
          </div>
        </div>
      )}

      {/* Hikaye Listesi */}
      <div className="space-y-8 px-4 pt-8 pb-24">
        {stories.map(story => (
          <div key={story.id} className={`bg-[#121214] rounded-[40px] border overflow-hidden shadow-2xl animate-slide-up relative group ${story.isOwnShare ? 'border-cyan-500/20' : 'border-white/5'}`}>
            {story.isOwnShare && (
              <button onClick={() => onDeleteStory(story.id)} className="absolute top-6 right-6 z-20 p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black ${story.isOwnShare ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500'}`}>{story.user.charAt(0)}</div>
                <div>
                  <h3 className="text-white font-black text-base tracking-tight">{story.user}</h3>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{story.time}</p>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border ${story.statusType === 'home' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20'}`}>{story.status}</div>
            </div>
            <div className="aspect-video w-full overflow-hidden bg-black/40"><img src={story.img} alt="Pet" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
            <div className="p-8">
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium">{story.desc}</p>
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <button 
                    onClick={() => onLikeStory(story.id)} 
                    className={`flex items-center gap-3 transition-all active:scale-90 p-2 -ml-2 rounded-2xl hover:bg-white/5 ${story.isLiked ? 'text-rose-500' : 'text-zinc-500'}`}
                >
                    <svg className="w-6 h-6" fill={story.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="text-sm font-black tracking-tight">{story.likes} Beğeni</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCreating(true)} 
        className="fixed bottom-28 right-8 w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center text-black shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-90 transition-all z-50 border-4 border-[#09090b] rotate-[-5deg]"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      </button>

      <style>{`
        @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default HappyEndings;
