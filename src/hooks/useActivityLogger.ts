import { useCallback } from 'react';

export interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: 'mood' | 'task' | 'note' | 'habit' | 'plan' | 'brain-dump';
}

export const useActivityLogger = () => {
  const addActivity = useCallback((text: string, type: Activity['type'] = 'plan') => {
    const activity: Activity = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      type,
    };
    
    const existingActivities = JSON.parse(localStorage.getItem('recent-activities') || '[]');
    const updatedActivities = [activity, ...existingActivities.slice(0, 19)]; // Keep last 20
    localStorage.setItem('recent-activities', JSON.stringify(updatedActivities));
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('activityAdded', { detail: activity }));
  }, []);

  return { addActivity };
};