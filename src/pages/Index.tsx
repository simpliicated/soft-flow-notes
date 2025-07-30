import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Notes from '@/components/Notes';
import Tasks from '@/components/Tasks';
import BrainDump from '@/components/BrainDump';
import MoodTracker from '@/components/MoodTracker';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'notes':
        return <Notes />;
      case 'tasks':
        return <Tasks />;
      case 'brain-dump':
        return <BrainDump />;
      case 'mood':
        return <MoodTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="flex">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
