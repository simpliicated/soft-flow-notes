import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X, Calendar, Zap } from 'lucide-react';

interface PlanItem {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
  source?: 'manual' | 'task' | 'habit' | 'calendar';
}

interface DailyPlanProps {
  onAddActivity: (activity: string) => void;
}

const DailyPlan = ({ onAddActivity }: DailyPlanProps) => {
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load data from different sources and merge
  useEffect(() => {
    const loadDataFromSources = () => {
      const stored = localStorage.getItem('daily-plan');
      let manualItems: PlanItem[] = [];
      
      if (stored) {
        const allItems = JSON.parse(stored);
        manualItems = allItems.filter((item: PlanItem) => item.source === 'manual' || !item.source);
      }

      // Load today's tasks
      const tasksData = localStorage.getItem('zapiszto-tasks');
      const todayTasks: PlanItem[] = [];
      if (tasksData) {
        const tasks = JSON.parse(tasksData);
        const todayTasksFilter = tasks.filter((task: any) => task.category === 'today' && !task.completed);
        todayTasksFilter.forEach((task: any) => {
          todayTasks.push({
            id: `task-${task.id}`,
            text: `📋 ${task.title}`,
            completed: false,
            source: 'task'
          });
        });
      }

      // Load uncompleted habits
      const habitsData = localStorage.getItem('habits');
      const todayHabits: PlanItem[] = [];
      if (habitsData) {
        const habits = JSON.parse(habitsData);
        const today = new Date().toDateString();
        const uncompletedHabits = habits.filter((habit: any) => habit.lastCompleted !== today);
        uncompletedHabits.forEach((habit: any) => {
          todayHabits.push({
            id: `habit-${habit.id}`,
            text: `✨ ${habit.name}`,
            completed: false,
            source: 'habit'
          });
        });
      }

      // Combine all items
      const allItems = [...manualItems, ...todayTasks, ...todayHabits];
      setPlanItems(allItems);
    };

    loadDataFromSources();
    
    // Set up interval to refresh data every minute
    const interval = setInterval(loadDataFromSources, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('daily-plan', JSON.stringify(planItems));
  }, [planItems]);

  const addPlanItem = () => {
    if (!newItem.trim()) return;
    
    const item: PlanItem = {
      id: Date.now().toString(),
      text: newItem,
      completed: false,
      source: 'manual'
    };
    
    setPlanItems(prev => [...prev, item]);
    setNewItem('');
    setIsAdding(false);
  };

  const toggleItem = (id: string) => {
    setPlanItems(prev => prev.map(item => {
      if (item.id === id) {
        const newCompleted = !item.completed;
        if (newCompleted) {
          onAddActivity(`Plan: "${item.text}" - ukończone`);
          
          // Sync back to source if it's a task or habit
          if (item.source === 'task') {
            const tasksData = localStorage.getItem('zapiszto-tasks');
            if (tasksData) {
              const tasks = JSON.parse(tasksData);
              const updatedTasks = tasks.map((task: any) => 
                task.id === id.replace('task-', '') ? { ...task, completed: true } : task
              );
              localStorage.setItem('zapiszto-tasks', JSON.stringify(updatedTasks));
            }
          } else if (item.source === 'habit') {
            const habitsData = localStorage.getItem('habits');
            if (habitsData) {
              const habits = JSON.parse(habitsData);
              const today = new Date().toDateString();
              const updatedHabits = habits.map((habit: any) => 
                habit.id === id.replace('habit-', '') ? { ...habit, lastCompleted: today } : habit
              );
              localStorage.setItem('habits', JSON.stringify(updatedHabits));
            }
          }
        }
        return { ...item, completed: newCompleted };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    // Only allow deletion of manual items
    setPlanItems(prev => prev.filter(item => item.id !== id || (item.source !== 'manual' && item.source)));
  };

  const getTimeColor = (item: PlanItem) => {
    if (item.source === 'task') return 'from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20';
    if (item.source === 'habit') return 'from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20';
    
    switch (item.time) {
      case 'rano': return 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20';
      case 'popołudnie': return 'from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20';
      case 'wieczór': return 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20';
      default: return 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20';
    }
  };

  const getTimeDot = (item: PlanItem) => {
    if (item.source === 'task') return 'from-blue-400 to-blue-500';
    if (item.source === 'habit') return 'from-purple-400 to-purple-500';
    
    switch (item.time) {
      case 'rano': return 'from-green-300 to-emerald-400';
      case 'popołudnie': return 'from-orange-300 to-yellow-400';
      case 'wieczór': return 'from-purple-300 to-pink-400';
      default: return 'from-blue-300 to-cyan-400';
    }
  };

  return (
    <div className="space-y-3">
      {planItems.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-[var(--gradient-soft)] border border-border/30 hover:border-primary/30 transition-all group hover:shadow-soft cursor-pointer ${
            item.completed ? 'opacity-60' : ''
          }`}
        >
          <button
            onClick={() => toggleItem(item.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              item.completed
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border hover:border-primary hover:bg-primary/10'
            }`}
          >
            {item.completed && <Check className="h-4 w-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {item.time && (
                <span className="text-xs px-2 py-1 rounded-lg font-medium bg-primary/10 text-primary border border-primary/20">
                  {item.time}
                </span>
              )}
              <span className={`text-sm font-medium transition-all ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {item.text}
              </span>
              {item.source && (
                <span className="w-2 h-2 rounded-full bg-primary/50" />
              )}
            </div>
          </div>
          {(item.source === 'manual' || !item.source) && (
            <button
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 ml-2"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      
      {isAdding ? (
        <div className="flex gap-2 p-4 bg-[var(--gradient-primary)] border border-primary/20 rounded-xl">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nowy punkt planu..."
            className="flex-1 border-border/50 bg-background/80 rounded-xl"
            onKeyPress={(e) => e.key === 'Enter' && addPlanItem()}
            autoFocus
          />
          <Button size="sm" onClick={addPlanItem} className="btn-primary-soft">
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="hover:bg-background/50">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="w-full justify-start text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors p-4 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj punkt do planu
        </Button>
      )}
    </div>
  );
};

export default DailyPlan;