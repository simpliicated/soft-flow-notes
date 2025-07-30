import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Archive, ArrowRight, Trash2, Lightbulb } from 'lucide-react';

interface BrainDumpEntry {
  id: string;
  content: string;
  date: string;
  status: 'unsorted' | 'sorted';
}

const BrainDump = () => {
  const [entries, setEntries] = useState<BrainDumpEntry[]>([]);
  const [currentThought, setCurrentThought] = useState('');

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('zapiszto-braindump');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('zapiszto-braindump', JSON.stringify(entries));
  }, [entries]);

  const handleAddThought = () => {
    if (!currentThought.trim()) return;

    const newEntry: BrainDumpEntry = {
      id: Date.now().toString(),
      content: currentThought,
      date: new Date().toLocaleDateString('pl-PL'),
      status: 'unsorted'
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentThought('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddThought();
    }
  };

  const markAsSorted = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, status: 'sorted' } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const unsortedEntries = entries.filter(entry => entry.status === 'unsorted');
  const sortedEntries = entries.filter(entry => entry.status === 'sorted');

  const encouragingMessages = [
    "Każda myśl jest ważna! 💭",
    "Nie martw się o porządek - po prostu pisz 🌸",
    "To miejsce bez osądzania - daj się ponieść myślom ✨",
    "Czasami najlepsze pomysły przychodzą niespodziewanie 💫",
  ];

  const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-accent-soft via-background to-accent-soft/50">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Brain Dump
        </h1>
        <p className="text-muted-foreground mb-4">
          Miejsce na wszystko, co kłębi Ci się w głowie
        </p>
        <div className="bg-gradient-accent rounded-2xl p-4 border-0">
          <p className="text-sm text-accent-foreground font-medium">
            💡 {randomMessage}
          </p>
        </div>
      </div>

      {/* Quick input */}
      <Card className="card-soft mb-8 bg-gradient-mood border-0">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Co Ci chodzi po głowie?
          </h3>
          <Textarea
            placeholder="Wrzuć tutaj wszystko co Ci przychodzi do głowy... Bez stresu, bez porządku, po prostu pisz! 💭"
            value={currentThought}
            onChange={(e) => setCurrentThought(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[120px] border-border/30 rounded-xl resize-none bg-background/50"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Ctrl + Enter aby szybko dodać
            </p>
            <Button
              onClick={handleAddThought}
              disabled={!currentThought.trim()}
              className="btn-primary-soft"
            >
              <Send className="h-4 w-4 mr-2" />
              Wrzuć to!
            </Button>
          </div>
        </div>
      </Card>

      {/* Unsorted thoughts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            📥 Do posortowania
            {unsortedEntries.length > 0 && (
              <Badge variant="secondary" className="rounded-lg">
                {unsortedEntries.length}
              </Badge>
            )}
          </h2>
        </div>

        {unsortedEntries.length === 0 ? (
          <Card className="card-soft text-center py-8">
            <div className="text-4xl mb-4">🧠</div>
            <p className="text-muted-foreground">
              Wszystko posortowane! Lub jeszcze nic nie wrzucone 😊
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {unsortedEntries.map(entry => (
              <Card key={entry.id} className="card-soft bg-primary-soft/30 border-primary/20 group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed mb-2">
                      {entry.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.date}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsSorted(entry.id)}
                      className="h-8 px-3 text-xs bg-secondary/50 hover:bg-secondary"
                      title="Oznacz jako posortowane"
                    >
                      <Archive className="h-3 w-3 mr-1" />
                      Posortuj
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="h-8 w-8 p-0 text-destructive"
                      title="Usuń"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sorted thoughts */}
      {sortedEntries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            ✅ Posortowane
            <Badge variant="outline" className="rounded-lg">
              {sortedEntries.length}
            </Badge>
          </h2>
          <div className="space-y-3">
            {sortedEntries.map(entry => (
              <Card key={entry.id} className="card-soft bg-muted/30 border-muted group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-muted-foreground leading-relaxed text-sm mb-1">
                      {entry.content}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {entry.date}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          💡 Brain Dump to miejsce bez presji. Wrzucaj wszystko co Ci przychodzi do głowy,
          <br />
          a później spokojnie posortuj lub przekształć w notatki i zadania.
        </p>
      </div>
    </div>
  );
};

export default BrainDump;