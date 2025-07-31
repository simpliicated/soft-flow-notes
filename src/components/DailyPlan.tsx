import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';

interface PlanItem {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
}

interface DailyPlanProps {
  onAddActivity: (activity: string) => void;
}

const DailyPlan = ({ onAddActivity }: DailyPlanProps) => {
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('daily-plan');
    if (stored) {
      setPlanItems(JSON.parse(stored));
    } else {
      setPlanItems([
        { id: '1', text: 'Spokojny start z kawą', completed: false, time: 'rano' },
        { id: '2', text: 'Czas na kreatywność', completed: false, time: 'popołudnie' },
        { id: '3', text: 'Relaks i refleksja', completed: false, time: 'wieczór' },
      ]);
    }
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
        }
        return { ...item, completed: newCompleted };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setPlanItems(prev => prev.filter(item => item.id !== id));
  };

  const getTimeColor = (time?: string) => {
    switch (time) {
      case 'rano': return 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20';
      case 'popołudnie': return 'from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20';
      case 'wieczór': return 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20';
      default: return 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20';
    }
  };

  const getTimeDot = (time?: string) => {
    switch (time) {
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
          className={`flex items-center p-3 rounded-lg bg-gradient-to-r ${getTimeColor(item.time)} group transition-all duration-200 ${
            item.completed ? 'opacity-60' : ''
          }`}
        >
          <button
            onClick={() => toggleItem(item.id)}
            className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 transition-all duration-200 ${
              item.completed 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : `bg-gradient-to-r ${getTimeDot(item.time)}`
            }`}
          />
          <span 
            className={`text-sm sm:text-base flex-1 ${
              item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}
          >
            {item.text} {item.time && `☕`}
          </span>
          <button
            onClick={() => deleteItem(item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 ml-2"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      {isAdding ? (
        <div className="flex gap-2 p-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nowy punkt planu..."
            className="flex-1 border-0 bg-white/50 dark:bg-slate-800/50"
            onKeyPress={(e) => e.key === 'Enter' && addPlanItem()}
            autoFocus
          />
          <Button size="sm" onClick={addPlanItem} className="bg-blue-500 hover:bg-blue-600">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj punkt do planu
        </Button>
      )}
    </div>
  );
};

export default DailyPlan;