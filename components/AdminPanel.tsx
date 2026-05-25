
import React, { useState, useEffect } from 'react';
import { User } from '../types';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = () => {
      const data = localStorage.getItem('patinetwork_users_db');
      if (data) {
        setUsers(JSON.parse(data));
      }
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('patinetwork_users_db', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    if (window.confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?")) {
      saveUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' };
      }
      return u;
    });
    saveUsers(updated as User[]);
  };

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl text-center">
            <span className="text-[10px] uppercase font-black text-emerald-800 tracking-widest block mb-2">Kayıtlı Kullanıcı</span>
            <span className="text-4xl font-black text-white">{users.length}</span>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl text-center">
            <span className="text-[10px] uppercase font-black text-emerald-800 tracking-widest block mb-2">Aktif Sistem</span>
            <span className="text-4xl font-black text-white">ON</span>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl text-center">
            <span className="text-[10px] uppercase font-black text-emerald-800 tracking-widest block mb-2">Sistem Sağlığı</span>
            <span className="text-4xl font-black text-emerald-500 tracking-tighter">%100</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="E-posta veya ad ile ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-emerald-900/30 rounded-2xl py-4 px-12 text-sm text-emerald-400 focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">
            {filteredUsers.length} SONUÇ LİSTELENDİ
          </div>
        </div>

        <div className="bg-zinc-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-emerald-950/30 text-[10px] uppercase font-black tracking-widest border-b border-emerald-900/30 text-emerald-300">
                  <th className="px-6 py-5">Kullanıcı</th>
                  <th className="px-6 py-5">E-Posta</th>
                  <th className="px-6 py-5">Durum</th>
                  <th className="px-6 py-5 text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-900/30 flex items-center justify-center text-xs font-black">{u.displayName.charAt(0)}</div>
                        <span className="text-white text-sm font-bold">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                        u.status === 'suspended' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {u.status === 'suspended' ? 'ASKIDA' : 'AKTİF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => toggleStatus(u.id)} className={`p-2 rounded-lg transition-all ${u.status === 'suspended' ? 'text-emerald-500 hover:bg-emerald-500 hover:text-black' : 'text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
