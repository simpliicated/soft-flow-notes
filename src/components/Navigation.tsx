import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, FileText, Brain, Heart, CheckSquare, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
  { id: 'notes', label: 'Notatki', icon: FileText, emoji: '✏️' },
  { id: 'tasks', label: 'Zadania', icon: CheckSquare, emoji: '✅' },
  { id: 'brain-dump', label: 'Brain Dump', icon: Brain, emoji: '💭' },
  { id: 'mood', label: 'Nastrój', icon: Heart, emoji: '🌈' },
];

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="card-soft border-primary/20"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-primary border-r border-border/50 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:w-72
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              ZapiszTo
            </h1>
            <p className="text-sm text-muted-foreground">
              ADHD-friendly productivity
            </p>
          </div>

          {/* Navigation items */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-primary-soft/50 text-foreground'
                    }
                  `}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mood indicator card */}
          <Card className="card-soft mt-8 border-0 bg-gradient-accent">
            <div className="text-center">
              <div className="text-3xl mb-2">😌</div>
              <p className="text-sm font-medium text-accent-foreground">
                Dzisiejszy nastrój
              </p>
              <p className="text-xs text-accent-foreground/80 mt-1">
                Spokojny
              </p>
            </div>
          </Card>

          {/* Motivational quote */}
          <div className="mt-6 p-4 rounded-xl bg-muted/30">
            <p className="text-xs text-muted-foreground text-center italic">
              "Każdy mały krok prowadzi do wielkiej zmiany 🌱"
            </p>
          </div>
        </div>
      </div>

      {/* Main content offset for desktop */}
      <div className="md:ml-72" />
    </>
  );
};

export default Navigation;