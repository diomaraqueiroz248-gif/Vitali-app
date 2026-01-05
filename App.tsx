
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { RecipesView } from './views/RecipesView';
import { WorkoutsView } from './views/WorkoutsView';
import { JournalView } from './views/JournalView';
import { ActivityTrackerView } from './views/ActivityTrackerView';
import { ShoppingListView } from './views/ShoppingListView';
import { UserData, DailyLog, JournalEntry, ExerciseLog, ShoppingItem } from './types';
import { getMotivation } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recipes' | 'workouts' | 'journal' | 'activity' | 'shopping'>('dashboard');
  const [motivation, setMotivation] = useState<string>('');
  const [loadingMotivation, setLoadingMotivation] = useState<boolean>(false);
  const [notification, setNotification] = useState<{message: string, type: 'water' | 'success'} | null>(null);
  
  // Make setActiveTab available to other views via window for deep linking/shortcuts
  useEffect(() => {
    (window as any).setActiveTab = setActiveTab;
  }, []);

  const [user, setUser] = useState<UserData>(() => {
    const saved = localStorage.getItem('vitali_user');
    return saved ? JSON.parse(saved) : {
      name: 'Usuário',
      age: 28,
      height: 170,
      weight: 85,
      targetWeight: 75,
      dailyWaterGoal: 2500,
      waterRemindersEnabled: false,
      waterReminderInterval: 60,
      dietaryPreferences: '',
      dietaryRestrictions: ''
    };
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => {
    const saved = localStorage.getItem('vitali_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('vitali_journal');
    return saved ? JSON.parse(saved) : [];
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('vitali_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`vitali_log_${today}`);
    
    const todayExercises = exerciseLogs.filter(e => e.date === today);
    const burned = todayExercises.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

    return saved ? { ...JSON.parse(saved), caloriesBurned: burned } : { date: today, waterIntake: 0, caloriesBurned: burned };
  });

  const weeklyWaterLogs = useMemo(() => {
    const logs: DailyLog[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const saved = localStorage.getItem(`vitali_log_${dateStr}`);
      if (saved) {
        logs.push(JSON.parse(saved));
      } else if (dateStr === dailyLog.date) {
        logs.push(dailyLog);
      }
    }
    return logs;
  }, [dailyLog]);

  useEffect(() => {
    if (!user.waterRemindersEnabled) return;

    const interval = setInterval(() => {
      setNotification({
        message: "Hora de se hidratar! Que tal um copo d'água agora?",
        type: 'water'
      });
      
      setTimeout(() => setNotification(null), 10000);
    }, user.waterReminderInterval * 60000);

    return () => clearInterval(interval);
  }, [user.waterRemindersEnabled, user.waterReminderInterval]);

  useEffect(() => {
    refreshMotivation();
  }, []);

  const refreshMotivation = async () => {
    setLoadingMotivation(true);
    try {
      const msg = await getMotivation(user.name, `Meta: ${user.targetWeight}kg, Atual: ${user.weight}kg`);
      setMotivation(msg);
    } catch (e) {
      setMotivation("A jornada de mil milhas começa com um único passo.");
    } finally {
      setLoadingMotivation(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('vitali_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`vitali_log_${dailyLog.date}`, JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    localStorage.setItem('vitali_exercises', JSON.stringify(exerciseLogs));
    const today = new Date().toISOString().split('T')[0];
    const burned = exerciseLogs
      .filter(e => e.date === today)
      .reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    setDailyLog(prev => ({ ...prev, caloriesBurned: burned }));
  }, [exerciseLogs]);

  useEffect(() => {
    localStorage.setItem('vitali_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('vitali_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addWater = (amount: number) => {
    setDailyLog(prev => ({ ...prev, waterIntake: prev.waterIntake + amount }));
    if (notification?.type === 'water') setNotification(null);
  };

  const addExercise = (log: Omit<ExerciseLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setExerciseLogs(prev => [newLog, ...prev]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setJournalEntries(prev => [newEntry, ...prev]);
    if (entry.weight > 0) {
      setUser(prev => ({ ...prev, weight: entry.weight }));
    }
  };

  const addToShoppingList = (items: string[], recipeName?: string) => {
    const newItems: ShoppingItem[] = items.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      completed: false,
      recipeName
    }));
    setShoppingList(prev => [...prev, ...newItems]);
    setNotification({
      message: `Itens adicionados à lista de compras!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  const updateUserSettings = (updates: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      notification={notification} 
      onCloseNotification={() => setNotification(null)}
    >
      <div className="max-w-4xl mx-auto pb-24 px-4 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            user={user} 
            dailyLog={dailyLog} 
            addWater={addWater}
            journalEntries={journalEntries}
            exerciseLogs={exerciseLogs}
            motivation={motivation}
            onRefreshMotivation={refreshMotivation}
            loadingMotivation={loadingMotivation}
            weeklyWaterLogs={weeklyWaterLogs}
            updateUserSettings={updateUserSettings}
          />
        )}
        {activeTab === 'recipes' && (
          <RecipesView 
            user={user} 
            onAddToShoppingList={addToShoppingList} 
          />
        )}
        {activeTab === 'workouts' && <WorkoutsView />}
        {activeTab === 'activity' && (
          <ActivityTrackerView 
            onAddExercise={addExercise} 
            userWeight={user.weight}
            logs={exerciseLogs}
          />
        )}
        {activeTab === 'journal' && (
          <JournalView 
            entries={journalEntries} 
            onAddEntry={addJournalEntry} 
            currentWeight={user.weight}
          />
        )}
        {activeTab === 'shopping' && (
          <ShoppingListView 
            list={shoppingList}
            onToggle={toggleShoppingItem}
            onRemove={removeShoppingItem}
            onClear={clearShoppingList}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
