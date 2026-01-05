
import React from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListViewProps {
  list: ShoppingItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({ list, onToggle, onRemove, onClear }) => {
  const groupedList = list.reduce((groups, item) => {
    const groupName = item.recipeName || 'Itens Gerais';
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(item);
    return groups;
  }, {} as Record<string, ShoppingItem[]>);

  const totalItems = list.length;
  const completedItems = list.filter(i => i.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Lista de Compras</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Organize seus ingredientes para a semana.</p>
        </div>
        {list.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[10px] font-black uppercase text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-800/30 hover:bg-red-100 transition-all"
          >
            Limpar Tudo
          </button>
        )}
      </header>

      {list.length > 0 && (
        <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Progresso da Compra</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{completedItems} de {totalItems}</span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      )}

      {list.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-dark-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-dark-700">
          <div className="w-16 h-16 bg-slate-50 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p className="text-gray-400 dark:text-slate-500 font-medium italic">Sua lista está vazia.</p>
          <button 
            onClick={() => (window as any).setActiveTab('recipes')}
            className="mt-6 text-emerald-500 font-bold text-sm underline underline-offset-4"
          >
            Explorar Receitas
          </button>
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          {Object.entries(groupedList).map(([recipeName, items]) => (
            <div key={recipeName} className="space-y-4">
              <h3 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] px-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                {recipeName}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className={`bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border transition-all flex items-center justify-between group ${
                      item.completed 
                      ? 'border-emerald-100 dark:border-emerald-900/30 opacity-60' 
                      : 'border-slate-100 dark:border-dark-700 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <button 
                        onClick={() => onToggle(item.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          item.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-200 dark:border-dark-600 group-hover:border-emerald-500'
                        }`}
                      >
                        {item.completed && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </button>
                      <span className={`text-sm font-medium ${item.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-700 dark:text-slate-200'}`}>
                        {item.name}
                      </span>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
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
