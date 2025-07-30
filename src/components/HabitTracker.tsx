import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Droplets, Book, Dumbbell, Coffee, Moon } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  iconName: string; // Store icon name instead of component
  color: string;
  completed: boolean;
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
  { id: '1', name: 'Wypić wodę', iconName: 'Droplets', color: 'secondary', completed: false },
  { id: '2', name: 'Czytanie', iconName: 'Book', color: 'accent', completed: false },
  { id: '3', name: 'Ruch', iconName: 'Dumbbell', color: 'primary', completed: false },
  { id: '4', name: 'Kawa', iconName: 'Coffee', color: 'mood-neutral', completed: false },
  { id: '5', name: 'Meditation', iconName: 'Moon', color: 'mood-calm', completed: false },
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
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-primary-soft via-background to-accent-soft/50">
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

      {/* Progress */}
      <Card className="card-soft mb-6 bg-gradient-to-r from-primary-soft to-secondary-soft border-0">
        <div className="text-center">
          <div className="text-3xl font-lexend font-bold text-foreground mb-2">
            {completedCount}/{habits.length}
          </div>
          <p className="text-muted-foreground">
            {completedCount === habits.length ? "Wszystko zaliczone! 🎉" : "Kontynuuj dobrą robotę"}
          </p>
        </div>
      </Card>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {habits.map((habit) => {
          const IconComponent = iconMap[habit.iconName as keyof typeof iconMap] || Droplets;
          return (
            <Card 
              key={habit.id}
              className={`card-soft border-0 transition-all duration-200 cursor-pointer touch-target ${
                habit.completed 
                  ? 'bg-primary-soft ring-2 ring-primary scale-105' 
                  : 'hover:scale-105'
              }`}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`
                  p-3 rounded-full transition-colors
                  ${habit.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
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
                    habit.completed ? 'text-primary line-through' : 'text-foreground'
                  }`}>
                    {habit.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {habit.completed ? 'Zaliczone!' : 'Kliknij aby oznaczyć'}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add new habit */}
      <Card className="card-soft border-dashed border-2 border-muted">
        <Button variant="ghost" className="w-full h-16 text-muted-foreground touch-target">
          <Plus className="h-5 w-5 mr-2" />
          Dodaj nowy nawyk
        </Button>
      </Card>
    </div>
  );
};

export default HabitTracker;