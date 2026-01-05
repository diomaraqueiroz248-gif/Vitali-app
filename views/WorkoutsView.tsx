
import React, { useState, useEffect } from 'react';
import { getWorkoutTips } from '../services/geminiService';
import { Workout } from '../types';

export const WorkoutsView: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('Iniciante');

  const levels = ['Iniciante', 'Intermediário', 'Avançado'];

  const fetchWorkouts = async (lvl: string) => {
    setLoading(true);
    const data = await getWorkoutTips(lvl);
    setWorkouts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts(level);
  }, [level]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Treinos e Atividades</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Dicas focadas em queima de gordura.</p>
      </header>

      <div className="flex bg-white dark:bg-dark-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 transition-colors">
        {levels.map(lvl => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              level === lvl 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-50 dark:border-emerald-900/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 bg-emerald-500/10 rounded-full animate-pulse flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
          <p className="mt-6 text-gray-400 dark:text-slate-500 font-medium tracking-wide">Planejando sua rotina...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {workouts.map((workout, idx) => (
            <div key={idx} className="bg-white dark:bg-dark-800 rounded-3xl p-7 shadow-sm border border-slate-100 dark:border-dark-700 transition-all hover:border-emerald-200 dark:hover:border-emerald-800/50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{workout.title}</h3>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm ${
                  workout.intensity === 'Baixa' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30' :
                  workout.intensity === 'Média' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30' :
                  'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30'
                }`}>
                  {workout.intensity}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">{workout.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-slate-300 bg-slate-50 dark:bg-dark-700/50 px-4 py-2 rounded-2xl border border-transparent dark:border-dark-700 transition-colors">
                  <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Tempo: <span className="text-gray-800 dark:text-white ml-1">{workout.duration}</span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-dark-700/30 p-5 rounded-3xl border border-transparent dark:border-dark-700 transition-colors">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Exercícios Sugeridos</h4>
                {workout.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center text-sm font-semibold text-gray-700 dark:text-slate-200 py-1">
                    <span className="w-6 h-6 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] mr-3.5 font-black shrink-0">
                      {i+1}
                    </span>
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
