import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Brain, Heart, CheckSquare, FileText, Target } from 'lucide-react';
import DailyPlan from './DailyPlan';
import RecentActivities from './RecentActivities';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const quotes = [
  "Każdy mały krok prowadzi do wielkiej zmiany 🌱",
  "Dziś możesz być dumna z każdego małego osiągnięcia ✨",
  "Spokojnie, w swoim tempie – to właśnie jest piękne 🌸",
  "Czasami najlepszym planem jest brak planu 💫",
  "Jesteś dokładnie tam, gdzie masz być 🌈",
];

interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: 'mood' | 'task' | 'note' | 'habit' | 'plan';
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('recent-activities');
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recent-activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (text: string, type: Activity['type'] = 'plan') => {
    const activity: Activity = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivities(prev => [activity, ...prev.slice(0, 19)]); // Keep last 20 activities
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = "Paula"; // Można później zrobić konfigurowalne
    
    if (hour < 12) return `Dzień dobry, ${name}! ☀️`;
    if (hour < 18) return `Miłego popołudnia, ${name}! 🌻`;
    return `Dobry wieczór, ${name}! 🌙`;
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    
    if (hour < 10) return "Czas na miękki start dnia 🌸";
    if (hour < 14) return "W połowie dnia – pamiętaj o odpoczynku 💆‍♀️";
    if (hour < 18) return "Popołudnie to dobry moment na podsumowania 📝";
    return "Wieczór to czas na refleksję i spokój 🕯️";
  };

  const quickActions = [
    { icon: FileText, label: "Nowa notatka", color: "primary", page: "notes" },
    { icon: CheckSquare, label: "Zadania dnia", color: "secondary", page: "tasks" },
    { icon: Brain, label: "Brain Dump", color: "accent", page: "brain-dump" },
    { icon: Heart, label: "Nastrój", color: "mood", page: "mood" },
    { icon: Target, label: "Nawyki", color: "primary", page: "habits" },
    { icon: Plus, label: "Lista zakupów", color: "accent", page: "shopping" },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header z pozdrowieniem */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          {getGreeting()}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {getTimeBasedMessage()}
        </p>
      </div>

      {/* Cytat dnia */}
      <Card className="card-elevated mb-6 sm:mb-8 border-0 bg-gradient-to-br from-purple-300 to-pink-400 text-white">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center justify-center gap-2">
            ✨ Myśl na dziś
          </h3>
          <p className="text-lg sm:text-xl font-light text-white/95 leading-relaxed">
            {todayQuote}
          </p>
        </div>
      </Card>

      {/* Szybkie akcje */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Co dzisiaj robimy? 🚀
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 sm:h-24 flex-col space-y-1 sm:space-y-2 border-0 hover:scale-105 transition-all duration-300 touch-target shadow-lg hover:shadow-xl"
              style={{
                background: action.color === 'primary' && action.label === 'Nowa notatka' ? 'linear-gradient(135deg, #c7d2fe, #a78bfa)' :
                           action.color === 'primary' && action.label === 'Nawyki' ? 'linear-gradient(135deg, #f8bbd9, #f472b6)' :
                           action.color === 'secondary' ? 'linear-gradient(135deg, #a7f3d0, #6ee7b7)' :
                           action.color === 'accent' ? 'linear-gradient(135deg, #fed7aa, #fdba74)' :
                           action.color === 'mood' ? 'linear-gradient(135deg, #fde68a, #fcd34d)' :
                           'linear-gradient(135deg, #f8bbd9, #f472b6)',
                color: action.color === 'primary' || action.color === 'mood' ? '#1f2937' : '#374151'
              }}
              onClick={() => onPageChange(action.page)}
            >
              <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium font-poppins leading-tight text-center">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Dzisiejszy plan */}
      <Card className="card-elevated mb-6 sm:mb-8 border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            📅 Plan na dziś
          </h3>
        </div>
        <DailyPlan onAddActivity={addActivity} />
      </Card>

      {/* Ostatnia aktywność */}
      <Card className="card-elevated border-0">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          💫 Ostatnie aktywności
        </h3>
        <RecentActivities activities={activities} />
      </Card>
    </div>
  );
};

export default Dashboard;