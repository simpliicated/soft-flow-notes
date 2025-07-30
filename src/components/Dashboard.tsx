import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Brain, Heart, CheckSquare, FileText, ShoppingCart } from 'lucide-react';

const quotes = [
  "Każdy mały krok prowadzi do wielkiej zmiany 🌱",
  "Dziś możesz być dumna z każdego małego osiągnięcia ✨",
  "Spokojnie, w swoim tempie – to właśnie jest piękne 🌸",
  "Czasami najlepszym planem jest brak planu 💫",
  "Jesteś dokładnie tam, gdzie masz być 🌈",
];

const Dashboard = () => {
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
    { icon: FileText, label: "Nowa notatka", color: "primary", href: "/notes" },
    { icon: CheckSquare, label: "Zadania dnia", color: "secondary", href: "/tasks" },
    { icon: Brain, label: "Brain Dump", color: "accent", href: "/brain-dump" },
    { icon: Heart, label: "Nastrój", color: "mood", href: "/mood" },
    { icon: ShoppingCart, label: "Lista zakupów", color: "primary", href: "/shopping" },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto">
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
      <Card className="card-soft bg-gradient-mood mb-6 sm:mb-8 border-0">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Myśl na dziś
          </h3>
          <p className="text-lg sm:text-xl font-light text-foreground leading-relaxed">
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
              className="h-20 sm:h-24 flex-col space-y-1 sm:space-y-2 card-soft border-0 hover:scale-105 transition-transform touch-target"
              style={{
                background: action.color === 'primary' ? 'hsl(var(--primary-soft))' :
                           action.color === 'secondary' ? 'hsl(var(--secondary-soft))' :
                           action.color === 'accent' ? 'hsl(var(--accent-soft))' :
                           'hsl(var(--primary-soft))'
              }}
            >
              <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium font-space-grotesk leading-tight text-center">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Dzisiejszy plan - placeholder */}
      <Card className="card-soft mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Plan na dziś 📅
          </h3>
          <Button variant="ghost" size="sm" className="touch-target">
            <Plus className="h-4 w-4 mr-1" />
            Dodaj
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-secondary mr-3 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Rano: Spokojny start z kawą ☕</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-accent mr-3 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Popołudnie: Czas na kreatywność 🎨</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-primary mr-3 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Wieczór: Relaks i refleksja 🌙</span>
          </div>
        </div>
      </Card>

      {/* Ostatnia aktywność */}
      <Card className="card-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Ostatnie aktywności 💫
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>🌈 Mood: Spokojnie (15 min temu)</p>
          <p>✅ Zadanie: "Odpisać na maila" - zakończone</p>
          <p>💭 Notatka: "Pomysł na ilustrację z kaktusem"</p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;