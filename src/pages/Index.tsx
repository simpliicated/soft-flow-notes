import { useState } from 'react';
import MobileNavigation from '@/components/MobileNavigation';
import Dashboard from '@/components/Dashboard';
import Notes from '@/components/Notes';
import Tasks from '@/components/Tasks';
import BrainDump from '@/components/BrainDump';
import MoodTracker from '@/components/MoodTracker';
import HabitTracker from '@/components/HabitTracker';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

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
