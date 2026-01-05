
import React, { useMemo, useState } from 'react';
import { UserData, DailyLog, JournalEntry, ExerciseLog } from '../types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user: UserData;
  dailyLog: DailyLog;
  addWater: (amount: number) => void;
  journalEntries: JournalEntry[];
  exerciseLogs: ExerciseLog[];
  motivation: string;
  onRefreshMotivation: () => void;
  loadingMotivation: boolean;
  weeklyWaterLogs: DailyLog[];
  updateUserSettings: (updates: Partial<UserData>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  dailyLog, 
  addWater, 
  journalEntries, 
  exerciseLogs,
  motivation,
  onRefreshMotivation,
  loadingMotivation,
  weeklyWaterLogs,
  updateUserSettings
}) => {
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [showDietarySettings, setShowDietarySettings] = useState(false);
  
  const waterProgress = Math.min((dailyLog.waterIntake / user.dailyWaterGoal) * 100, 100);

  const weightData = useMemo(() => {
    return [...journalEntries]
      .reverse()
      .filter(e => e.weight > 0)
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        peso: e.weight
      }));
  }, [journalEntries]);

  // Weekly Stats Calculation
  const weeklyStats = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const waterTotal = weeklyWaterLogs.reduce((acc, log) => acc + (log.waterIntake || 0), 0);
    
    const caloriesTotal = exerciseLogs
      .filter(ex => new Date(ex.date) >= sevenDaysAgo)
      .reduce((acc, ex) => acc + ex.caloriesBurned, 0);

    const weightEntries = journalEntries
      .filter(je => new Date(je.date) >= sevenDaysAgo && je.weight > 0);
    const weightAvg = weightEntries.length > 0 
      ? (weightEntries.reduce((acc, je) => acc + je.weight, 0) / weightEntries.length).toFixed(1)
      : user.weight;

    return { waterTotal, caloriesTotal, weightAvg };
  }, [weeklyWaterLogs, exerciseLogs, journalEntries, user.weight]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-700 dark:from-emerald-600 dark:to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">Olá, {user.name}! 👋</h2>
            <p className="opacity-80 text-sm">Pronto para mais um dia de conquistas?</p>
          </div>
          <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-[10px] uppercase font-bold opacity-70 mb-1 tracking-wider">Peso Atual</p>
            <p className="text-3xl font-bold">{user.weight} <span className="text-sm font-normal opacity-70">kg</span></p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-[10px] uppercase font-bold opacity-70 mb-1 tracking-wider">Gasto Hoje</p>
            <p className="text-3xl font-bold">{dailyLog.caloriesBurned} <span className="text-sm font-normal opacity-70">kcal</span></p>
          </div>
        </div>
      </section>

      {/* IA Quick Action */}
      <section className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => (window as any).setActiveTab?.('recipes')}
          className="bg-white dark:bg-dark-800 border border-emerald-500/30 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-24 h-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors -skew-x-12 transform translate-x-8"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="text-left">
              <h4 className="font-black text-gray-800 dark:text-white uppercase tracking-wider text-sm">Consultar Vitali IA</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">Sugestão de refeição personalizada agora</p>
            </div>
          </div>
          <div className="text-emerald-500 p-2 relative z-10">
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>
      </section>

      {/* Motivational Quote Section */}
      <section className="relative overflow-hidden bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700 group transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L21.017 3V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.0166 21L3.0166 18C3.0166 16.8954 3.91203 16 5.0166 16H8.0166C8.56888 16 9.0166 15.5523 9.0166 15V9C9.0166 8.44772 8.56888 8 8.0166 8H5.0166C3.91203 8 3.0166 7.10457 3.0166 6V3L10.0166 3V15C10.0166 18.3137 7.3303 21 4.0166 21H3.0166Z"/></svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">Inspiração do Dia</span>
            <button 
              onClick={onRefreshMotivation}
              disabled={loadingMotivation}
              className="text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all p-1 hover:bg-slate-50 dark:hover:bg-dark-700 rounded-lg"
            >
              <svg className={`w-5 h-5 ${loadingMotivation ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
          
          <p className={`text-lg font-medium text-slate-700 dark:text-slate-200 italic leading-relaxed transition-opacity duration-300 ${loadingMotivation ? 'opacity-30' : 'opacity-100'}`}>
            "{motivation || 'A jornada de mil milhas começa com um único passo.'}"
          </p>
        </div>
      </section>

      {/* Dietary Profile Section */}
      <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.701 2.701 0 01-1.5-.454M9 16v2m3-6v6m3-3v3M9 12h6M4 4h16v12H4V4z" /></svg>
            Perfil Nutricional (IA)
          </h3>
          <button 
            onClick={() => setShowDietarySettings(!showDietarySettings)}
            className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase border border-emerald-100 dark:border-emerald-800/30"
          >
            {showDietarySettings ? 'Fechar' : 'Configurar'}
          </button>
        </div>

        {showDietarySettings ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-2 tracking-wider">Preferências Alimentares</label>
              <input 
                type="text"
                placeholder="Ex: Vegetariano, Low Carb, Proteico..."
                value={user.dietaryPreferences}
                onChange={(e) => updateUserSettings({ dietaryPreferences: e.target.value })}
                className="w-full bg-slate-50 dark:bg-dark-700 border-transparent rounded-xl p-3 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-2 tracking-wider">Restrições / Alergias</label>
              <input 
                type="text"
                placeholder="Ex: Sem glúten, Sem lactose, Sem amendoim..."
                value={user.dietaryRestrictions}
                onChange={(e) => updateUserSettings({ dietaryRestrictions: e.target.value })}
                className="w-full bg-slate-50 dark:bg-dark-700 border-transparent rounded-xl p-3 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <div className="flex-1 p-3 bg-slate-50 dark:bg-dark-700/50 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Preferências</p>
              <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{user.dietaryPreferences || 'Não configurado'}</p>
            </div>
            <div className="flex-1 p-3 bg-slate-50 dark:bg-dark-700/50 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Restrições</p>
              <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{user.dietaryRestrictions || 'Nenhuma'}</p>
            </div>
          </div>
        )}
      </section>

      {/* Weekly Summary Section */}
      <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 uppercase tracking-wider flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
          Resumo dos Últimos 7 Dias
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-sky-50 dark:bg-sky-900/10 rounded-2xl border border-sky-100 dark:border-sky-800/20">
            <div className="p-2 bg-sky-100 dark:bg-sky-800/30 text-sky-600 dark:text-sky-400 rounded-xl mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <p className="text-[10px] font-black text-sky-600/60 dark:text-sky-400/60 uppercase">Total Água</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{weeklyStats.waterTotal}<span className="text-[10px] font-medium ml-0.5">ml</span></p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/20">
            <div className="p-2 bg-orange-100 dark:bg-orange-800/30 text-orange-600 dark:text-orange-400 rounded-xl mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-[10px] font-black text-orange-600/60 dark:text-orange-400/60 uppercase">Calorias</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{weeklyStats.caloriesTotal}<span className="text-[10px] font-medium ml-0.5">kcal</span></p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/20">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400 rounded-xl mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase">Média Peso</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{weeklyStats.weightAvg}<span className="text-[10px] font-medium ml-0.5">kg</span></p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Tracker */}
        <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Hidratação Hoje
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowReminderSettings(!showReminderSettings)}
                className={`p-1.5 rounded-lg transition-colors ${showReminderSettings ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600' : 'text-slate-400'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-1 rounded border border-sky-100 dark:border-sky-800/30">
                {dailyLog.waterIntake} / {user.dailyWaterGoal}ml
              </span>
            </div>
          </div>

          <div className="relative h-4 bg-sky-50 dark:bg-sky-950/50 rounded-full overflow-hidden mb-6">
            <div 
              className="absolute top-0 left-0 h-full bg-sky-400 dark:bg-sky-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              style={{ width: `${waterProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[250, 500, 100].map(amount => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="py-2.5 px-3 rounded-2xl bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 font-bold text-sm hover:bg-sky-100 dark:hover:bg-sky-800/30 transition-all active:scale-95 border border-sky-100 dark:border-sky-800/30"
              >
                +{amount}ml
              </button>
            ))}
          </div>
        </section>

        {/* Weight Trend Chart */}
        <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700 transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            Histórico de Peso
          </h3>
          <div className="h-32 w-full">
            {weightData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm italic">
                Adicione pesagens no diário para ver o gráfico.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Activity Summary */}
      <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white">Atividades Recentes</h3>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded border border-orange-100 dark:border-orange-800/30">Total Hoje: {dailyLog.caloriesBurned} kcal</p>
        </div>
        <div className="space-y-3">
          {exerciseLogs.slice(0, 3).map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-dark-700/50 rounded-2xl border border-transparent dark:border-dark-700 transition-all hover:translate-x-1">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{ex.type} ({ex.intensity})</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">{ex.duration} min • {new Date(ex.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">+{ex.caloriesBurned} kcal</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
