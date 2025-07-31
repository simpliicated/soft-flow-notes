import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  iconName: string;
  color: string;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  completionHistory: string[];
}

interface HabitMonthViewProps {
  habit: Habit;
  onBack: () => void;
}

const HabitMonthView = ({ habit, onBack }: HabitMonthViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be 6, Monday (1) to be 0
  };
  
  const isDateCompleted = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return habit.completionHistory.includes(dateStr);
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const monthName = currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
  
  // Calculate completion stats for the month
  const completedDaysInMonth = habit.completionHistory.filter(dateStr => {
    const date = new Date(dateStr);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const totalDaysInMonth = isCurrentMonth ? today.getDate() : daysInMonth;
  const completionPercentage = Math.round((completedDaysInMonth / totalDaysInMonth) * 100);
  
  const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
  
  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 dark:from-pink-900/10 dark:via-rose-900/5 dark:to-pink-900/15">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-pink-600 hover:text-pink-700 hover:bg-pink-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powrót do nawyków
        </Button>
        
        <h1 className="text-2xl sm:text-3xl font-lexend font-semibold text-foreground mb-2">
          {habit.name} 📅
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Podgląd miesięczny - {monthName}
        </p>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="card-soft border-0 bg-gradient-to-br from-pink-200 to-rose-200 text-pink-800 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{completedDaysInMonth}</div>
            <p className="text-pink-700 text-sm">Dni ukończone</p>
          </div>
        </Card>
        
        <Card className="card-soft border-0 bg-gradient-to-br from-rose-200 to-pink-300 text-rose-800 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{completionPercentage}%</div>
            <p className="text-rose-700 text-sm">Procent wykonania</p>
          </div>
        </Card>
        
        <Card className="card-soft border-0 bg-gradient-to-br from-pink-300 to-rose-300 text-pink-800 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{habit.streak || 0}</div>
            <p className="text-pink-700 text-sm">Aktualna seria</p>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="card-soft border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigateMonth('prev')}
            className="hover:bg-pink-100 hover:text-pink-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold text-foreground capitalize">
            {monthName}
          </h2>
          
          <Button
            variant="ghost"
            onClick={() => navigateMonth('next')}
            className="hover:bg-pink-100 hover:text-pink-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isCompleted = isDateCompleted(day);
            const isToday = isCurrentMonth && day === today.getDate();
            const isFutureDate = isCurrentMonth && day > today.getDate();
            
            return (
              <div
                key={day}
                className={`
                  p-2 text-center text-sm rounded-lg transition-all duration-200
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-pink-300 to-rose-400 text-pink-800 font-bold shadow-lg' 
                    : isFutureDate
                    ? 'text-muted-foreground/50'
                    : 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
                  }
                  ${isToday ? 'ring-2 ring-pink-400 ring-offset-2' : ''}
                `}
              >
                {day}
                {isCompleted && (
                  <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-pink-300 to-rose-400 rounded"></div>
              <span>Ukończone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-pink-400 rounded"></div>
              <span>Dzisiaj</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HabitMonthView;