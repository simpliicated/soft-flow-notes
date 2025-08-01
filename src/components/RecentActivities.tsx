import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: 'mood' | 'task' | 'note' | 'habit' | 'plan' | 'brain-dump';
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const [localActivities, setLocalActivities] = useState<Activity[]>(activities);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  useEffect(() => {
    const handleActivityAdded = () => {
      const stored = localStorage.getItem('recent-activities');
      if (stored) {
        setLocalActivities(JSON.parse(stored));
      }
    };

    window.addEventListener('activityAdded', handleActivityAdded);
    return () => window.removeEventListener('activityAdded', handleActivityAdded);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mood': return '🌈';
      case 'task': return '✅';
      case 'note': return '💭';
      case 'habit': return '🎯';
      case 'plan': return '📅';
      case 'brain-dump': return '🧠';
      default: return '💫';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'mood': return 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20';
      case 'task': return 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20';
      case 'note': return 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20';
      case 'habit': return 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20';
      case 'plan': return 'from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20';
      case 'brain-dump': return 'from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20';
      default: return 'from-gray-100 to-slate-100 dark:from-gray-900/20 dark:to-slate-900/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'teraz';
    if (diffMins < 60) return `${diffMins} min temu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} godz temu`;
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      {localActivities.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-muted-foreground">Jeszcze brak aktywności dzisiaj</p>
        </div>
      ) : (
        localActivities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className={`p-3 rounded-lg bg-gradient-to-r ${getActivityColor(activity.type)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start gap-2">
              <span className="text-base">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm">{activity.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentActivities;