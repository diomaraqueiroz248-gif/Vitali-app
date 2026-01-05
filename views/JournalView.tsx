
import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  currentWeight: number;
}

export const JournalView: React.FC<JournalViewProps> = ({ entries, onAddEntry, currentWeight }) => {
  const [content, setContent] = useState('');
  const [weight, setWeight] = useState<string>(currentWeight.toString());
  const [mood, setMood] = useState<JournalEntry['mood']>('determinado');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddEntry({
      date: new Date().toISOString(),
      content,
      weight: parseFloat(weight) || 0,
      mood
    });

    setContent('');
  };

  const moods: {id: JournalEntry['mood'], label: string, emoji: string}[] = [
    { id: 'feliz', label: 'Feliz', emoji: '😊' },
    { id: 'determinado', label: 'Focado', emoji: '💪' },
    { id: 'cansado', label: 'Cansado', emoji: '😴' },
    { id: 'desanimado', label: 'Triste', emoji: '😔' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Diário de Evolução</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Registre seus sentimentos e conquistas.</p>
      </header>

      {/* New Entry Form */}
      <section className="bg-white dark:bg-dark-800 rounded-[2.5rem] p-7 shadow-sm border border-slate-100 dark:border-dark-700 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-3 tracking-[0.15em]">Como você se sente?</label>
              <div className="flex space-x-2.5">
                {moods.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`flex-1 py-3 rounded-[1.25rem] text-2xl border transition-all duration-300 transform active:scale-90 ${
                      mood === m.id 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-400 scale-105 shadow-md shadow-emerald-500/10' 
                      : 'bg-slate-50 dark:bg-dark-700 border-transparent text-gray-300 opacity-60'
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-3 tracking-[0.15em]">Peso (kg)</label>
              <div className="relative group">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-700 border-transparent dark:border-dark-700 rounded-2xl p-4 text-sm font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-bold text-xs uppercase">KG</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-3 tracking-[0.15em]">Notas sobre o dia</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva seu treino, alimentação ou como está se sentindo hoje..."
              className="w-full bg-slate-50 dark:bg-dark-700 border-transparent dark:border-dark-700 rounded-[2rem] p-5 text-sm dark:text-slate-200 min-h-[140px] focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all outline-none resize-none placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="w-full bg-emerald-500 dark:bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:scale-[1.01] transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            Salvar Registro
          </button>
        </form>
      </section>

      {/* Timeline */}
      <section className="space-y-5">
        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Histórico de Evolução</h3>
        {entries.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-dark-700 transition-colors">
            <div className="w-16 h-16 bg-slate-50 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <p className="text-gray-400 dark:text-slate-500 font-medium italic">Seu histórico aparecerá aqui conforme você registra.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white dark:bg-dark-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-dark-700 flex items-start space-x-5 transition-all hover:translate-x-1 group">
                <div className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-dark-700 rounded-2xl text-2xl group-hover:scale-110 transition-transform shadow-inner">
                  {moods.find(m => m.id === entry.mood)?.emoji || '😐'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                      {new Date(entry.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {entry.weight > 0 && (
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800/20">
                        {entry.weight} kg
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed break-words">{entry.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
