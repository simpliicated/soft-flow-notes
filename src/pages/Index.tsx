import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MobileNavigation from '@/components/MobileNavigation';
import Dashboard from '@/components/Dashboard';
import Notes from '@/components/Notes';
import Tasks from '@/components/Tasks';
import BrainDump from '@/components/BrainDump';
import MoodTracker from '@/components/MoodTracker';
import HabitTracker from '@/components/HabitTracker';
import ShoppingLists from '@/components/ShoppingLists';
import Calendar from '@/components/Calendar';
import Settings from '@/components/Settings';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'notes':
        return <Notes />;
      case 'tasks':
        return <Tasks />;
      case 'brain-dump':
        return <BrainDump />;
      case 'mood':
        return <MoodTracker />;
      case 'habits':
        return <HabitTracker />;
      case 'shopping':
        return <ShoppingLists />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <main className="pb-20">
        {renderCurrentPage()}
      </main>
      <MobileNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Index;
