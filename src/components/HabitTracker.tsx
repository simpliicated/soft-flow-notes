import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Droplets, Book, Dumbbell, Coffee, Moon } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  iconName: string;
  color: string;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  completionHistory: string[]; // Array of dates when completed
}

// Icon mapping
const iconMap = {
  Droplets,
  Book,
  Dumbbell,
  Coffee,
  Moon,
};

const defaultHabits: Habit[] = [
  { id: '1', name: 'Wypić wodę', iconName: 'Droplets', color: 'secondary', completed: false, streak: 0, completionHistory: [] },
  { id: '2', name: 'Czytanie', iconName: 'Book', color: 'accent', completed: false, streak: 0, completionHistory: [] },
  { id: '3', name: 'Ruch', iconName: 'Dumbbell', color: 'primary', completed: false, streak: 0, completionHistory: [] },
  { id: '4', name: 'Kawa', iconName: 'Coffee', color: 'mood-neutral', completed: false, streak: 0, completionHistory: [] },
  { id: '5', name: 'Meditation', iconName: 'Moon', color: 'mood-calm', completed: false, streak: 0, completionHistory: [] },
];

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('habits');
    if (stored) {
      setHabits(JSON.parse(stored));
    } else {
      setHabits(defaultHabits);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleting = !habit.completed;
        const newHistory = isCompleting 
          ? [...(habit.completionHistory || []), today]
          : (habit.completionHistory || []).filter(date => date !== today);
        
        const newStreak = isCompleting 
          ? (habit.streak || 0) + 1 
          : Math.max(0, (habit.streak || 0) - 1);

        return {
          ...habit, 
          completed: isCompleting,
          streak: newStreak,
          lastCompleted: isCompleting ? today : habit.lastCompleted,
          completionHistory: newHistory
        };
      }
      return habit;
    }));
  };

  const getWeeklyCompletion = (habit: Habit) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentCompletions = (habit.completionHistory || []).filter(dateStr => {
      const date = new Date(dateStr);
      return date >= oneWeekAgo;
    });
    
    return Math.round((recentCompletions.length / 7) * 100);
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 dark:from-pink-900/10 dark:via-rose-900/5 dark:to-pink-900/15">
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-lexend font-semibold text-foreground mb-2">
          Nawyki 🌟
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {completedCount > 0 
            ? `${completedCount} z ${habits.length} nawyków zaliczonych – świetnie! ✨`
            : "Czas na dzisiejsze małe kroki 💫"
          }
        </p>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="card-soft border-0 bg-gradient-to-br from-pink-200 to-rose-200 text-pink-800 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{completedCount}/{habits.length}</div>
            <p className="text-pink-700 text-sm">Dzisiaj ukończone</p>
          </div>
        </Card>
        
        <Card className="card-soft border-0 bg-gradient-to-br from-rose-200 to-pink-300 text-rose-800 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {Math.max(...habits.map(h => h.streak || 0), 0)}
            </div>
            <p className="text-rose-700 text-sm">Najdłuższa seria</p>
          </div>
        </Card>
        
        <Card className="card-soft border-0 bg-gradient-to-br from-pink-300 to-rose-300 text-pink-800 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {Math.round(habits.reduce((acc, h) => acc + getWeeklyCompletion(h), 0) / habits.length)}%
            </div>
            <p className="text-pink-700 text-sm">Tygodniowy wynik</p>
          </div>
        </Card>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {habits.map((habit) => {
          const IconComponent = iconMap[habit.iconName as keyof typeof iconMap] || Droplets;
          const weeklyCompletion = getWeeklyCompletion(habit);
          
          return (
            <Card 
              key={habit.id}
              className={`card-soft border-0 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 ${
                habit.completed 
                  ? 'bg-gradient-to-br from-pink-300 to-rose-400 text-pink-800 shadow-lg transform scale-105' 
                  : 'bg-white dark:bg-slate-800 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 dark:hover:from-pink-900/20 dark:hover:to-rose-900/20'
              }`}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className={`
                    p-3 rounded-full transition-all duration-200
                    ${habit.completed 
                      ? 'bg-white/30 text-pink-800' 
                      : 'bg-gradient-to-br from-pink-400 to-rose-500 text-white'
                    }
                  `}>
                    {habit.completed ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <IconComponent className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-lexend font-medium ${
                      habit.completed ? 'text-pink-800' : 'text-foreground'
                    }`}>
                      {habit.name}
                    </h3>
                    <div className={`flex items-center space-x-4 text-sm ${
                      habit.completed ? 'text-pink-700' : 'text-muted-foreground'
                    }`}>
                      <span>🔥 {habit.streak || 0} dni z rzędu</span>
                      <span>📊 {weeklyCompletion}% w tygodniu</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-pink-100 dark:bg-pink-900/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      habit.completed 
                        ? 'bg-white/60' 
                        : 'bg-gradient-to-r from-pink-400 to-rose-500'
                    }`}
                    style={{ width: `${weeklyCompletion}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add new habit */}
      <Card className="border-2 border-dashed border-pink-200 dark:border-pink-700/50 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 hover:border-pink-300 transition-all duration-300">
        <Button variant="ghost" className="w-full h-16 text-pink-600 hover:text-pink-700 hover:bg-pink-100 transition-colors touch-target">
          <Plus className="h-5 w-5 mr-2" />
          Dodaj nowy nawyk
        </Button>
      </Card>
    </div>
  );
};

export default HabitTracker;