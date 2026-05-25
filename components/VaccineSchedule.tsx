
import React, { useState, useEffect } from 'react';

interface Vaccine {
  id: string;
  date: string;
  title: string;
  priority: 'Zorunlu' | 'Önemli' | 'Rutin';
  status: 'planlandı' | 'yapıldı';
  isDone: boolean;
}

interface Pet {
  id: string;
  name: string;
  icon: string;
  type: 'Kedi' | 'Köpek' | 'Diğer';
  age: string;
  breed?: string;
}

interface VaccineScheduleProps {
  onBack: () => void;
}

const DEFAULT_CAT_VACCINES = (petId: string): Vaccine[] => [
  { id: `${petId}-v1`, title: 'Karma Aşı 1', date: '2025-05-10', priority: 'Zorunlu', status: 'planlandı', isDone: false },
  { id: `${petId}-v2`, title: 'İç & Dış Parazit', date: '2025-04-15', priority: 'Zorunlu', status: 'planlandı', isDone: false },
  { id: `${petId}-v3`, title: 'Kuduz Aşısı', date: '2025-06-20', priority: 'Zorunlu', status: 'planlandı', isDone: false },
];

const DEFAULT_DOG_VACCINES = (petId: string): Vaccine[] => [
  { id: `${petId}-v1`, title: 'Karma Aşı (DHPPI)', date: '2025-05-15', priority: 'Zorunlu', status: 'planlandı', isDone: false },
  { id: `${petId}-v2`, title: 'Kennel Cough', date: '2025-06-01', priority: 'Önemli', status: 'planlandı', isDone: false },
  { id: `${petId}-v3`, title: 'Kuduz Aşısı', date: '2025-07-10', priority: 'Zorunlu', status: 'planlandı', isDone: false },
];

const DEFAULT_OTHER_VACCINES = (petId: string): Vaccine[] => [
  { id: `${petId}-v1`, title: 'Genel Sağlık Kontrolü', date: '2025-05-01', priority: 'Önemli', status: 'planlandı', isDone: false },
  { id: `${petId}-v2`, title: 'Parazit Bakımı', date: '2025-06-15', priority: 'Rutin', status: 'planlandı', isDone: false },
];

const VaccineSchedule: React.FC<VaccineScheduleProps> = ({ onBack }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Vaccine[]>>({});
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isAddVaccineModalOpen, setIsAddVaccineModalOpen] = useState(false);
  
  const [newPet, setNewPet] = useState({ name: '', type: 'Kedi' as 'Kedi' | 'Köpek' | 'Diğer', breed: '', age: '' });
  const [newVaccine, setNewVaccine] = useState({ title: '', date: '', priority: 'Zorunlu' as any });

  // Veri Yükleme - v10 (Gelişmiş CRUD)
  useEffect(() => {
    const savedPets = localStorage.getItem('pati_health_v10_pets');
    const savedSchedules = localStorage.getItem('pati_health_v10_schedules');

    if (savedPets && savedSchedules) {
      const parsedPets = JSON.parse(savedPets);
      setPets(parsedPets);
      setSchedules(JSON.parse(savedSchedules));
      if (parsedPets.length > 0) setSelectedPetId(parsedPets[0].id);
    } else {
      const initialPets: Pet[] = [
        { id: 'p1', name: 'Sarı', icon: '🐱', type: 'Kedi', age: '2 Aylık', breed: 'Tekir' },
        { id: 'p2', name: 'Duman', icon: '🐈', type: 'Kedi', age: '1.5 Yaş', breed: 'Van Kedisi' },
        { id: 'p3', name: 'Zeytin', icon: '🐶', type: 'Köpek', age: '3 Yaş', breed: 'Labrador' }
      ];

      const initialSchedules: Record<string, Vaccine[]> = {};
      initialPets.forEach(pet => {
        initialSchedules[pet.id] = pet.type === 'Kedi' ? DEFAULT_CAT_VACCINES(pet.id) : DEFAULT_DOG_VACCINES(pet.id);
      });

      setPets(initialPets);
      setSchedules(initialSchedules);
      setSelectedPetId(initialPets[0].id);
    }
  }, []);

  useEffect(() => {
    if (pets.length >= 0) {
      localStorage.setItem('pati_health_v10_pets', JSON.stringify(pets));
      localStorage.setItem('pati_health_v10_schedules', JSON.stringify(schedules));
    }
  }, [pets, schedules]);

  const activePet = pets.find(p => p.id === selectedPetId);
  const currentSchedule = schedules[selectedPetId] || [];

  const handleAddPet = () => {
    if (!newPet.name) return;
    const id = `pet_${Date.now()}`;
    let petIcon = '🐾';
    if (newPet.type === 'Kedi') petIcon = '🐱';
    if (newPet.type === 'Köpek') petIcon = '🐶';

    const petEntry: Pet = { id, name: newPet.name, type: newPet.type, icon: petIcon, age: newPet.age || 'Bilinmiyor', breed: newPet.breed || 'Karma' };
    const initialVac = newPet.type === 'Kedi' ? DEFAULT_CAT_VACCINES(id) : newPet.type === 'Köpek' ? DEFAULT_DOG_VACCINES(id) : DEFAULT_OTHER_VACCINES(id);

    setPets([...pets, petEntry]);
    setSchedules({ ...schedules, [id]: initialVac });
    setSelectedPetId(id);
    setIsAddPetModalOpen(false);
    setNewPet({ name: '', type: 'Kedi', breed: '', age: '' });
  };

  /**
   * DELETE PET - FIREBASE DOC DELETE LOGIC
   */
  const handleDeletePet = (id: string) => {
    console.log("Delete pet button clicked. ID: " + id);
    const pet = pets.find(p => p.id === id);
    if (!pet) return;
    
    if (!window.confirm(`${pet.name} isimli patiyi ve tüm sağlık geçmişini silmek istediğine emin misin?`)) return;

    // Simulation of: FirebaseFirestore.instance.collection('pets').doc(id).delete()
    console.log("FIRESTORE: Deleting doc 'pets/" + id + "' and subcollections...");
    
    const updatedPets = pets.filter(p => p.id !== id);
    const updatedSchedules = { ...schedules };
    delete updatedSchedules[id];

    setPets(updatedPets);
    setSchedules(updatedSchedules);

    if (updatedPets.length > 0) setSelectedPetId(updatedPets[0].id);
    else setSelectedPetId('');
    
    console.log("State updated. Pet removed from local view.");
  };

  const handleAddVaccine = () => {
    if (!newVaccine.title || !newVaccine.date) return;
    const vaccineEntry: Vaccine = { id: `v_${Date.now()}`, title: newVaccine.title, date: newVaccine.date, priority: newVaccine.priority, status: 'planlandı', isDone: false };
    setSchedules({ ...schedules, [selectedPetId]: [vaccineEntry, ...(schedules[selectedPetId] || [])] });
    setIsAddVaccineModalOpen(false);
    setNewVaccine({ title: '', date: '', priority: 'Zorunlu' });
  };

  /**
   * DELETE RECORD - FIREBASE ARRAY REMOVE LOGIC
   */
  const handleDeleteVaccine = (e: React.MouseEvent, vId: string) => {
    e.stopPropagation();
    console.log("Delete health record clicked. ID: " + vId);
    
    if (!window.confirm("Bu sağlık kaydını silmek istediğinden emin misin?")) return;
    
    // Simulation of: FieldValue.arrayRemove(vId)
    console.log("FIRESTORE: Updating 'schedules/" + selectedPetId + "' with arrayRemove for " + vId);

    setSchedules({
      ...schedules,
      [selectedPetId]: currentSchedule.filter(v => v.id !== vId)
    });
    
    console.log("Record removed. Local list refreshed.");
  };

  const toggleVaccineStatus = (vId: string) => {
    setSchedules({
      ...schedules,
      [selectedPetId]: currentSchedule.map(v => 
        v.id === vId ? { ...v, isDone: !v.isDone, status: !v.isDone ? 'yapıldı' : 'planlandı' } : v
      )
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black animate-fade-in pb-32 font-['Outfit']">
      <div className="flex items-center justify-between py-5 px-4 bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white hover:bg-zinc-800 transition-all active:scale-90 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">Pati Sağlık</h1>
              <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.2em] mt-1">Sistem Protokolü</p>
            </div>
        </div>
        <button onClick={() => setIsAddPetModalOpen(true)} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl">+ YENİ PATİ</button>
      </div>

      <div className="relative border-b border-white/5 bg-zinc-900/10">
        <div className="flex gap-2 px-4 py-5 overflow-x-auto no-scrollbar items-center scroll-smooth">
          {pets.map(pet => (
            <button 
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] transition-all whitespace-nowrap border-2 ${
                selectedPetId === pet.id ? 'bg-[#00ffff] text-black border-[#00ffff] shadow-lg shadow-cyan-500/20' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'
              }`}
            >
              <span className="text-sm">{pet.icon}</span>
              <span className="uppercase tracking-widest">{pet.name}</span>
            </button>
          ))}
          <div className="w-10 shrink-0 h-1"></div>
        </div>
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-black/80 to-transparent pointer-events-none"></div>
      </div>

      {activePet ? (
        <div className="px-4 space-y-6 mt-6 animate-slide-up">
          <div className="bg-[#111113] border border-white/10 rounded-[32px] p-6 flex justify-between items-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px]"></div>
            <div className="flex items-center gap-5 relative z-10 flex-1 min-w-0">
               <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-3xl border border-white/10 shadow-inner shrink-0">{activePet.icon}</div>
               <div className="min-w-0 flex-1">
                  <h2 className="text-white text-2xl font-black tracking-tight uppercase italic truncate">{activePet.name}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-cyan-500/10">{activePet.breed}</span>
                    <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{activePet.age}</span>
                  </div>
               </div>
            </div>
            <button onClick={() => handleDeletePet(activePet.id)} className="p-3 bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90 border border-transparent hover:border-red-500/20 shadow-sm relative z-20 shrink-0 ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="flex justify-between items-center px-2">
             <h3 className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">Sağlık Kayıtları</h3>
             <button onClick={() => setIsAddVaccineModalOpen(true)} className="text-[9px] font-black uppercase bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg border border-white/5 shadow-md">+ KAYIT EKLE</button>
          </div>

          <div className="space-y-3">
            {currentSchedule.length > 0 ? (
                currentSchedule.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(v => (
                <div key={v.id} onClick={() => toggleVaccineStatus(v.id)} className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${v.isDone ? 'bg-emerald-950/10 border-emerald-500/10 opacity-60' : 'bg-zinc-900/40 border-white/5 hover:border-white/20'}`}>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex gap-4 items-center">
                            <div className={`flex flex-col items-center justify-center min-w-[50px] py-2 px-1 rounded-xl border ${v.isDone ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-black/40 border-white/5'}`}>
                                <span className={`text-base font-black ${v.isDone ? 'text-emerald-400' : 'text-white'}`}>{new Date(v.date).getDate()}</span>
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(new Date(v.date))}</span>
                            </div>
                            <div>
                                <h4 className={`text-sm font-black tracking-tight ${v.isDone ? 'text-zinc-600 line-through' : 'text-white'}`}>{v.title}</h4>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${v.priority === 'Zorunlu' ? 'text-red-500 border-red-500/20' : 'text-cyan-500 border-cyan-500/20'}`}>{v.priority}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${v.isDone ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/20' : 'bg-zinc-800 text-zinc-700'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <button onClick={(e) => handleDeleteVaccine(e, v.id)} className="p-2 text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                    </div>
                </div>
                ))
            ) : (
                <div className="py-20 text-center bg-zinc-900/20 rounded-[32px] border border-dashed border-white/5 opacity-40">💉<p className="text-[10px] font-black uppercase mt-2">Kayıt Bulunmuyor</p></div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in"><div className="w-32 h-32 bg-zinc-900/50 rounded-[48px] flex items-center justify-center text-6xl opacity-20 border border-white/5 mb-8">🐾</div><button onClick={() => setIsAddPetModalOpen(true)} className="px-10 py-4 bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl active:scale-95 transition-all">İLK PATİYİ EKLE</button></div>
      )}

      {/* MODALLAR (Aynı Yapı) */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4">
          <div className="w-full max-w-lg bg-[#0c0c0e] rounded-[40px] border-t-2 border-white/20 p-8 shadow-2xl animate-slide-up flex flex-col gap-6 mb-4">
            <h2 className="text-white font-black text-xl tracking-tight uppercase italic">Yeni Pati Profili</h2>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setNewPet({...newPet, type: 'Kedi'})} className={`py-4 rounded-xl font-black text-[9px] transition-all border-2 ${newPet.type === 'Kedi' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>KEDİ 🐱</button>
                <button onClick={() => setNewPet({...newPet, type: 'Köpek'})} className={`py-4 rounded-xl font-black text-[9px] transition-all border-2 ${newPet.type === 'Köpek' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>KÖPEK 🐶</button>
                <button onClick={() => setNewPet({...newPet, type: 'Diğer'})} className={`py-4 rounded-xl font-black text-[9px] transition-all border-2 ${newPet.type === 'Diğer' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>DİĞER 🐾</button>
            </div>
            <input type="text" placeholder="İSİM" className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none uppercase" value={newPet.name} onChange={(e) => setNewPet({...newPet, name: e.target.value.toUpperCase()})} />
            <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="CİNSİ" className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none uppercase" value={newPet.breed} onChange={(e) => setNewPet({...newPet, breed: e.target.value.toUpperCase()})} />
                <input type="text" placeholder="YAŞI" className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none uppercase" value={newPet.age} onChange={(e) => setNewPet({...newPet, age: e.target.value.toUpperCase()})} />
            </div>
            <button onClick={handleAddPet} className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-xl active:scale-95 transition-all">OLUŞTUR</button>
            <button onClick={() => setIsAddPetModalOpen(false)} className="text-zinc-600 text-[9px] font-black uppercase">İptal</button>
          </div>
        </div>
      )}

      {isAddVaccineModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4">
          <div className="w-full max-w-lg bg-[#0c0c0e] rounded-[40px] border-t-2 border-white/20 p-8 shadow-2xl animate-slide-up flex flex-col gap-6 mb-4">
            <h2 className="text-white font-black text-xl tracking-tight uppercase italic">İşlem Ekle</h2>
            <input type="text" placeholder="İŞLEM ADI" className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none" value={newVaccine.title} onChange={(e) => setNewVaccine({...newVaccine, title: e.target.value})} />
            <input type="date" className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none" value={newVaccine.date} onChange={(e) => setNewVaccine({...newVaccine, date: e.target.value})} />
            <div className="flex gap-2">
                {['Zorunlu', 'Önemli', 'Rutin'].map(p => (
                <button key={p} onClick={() => setNewVaccine({...newVaccine, priority: p as any})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${newVaccine.priority === p ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>{p}</button>
                ))}
            </div>
            <button onClick={handleAddVaccine} className="w-full py-5 bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-xl active:scale-95 transition-all">KAYDET</button>
            <button onClick={() => setIsAddVaccineModalOpen(false)} className="text-zinc-600 text-[9px] font-black uppercase">Vazgeç</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccineSchedule;
