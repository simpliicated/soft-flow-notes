import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, Tag, Clock, CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'today' | 'later' | 'ideas';
  tags: string[];
  deadline?: string;
  createdAt: string;
}

const priorityColors = {
  high: 'destructive',
  medium: 'accent',
  low: 'secondary',
};

const categoryLabels = {
  today: 'Na dziś',
  later: 'Na potem',
  ideas: 'Pomysły',
};

const taskTags = [
  'praca', 'dom', 'zakupy', 'zdrowie', 'hobby', 'ludzie', 'pilne', 'ważne'
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'today' | 'later' | 'ideas'>('today');
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'today' | 'later' | 'ideas';
    tags: string[];
    deadline: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'today',
    tags: [],
    deadline: '',
  });

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('zapiszto-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('zapiszto-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags,
      deadline: newTask.deadline || undefined,
      createdAt: new Date().toLocaleDateString('pl-PL'),
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'today',
      tags: [],
      deadline: '',
    });
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTag = (tag: string) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => task.category === activeCategory);
  };

  const getCompletedCount = (category: string) => {
    return tasks.filter(task => task.category === category && task.completed).length;
  };

  const getTotalCount = (category: string) => {
    return tasks.filter(task => task.category === category).length;
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto pb-24 bg-gradient-to-br from-secondary-soft via-background to-secondary-soft/50">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Zadania ✅
        </h1>
        <p className="text-muted-foreground">
          Organizuj swój dzień w przyjazny sposób
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const category = key as keyof typeof categoryLabels;
          const completedCount = getCompletedCount(category);
          const totalCount = getTotalCount(category);
          
          return (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-2xl whitespace-nowrap font-space-grotesk touch-target flex-shrink-0"
            >
              {label}
              {totalCount > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-lg">
                  {completedCount}/{totalCount}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Add task button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          className="btn-primary-soft mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nowe zadanie
        </Button>
      )}

      {/* Add task form */}
      {isAdding && (
        <Card className="card-soft mb-8 border-primary/20">
          <div className="space-y-4">
            <Input
              placeholder="Co chcesz zrobić?"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="border-border/50 rounded-xl"
            />
            
            <Textarea
              placeholder="Dodatkowe szczegóły (opcjonalnie)..."
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="border-border/50 rounded-xl resize-none"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Priorytet
                </label>
                <div className="space-y-2">
                  {Object.entries(priorityColors).map(([priority, color]) => (
                    <label key={priority} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={newTask.priority === priority}
                        onChange={(e) => setNewTask(prev => ({ 
                          ...prev, 
                          priority: e.target.value as 'high' | 'medium' | 'low' 
                        }))}
                        className="text-primary"
                      />
                      <span className="text-sm capitalize">
                        {priority === 'high' ? 'Wysoki' : priority === 'medium' ? 'Średni' : 'Niski'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Kategoria
                </label>
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={key}
                        checked={newTask.category === key}
                        onChange={(e) => setNewTask(prev => ({ 
                          ...prev, 
                          category: e.target.value as 'today' | 'later' | 'ideas' 
                        }))}
                        className="text-primary"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Termin (opcjonalnie)
                </label>
                <Input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                  className="border-border/50 rounded-xl"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tagi
              </label>
              <div className="flex flex-wrap gap-2">
                {taskTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={newTask.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer rounded-xl transition-colors"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveTask} className="btn-primary-soft">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Dodaj zadanie
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="rounded-xl"
              >
                Anuluj
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tasks list */}
      <div className="space-y-6">
        {/* Pending tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Circle className="h-5 w-5 text-primary" />
              Do zrobienia ({pendingTasks.length})
            </h3>
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <Card key={task.id} className="card-soft group">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h4>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className={`rounded-lg text-xs`}>
                          {task.priority === 'high' ? 'Wysoki' : task.priority === 'medium' ? 'Średni' : 'Niski'}
                        </Badge>
                        
                        {task.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.deadline).toLocaleDateString('pl-PL')}
                          </span>
                        )}
                        
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="rounded-lg text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Zrobione ({completedTasks.length})
            </h3>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <Card key={task.id} className="card-soft bg-muted/30 group">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium line-through text-muted-foreground">
                          {task.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-through">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <Card className="card-soft text-center py-12">
            <div className="text-6xl mb-4">
              {activeCategory === 'today' ? '🌅' : activeCategory === 'later' ? '📅' : '💡'}
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Brak zadań w kategorii "{categoryLabels[activeCategory]}"
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeCategory === 'today' && "Świetnie! Dzisiaj możesz odpocząć lub dodać nowe zadania."}
              {activeCategory === 'later' && "Dodaj zadania, które chcesz zrobić w przyszłości."}
              {activeCategory === 'ideas' && "Miejsce na pomysły i rzeczy, które może kiedyś zrobisz."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tasks;