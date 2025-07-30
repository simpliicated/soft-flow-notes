import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Brain, Heart, CheckSquare, FileText, Target } from 'lucide-react';

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

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
      <Card className="card-elevated mb-6 sm:mb-8 border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center justify-center gap-2">
            ✨ Myśl na dziś
          </h3>
          <p className="text-lg sm:text-xl font-light text-white/90 leading-relaxed">
            {todayQuote}
          </p>
        </div>
      </Card>

      {/* Szybkie akcje */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Co dzisiaj robimy? 🚀
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 sm:h-24 flex-col space-y-1 sm:space-y-2 border-0 hover:scale-105 transition-all duration-300 touch-target shadow-lg hover:shadow-xl"
              style={{
                background: action.color === 'primary' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' :
                           action.color === 'secondary' ? 'linear-gradient(135deg, #06b6d4, #10b981)' :
                           action.color === 'accent' ? 'linear-gradient(135deg, #f97316, #ef4444)' :
                           action.color === 'mood' ? 'linear-gradient(135deg, #eab308, #f59e0b)' :
                           'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white'
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
          <Button variant="ghost" size="sm" className="touch-target bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-1" />
            Dodaj
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-muted-foreground p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Rano: Spokojny start z kawą ☕</span>
          </div>
          <div className="flex items-center text-muted-foreground p-3 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 mr-3 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Popołudnie: Czas na kreatywność 🎨</span>
          </div>
          <div className="flex items-center text-muted-foreground p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mr-3 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Wieczór: Relaks i refleksja 🌙</span>
          </div>
        </div>
      </Card>

      {/* Ostatnia aktywność */}
      <Card className="card-elevated border-0">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          💫 Ostatnie aktywności
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            🌈 Mood: Spokojnie (15 min temu)
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            ✅ Zadanie: "Odpisać na maila" - zakończone
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            💭 Notatka: "Pomysł na ilustrację z kaktusem"
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;