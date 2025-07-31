import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';

interface PlanItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  type: 'task' | 'note' | 'habit' | 'plan';
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Load data from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('zapiszto-calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }

    const savedPlanItems = localStorage.getItem('zapiszto-calendar-plans');
    if (savedPlanItems) {
      setPlanItems(JSON.parse(savedPlanItems));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('zapiszto-calendar-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('zapiszto-calendar-plans', JSON.stringify(planItems));
  }, [planItems]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const getPlanItemsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return planItems.filter(item => item.date === dateStr);
  };

  const addPlanItem = () => {
    if (!newItemText.trim()) return;

    const newItem: PlanItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
      date: format(selectedDate, 'yyyy-MM-dd'),
      timeOfDay: selectedTimeOfDay
    };

    setPlanItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const togglePlanItem = (itemId: string) => {
    setPlanItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const deletePlanItem = (itemId: string) => {
    setPlanItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTimeIcon = (timeOfDay: 'morning' | 'afternoon' | 'evening') => {
    switch (timeOfDay) {
      case 'morning': return Sun;
      case 'afternoon': return Clock;
      case 'evening': return Moon;
      default: return Clock;
    }
  };

  const getTimeLabel = (timeOfDay: 'morning' | 'afternoon' | 'evening') => {
    switch (timeOfDay) {
      case 'morning': return 'Rano';
      case 'afternoon': return 'Popołudnie';
      case 'evening': return 'Wieczór';
      default: return '';
    }
  };

  const getTimeColor = (timeOfDay: 'morning' | 'afternoon' | 'evening') => {
    switch (timeOfDay) {
      case 'morning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'afternoon': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'evening': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedDatePlanItems = getPlanItemsForDate(selectedDate);
  const groupedByTime = {
    morning: selectedDatePlanItems.filter(item => item.timeOfDay === 'morning'),
    afternoon: selectedDatePlanItems.filter(item => item.timeOfDay === 'afternoon'),
    evening: selectedDatePlanItems.filter(item => item.timeOfDay === 'evening')
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto pb-24 bg-gradient-to-br from-blue-50 via-background to-purple-50">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Planer & Kalendarz
        </h1>
        <p className="text-muted-foreground mb-4">
          Organizuj swój czas i planuj dzień z precyzją ⏰
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="card-soft">
          <div className="space-y-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold text-lg">
                {format(currentDate, 'LLLL yyyy', { locale: pl })}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground">
              {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'].map(day => (
                <div key={day} className="p-2 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(day => {
                const dayEvents = getEventsForDate(day);
                const dayPlanItems = getPlanItemsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      p-2 min-h-[60px] rounded-lg transition-all relative
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : isTodayDate
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'hover:bg-muted'
                      }
                    `}
                  >
                    <div className="text-sm font-medium">
                      {format(day, 'd')}
                    </div>
                    {(dayEvents.length > 0 || dayPlanItems.length > 0) && (
                      <div className="flex justify-center mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-primary-foreground' : 'bg-primary'
                        }`} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Selected day details */}
        <Card className="card-soft">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {format(selectedDate, 'EEEE, d MMMM', { locale: pl })}
              </h3>
              {isToday(selectedDate) && (
                <Badge variant="default" className="rounded-lg">
                  Dziś
                </Badge>
              )}
            </div>

            {/* Add new plan item */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
              <div className="flex gap-2">
                {['morning', 'afternoon', 'evening'].map(time => {
                  const TimeIcon = getTimeIcon(time as any);
                  return (
                    <Button
                      key={time}
                      variant={selectedTimeOfDay === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeOfDay(time as any)}
                      className="rounded-xl text-xs"
                    >
                      <TimeIcon className="h-3 w-3 mr-1" />
                      {getTimeLabel(time as any)}
                    </Button>
                  );
                })}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Co planujesz?"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlanItem()}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
                />
                <Button 
                  onClick={addPlanItem}
                  disabled={!newItemText.trim()}
                  size="sm"
                  className="btn-primary-soft"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Day schedule */}
            <div className="space-y-4">
              {(['morning', 'afternoon', 'evening'] as const).map(timeOfDay => {
                const items = groupedByTime[timeOfDay];
                const TimeIcon = getTimeIcon(timeOfDay);
                
                return (
                  <div key={timeOfDay} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TimeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {getTimeLabel(timeOfDay)}
                      </span>
                      {items.length > 0 && (
                        <Badge variant="outline" className={getTimeColor(timeOfDay)}>
                          {items.length}
                        </Badge>
                      )}
                    </div>
                    
                    {items.length === 0 ? (
                      <p className="text-xs text-muted-foreground ml-6">
                        Brak planów
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {items.map(item => (
                          <div 
                            key={item.id}
                            className={`
                              flex items-center gap-3 ml-6 p-3 rounded-xl border transition-all
                              ${item.completed 
                                ? 'bg-muted/50 border-muted text-muted-foreground' 
                                : 'bg-background border-border'
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => togglePlanItem(item.id)}
                              className="rounded"
                            />
                            <span className={`flex-1 text-sm ${item.completed ? 'line-through' : ''}`}>
                              {item.text}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePlanItem(item.id)}
                              className="h-6 w-6 p-0 text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Help text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          📅 Kliknij dzień w kalendarzu aby dodać plany. 
          <br />
          Organizuj zadania według pory dnia: rano, popołudnie, wieczór.
        </p>
      </div>
    </div>
  );
};

export default Calendar;