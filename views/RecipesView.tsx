
import React, { useState, useEffect } from 'react';
import { getHealthyRecipes, getAIAssistantRecipe } from '../services/geminiService';
import { Recipe, UserData } from '../types';

interface RecipesViewProps {
  user: UserData;
  onAddToShoppingList: (items: string[], recipeName?: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ user, onAddToShoppingList }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('almoco');
  const [aiInput, setAiInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [customRecipe, setCustomRecipe] = useState<Recipe | null>(null);

  const categories = [
    { id: 'cafe-da-manha', label: 'Café da Manhã' },
    { id: 'almoco', label: 'Almoço' },
    { id: 'janta', label: 'Jantar' },
    { id: 'lanche', label: 'Lanches' },
  ];

  const fetchRecipes = async (cat: string) => {
    setLoading(true);
    setCustomRecipe(null);
    const data = await getHealthyRecipes(cat, user.dietaryPreferences, user.dietaryRestrictions);
    setRecipes(data);
    setLoading(false);
  };

  const handleAiRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setIsAiGenerating(true);
    const recipe = await getAIAssistantRecipe(aiInput, user.dietaryPreferences, user.dietaryRestrictions);
    if (recipe) {
      setCustomRecipe(recipe);
      setAiInput('');
    }
    setIsAiGenerating(false);
  };

  useEffect(() => {
    fetchRecipes(category);
  }, [category, user.dietaryPreferences, user.dietaryRestrictions]);

  const handleRefresh = () => {
    fetchRecipes(category);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Culinária Saudável</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-gray-500 dark:text-slate-400 text-sm">Receitas práticas e acessíveis.</p>
            <span className="flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-800/30">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Econômico
            </span>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-all disabled:opacity-50 active:scale-90"
        >
          <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* AI Assistant Section */}
      <section className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 dark:from-indigo-500/20 dark:to-emerald-500/20 border border-emerald-500/30 rounded-[2rem] p-6 shadow-sm overflow-hidden relative group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center">
            <span className="p-1.5 bg-emerald-500 rounded-lg mr-2 shadow-lg shadow-emerald-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            Vitali IA: Criar Receita Mágica
          </h3>
          <form onSubmit={handleAiRequest} className="space-y-4">
            <div className="relative">
              <textarea 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ex: Tenho 2 ovos, tomate e um restinho de frango... o que posso fazer?"
                className="w-full bg-white dark:bg-dark-800 border-2 border-transparent focus:border-emerald-500/50 rounded-2xl p-4 text-sm text-gray-800 dark:text-white outline-none transition-all shadow-inner resize-none min-h-[80px]"
              />
              <button 
                type="submit"
                disabled={isAiGenerating || !aiInput.trim()}
                className="absolute bottom-3 right-3 p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 disabled:opacity-30 transition-all"
              >
                {isAiGenerating ? (
                   <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-0.5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              category === cat.id && !customRecipe
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105' 
                : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-slate-400 border border-slate-100 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="w-16 h-16 border-4 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 dark:text-slate-500 font-medium animate-pulse text-center">Buscando ingredientes simples e saudáveis...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {customRecipe && (
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border-2 border-emerald-500 rounded-[2.5rem] p-7 shadow-xl shadow-emerald-500/10 animate-in zoom-in-95 duration-500">
               <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
                  {customRecipe.name}
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-500 shrink-0">
                  Sua Sugestão IA
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] uppercase font-black text-gray-400 dark:text-slate-500 mb-4 tracking-[0.2em]">Ingredientes</h4>
                  <ul className="space-y-3">
                    {customRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-slate-300 flex items-start">
                        <span className="text-emerald-500 mr-2.5 mt-1">•</span> {ing}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => onAddToShoppingList(customRecipe.ingredients, customRecipe.name)}
                    className="mt-4 flex items-center text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Lista de Compras
                  </button>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-gray-400 dark:text-slate-500 mb-4 tracking-[0.2em]">Preparo</h4>
                  <ol className="space-y-4">
                    {customRecipe.instructions.map((step, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-slate-300">
                        <span className="font-black text-emerald-500/30 mr-2">0{i+1}</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <button 
                onClick={() => setCustomRecipe(null)}
                className="mt-8 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl transition-all"
              >
                Voltar para receitas padrão
              </button>
            </div>
          )}

          {!customRecipe && recipes.map((recipe, idx) => (
            <div key={idx} className="bg-white dark:bg-dark-800 rounded-[2.5rem] p-7 shadow-sm border border-slate-100 dark:border-dark-700 group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-500 transition-colors pr-4">{recipe.name}</h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/30 shrink-0">
                  {recipe.calories}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] uppercase font-black text-gray-400 dark:text-slate-500 mb-4 tracking-[0.2em]">Ingredientes Econômicos</h4>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-slate-300 flex items-start leading-snug">
                        <span className="text-emerald-400 dark:text-emerald-500 mr-2.5 flex-shrink-0 mt-1">•</span> {ing}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => onAddToShoppingList(recipe.ingredients, recipe.name)}
                    className="mt-6 flex items-center text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Lista de Compras
                  </button>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-gray-400 dark:text-slate-500 mb-4 tracking-[0.2em]">Modo de Preparo</h4>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pl-1">
                        <span className="font-black text-emerald-500/30 dark:text-emerald-400/20 mr-2 text-lg italic">0{i+1}</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
