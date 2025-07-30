import { Circle, Edit3, Zap, Smile, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: Circle, emoji: '🏠' },
  { id: 'notes', label: 'Notatki', icon: Edit3, emoji: '✏️' },
  { id: 'tasks', label: 'Zadania', icon: Square, emoji: '✅' },
  { id: 'brain-dump', label: 'Brain', icon: Zap, emoji: '💭' },
  { id: 'mood', label: 'Nastrój', icon: Smile, emoji: '🌈' },
  { id: 'habits', label: 'Nawyki', icon: Smile, emoji: '⭐' },
];

const MobileNavigation = ({ currentPage, onPageChange }: MobileNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50">
      <div className="safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`
                  flex-col gap-1 h-16 w-16 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
                onClick={() => onPageChange(item.id)}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium font-poppins leading-none">
                    {item.label}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;