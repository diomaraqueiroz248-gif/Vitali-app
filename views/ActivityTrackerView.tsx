
import React, { useState } from 'react';
import { ExerciseLog } from '../types';
import { calculateCalories, EXERCISE_TYPES } from '../services/activityService';

interface ActivityTrackerViewProps {
  onAddExercise: (log: Omit<ExerciseLog, 'id'>) => void;
  userWeight: number;
  logs: ExerciseLog[];
}

export const ActivityTrackerView: React.FC<ActivityTrackerViewProps> = ({ onAddExercise, userWeight, logs }) => {
  const [type, setType] = useState('Pedalada');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<'Leve' | 'Moderada' | 'Intensa'>('Moderada');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseInt(duration);
    if (isNaN(dur) || dur <= 0) return;

    const calories = calculateCalories(userWeight, type, intensity, dur);

    onAddExercise({
      date: new Date().toISOString().split('T')[0],
      type,
      duration: dur,
      intensity,
      caloriesBurned: calories
    });

    setDuration('30');
  };

  const getIcon = (activityType: string) => {
    switch (activityType) {
      case 'Pedalada':
      case 'Ciclismo':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            <circle cx="5.5" cy="17.5" r="3.5" strokeWidth="2"/>
            <circle cx="18.5" cy="17.5" r="3.5" strokeWidth="2"/>
            <path d="M9 17.5h6M12 17.5V14m-3-4l3 4 3-4" strokeWidth="2"/>
          </svg>
        );
      case 'Caminhada':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 14l-3 3-3-3m3 3V3" />
            <path d="M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm13.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" fill="currentColor"/>
          </svg>
        );
      case 'Corrida':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Musculação':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7v10M18 7v10M4 9h4M16 9h4M4 15h4M16 15h4M8 12h8" />
          </svg>
        );
      default:
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const quickActions = [
    { id: 'Pedalada', label: 'Pedalada', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { id: 'Caminhada', label: 'Caminhada', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'Corrida', label: 'Corrida', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { id: 'Musculação', label: 'Musculação', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Rastreador de Atividade</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Registre seus exercícios e veja as calorias queimadas.</p>
      </header>

      {/* Quick Access Grid */}
      <section className="space-y-3">
        <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Atalhos de Atividade</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => setType(action.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all active:scale-95 group ${
                type === action.id 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
                : 'border-transparent bg-white dark:bg-dark-800 hover:border-slate-200 dark:hover:border-dark-700 shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 p-2 rounded-2xl mb-2 transition-transform group-hover:scale-110 flex items-center justify-center ${action.color}`}>
                {getIcon(action.id)}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider ${
                type === action.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-dark-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-dark-700 transition-colors">
        <form onSubmit={handleAdd} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Atividade Selecionada</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-700 border-transparent dark:border-dark-700 rounded-2xl p-4 text-sm font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all outline-none appearance-none cursor-pointer shadow-inner"
                >
                  {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Duração (minutos)</label>
              <div className="relative group">
                <input 
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-700 border-transparent dark:border-dark-700 rounded-2xl p-4 text-sm font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all outline-none shadow-inner"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Nível de Esforço</label>
            <div className="flex space-x-3">
              {(['Leve', 'Moderada', 'Intensa'] as const).map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIntensity(i)}
                  className={`flex-1 py-4 rounded-2xl text-[11px] font-black border transition-all duration-300 tracking-widest uppercase active:scale-95 ${
                    intensity === i 
                    ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 dark:border-orange-400 text-orange-700 dark:text-orange-300 shadow-lg shadow-orange-500/10' 
                    : 'bg-slate-50 dark:bg-dark-700 border-transparent text-gray-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-600'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] transition-all uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Registrar {type}</span>
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Histórico de Atividades</h3>
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="bg-white dark:bg-dark-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-dark-700 flex items-center justify-between transition-all hover:translate-x-1 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-dark-700/50 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner p-3">
                  {getIcon(log.type)}
                </div>
                <div>
                  <p className="font-black text-gray-800 dark:text-white">{log.type}</p>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">{log.duration} min • {log.intensity} • {new Date(log.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-orange-600 dark:text-orange-400">-{log.caloriesBurned} <span className="text-[10px] font-bold uppercase opacity-60">kcal</span></p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-20 text-gray-400 dark:text-slate-500 italic bg-white dark:bg-dark-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-dark-700">
              <div className="w-16 h-16 bg-slate-50 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <p className="font-medium">Nenhuma atividade registrada ainda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
