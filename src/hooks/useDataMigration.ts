import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useDataMigration = () => {
  const { user } = useAuth();

  const checkLocalData = useCallback(() => {
    const localDataKeys = [
      'notes',
      'tasks', 
      'habits',
      'habit-completions',
      'mood-entries',
      'recent-activities',
      'shopping-lists',
      'daily-plans',
      'brain-dumps'
    ];
    
    const localData: Record<string, any> = {};
    let totalItems = 0;
    
    localDataKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localData[key] = parsed;
            totalItems += parsed.length;
          } else if (typeof parsed === 'object' && parsed !== null) {
            localData[key] = parsed;
            totalItems += 1;
          }
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    });
    
    return { localData, totalItems };
  }, []);

  const migrateData = useCallback(async () => {
    if (!user) {
      toast.error('Musisz być zalogowany aby przenieść dane');
      return false;
    }

    const { localData, totalItems } = checkLocalData();
    
    if (totalItems === 0) {
      toast.info('Brak danych lokalnych do przeniesienia');
      return true;
    }

    try {
      // Migrate notes
      if (localData.notes) {
        const notesToMigrate = localData.notes.map((note: any) => ({
          user_id: user.id,
          title: note.title || '',
          content: note.content || '',
          tags: note.tags || [],
          color: note.color || 'yellow',
          date: note.date,
          ai_expanded: note.aiExpanded
        }));
        
        const { error: notesError } = await supabase
          .from('notes')
          .insert(notesToMigrate);
        
        if (notesError) throw notesError;
      }

      // Migrate tasks
      if (localData.tasks) {
        const tasksToMigrate = localData.tasks.map((task: any) => ({
          user_id: user.id,
          text: task.text || task.title || '',
          completed: task.completed || false,
          priority: task.priority || 'medium',
          due_date: task.dueDate || task.due_date,
          category: task.category
        }));
        
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksToMigrate);
        
        if (tasksError) throw tasksError;
      }

      // Migrate habits
      if (localData.habits) {
        const habitsToMigrate = localData.habits.map((habit: any) => ({
          user_id: user.id,
          name: habit.name || habit.title || '',
          description: habit.description,
          color: habit.color || 'blue',
          target_frequency: habit.targetFrequency || 1,
          frequency_type: habit.frequencyType || 'daily'
        }));
        
        const { data: insertedHabits, error: habitsError } = await supabase
          .from('habits')
          .insert(habitsToMigrate)
          .select();
        
        if (habitsError) throw habitsError;

        // Migrate habit completions if they exist
        if (localData['habit-completions'] && insertedHabits) {
          const habitMap = new Map();
          localData.habits.forEach((habit: any, index: number) => {
            if (insertedHabits[index]) {
              habitMap.set(habit.id, insertedHabits[index].id);
            }
          });

          const completionsToMigrate = localData['habit-completions']
            .filter((completion: any) => habitMap.has(completion.habitId))
            .map((completion: any) => ({
              user_id: user.id,
              habit_id: habitMap.get(completion.habitId),
              completed_date: completion.date || completion.completedDate
            }));
          
          if (completionsToMigrate.length > 0) {
            const { error: completionsError } = await supabase
              .from('habit_completions')
              .insert(completionsToMigrate);
            
            if (completionsError) throw completionsError;
          }
        }
      }

      // Migrate mood entries
      if (localData['mood-entries']) {
        const moodEntriesToMigrate = localData['mood-entries'].map((entry: any) => ({
          user_id: user.id,
          mood: entry.mood,
          note: entry.note,
          date: entry.date
        }));
        
        const { error: moodError } = await supabase
          .from('mood_entries')
          .insert(moodEntriesToMigrate);
        
        if (moodError) throw moodError;
      }

      // Migrate activities
      if (localData['recent-activities']) {
        const activitiesToMigrate = localData['recent-activities'].map((activity: any) => ({
          user_id: user.id,
          text: activity.text,
          type: activity.type,
          timestamp: activity.timestamp
        }));
        
        const { error: activitiesError } = await supabase
          .from('activities')
          .insert(activitiesToMigrate);
        
        if (activitiesError) throw activitiesError;
      }

      // Migrate shopping lists
      if (localData['shopping-lists']) {
        const shoppingListsToMigrate = localData['shopping-lists'].map((list: any) => ({
          user_id: user.id,
          name: list.name || 'Lista zakupów',
          items: list.items || []
        }));
        
        const { error: shoppingError } = await supabase
          .from('shopping_lists')
          .insert(shoppingListsToMigrate);
        
        if (shoppingError) throw shoppingError;
      }

      // Migrate daily plans
      if (localData['daily-plans']) {
        const dailyPlansToMigrate = Object.entries(localData['daily-plans']).map(([date, plan]: [string, any]) => ({
          user_id: user.id,
          date: date,
          morning_routine: plan.morningRoutine,
          main_tasks: plan.mainTasks,
          evening_routine: plan.eveningRoutine,
          goals: plan.goals,
          notes: plan.notes
        }));
        
        const { error: plansError } = await supabase
          .from('daily_plans')
          .insert(dailyPlansToMigrate);
        
        if (plansError) throw plansError;
      }

      // Migrate brain dumps
      if (localData['brain-dumps']) {
        const brainDumpsToMigrate = localData['brain-dumps'].map((dump: any) => ({
          user_id: user.id,
          content: dump.content || dump.text || ''
        }));
        
        const { error: brainDumpsError } = await supabase
          .from('brain_dumps')
          .insert(brainDumpsToMigrate);
        
        if (brainDumpsError) throw brainDumpsError;
      }

      toast.success(`Przeniesiono ${totalItems} elementów do chmury!`);
      return true;
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Błąd podczas przenoszenia danych');
      return false;
    }
  }, [user, checkLocalData]);

  const clearLocalData = useCallback(() => {
    const localDataKeys = [
      'notes',
      'tasks', 
      'habits',
      'habit-completions',
      'mood-entries',
      'recent-activities',
      'shopping-lists',
      'daily-plans',
      'brain-dumps'
    ];
    
    localDataKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    toast.success('Dane lokalne zostały wyczyszczone');
  }, []);

  return {
    checkLocalData,
    migrateData,
    clearLocalData
  };
};