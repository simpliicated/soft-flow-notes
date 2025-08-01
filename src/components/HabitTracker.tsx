import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Plus, Droplets, Book, Dumbbell, Coffee, Moon, Trash2, Calendar, Heart, Zap, Sun, Flower, Music } from 'lucide-react';
import HabitMonthView from './HabitMonthView';
import { useActivityLogger } from '@/hooks/useActivityLogger';

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
  Heart,
  Zap,
  Sun,
  Flower,
  Music,
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
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('Heart');
  const [newHabitColor, setNewHabitColor] = useState('bg-pink-500');
  const { addActivity } = useActivityLogger();

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

  // Reset habits daily - check if it's a new day
  useEffect(() => {
    const checkAndResetHabits = () => {
      const today = new Date().toDateString();
      
      setHabits(prevHabits => prevHabits.map(habit => {
        // If the habit was not completed today, mark it as not completed
        const wasCompletedToday = habit.lastCompleted === today;
        return {
          ...habit,
          completed: wasCompletedToday
        };
      }));
    };

    checkAndResetHabits();
    
    // Check daily at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      checkAndResetHabits();
      // Set interval for daily reset
      setInterval(checkAndResetHabits, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Check if habit was already completed today or if it's a new day
        const wasLastCompletedToday = habit.lastCompleted === today;
        const isCompleting = !wasLastCompletedToday;
        
        const newHistory = isCompleting 
          ? [...(habit.completionHistory || []), today]
          : (habit.completionHistory || []).filter(date => date !== today);
        
        let newStreak = habit.streak || 0;
        if (isCompleting) {
          // If completing today, check if it continues the streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          
          if (habit.lastCompleted === yesterdayStr || newStreak === 0) {
            newStreak = newStreak + 1;
          } else {
            newStreak = 1; // Start new streak
          }
        } else {
          // If uncompleting, decrease streak
          newStreak = Math.max(0, newStreak - 1);
        }

        // Log activity
        if (isCompleting) {
          addActivity(`Zaliczono nawyk: ${habit.name}`, 'habit');
        }

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

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
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

  const addNewHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      iconName: newHabitIcon,
      color: newHabitColor,
      completed: false,
      streak: 0,
      completionHistory: []
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setNewHabitIcon('Heart');
    setNewHabitColor('bg-pink-500');
    setIsAddingHabit(false);
  };

  const availableIcons = ['Heart', 'Droplets', 'Zap', 'Moon', 'Sun', 'Coffee', 'Book', 'Dumbbell', 'Music', 'Flower'];
  const availableColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  const completedCount = habits.filter(h => h.completed).length;

  if (selectedHabit) {
    return (
      <HabitMonthView 
        habit={selectedHabit} 
        onBack={() => setSelectedHabit(null)} 
      />
    );
  }

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
              className={`card-soft border-0 transition-all duration-300 hover:shadow-xl hover:scale-105 relative group ${
                habit.completed 
                  ? 'bg-gradient-to-br from-pink-300 to-rose-400 text-pink-800 shadow-lg transform scale-105' 
                  : 'bg-white dark:bg-slate-800 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 dark:hover:from-pink-900/20 dark:hover:to-rose-900/20'
              }`}
            >
              {/* Action buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-pink-600 hover:text-pink-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHabit(habit);
                  }}
                >
                  <Calendar className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(habit.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3" onClick={() => toggleHabit(habit.id)}>
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
      {!isAddingHabit ? (
        <Card className="border-2 border-dashed border-pink-200 dark:border-pink-700/50 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 hover:border-pink-300 transition-all duration-300">
          <Button 
            variant="ghost" 
            onClick={() => setIsAddingHabit(true)}
            className="w-full h-16 text-pink-600 hover:text-pink-700 hover:bg-pink-100 transition-colors touch-target"
          >
            <Plus className="h-5 w-5 mr-2" />
            Dodaj nowy nawyk
          </Button>
        </Card>
      ) : (
        <Card className="card-soft">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Nowy nawyk</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Nazwa nawyku</label>
                <Input
                  placeholder="np. Pić więcej wody..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ikona</label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map(iconName => {
                    const IconComponent = iconMap[iconName];
                    return (
                      <Button
                        key={iconName}
                        variant={newHabitIcon === iconName ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewHabitIcon(iconName)}
                        className="w-10 h-10 p-0 rounded-xl"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Kolor</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewHabitColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newHabitColor === color ? 'border-foreground scale-110' : 'border-transparent'
                      } ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={addNewHabit} className="btn-primary-soft flex-1">
                Utwórz nawyk
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingHabit(false)}
                className="rounded-xl"
              >
                Anuluj
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HabitTracker;