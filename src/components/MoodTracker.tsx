import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, TrendingUp, Smile } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  color: string;
  note?: string;
  date: string;
  timestamp: number;
}

const moodOptions = [
  { emoji: '😊', name: 'Radosny', color: 'mood-happy', value: 5 },
  { emoji: '😌', name: 'Spokojny', color: 'mood-calm', value: 4 },
  { emoji: '😐', name: 'Neutralny', color: 'mood-neutral', value: 3 },
  { emoji: '😔', name: 'Smutny', color: 'mood-sad', value: 2 },
  { emoji: '😰', name: 'Zestresowany', color: 'mood-stressed', value: 1 },
];

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<typeof moodOptions[0] | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load mood entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('zapiszto-mood');
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save mood entries to localStorage
  useEffect(() => {
    localStorage.setItem('zapiszto-mood', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const handleSaveMood = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood.name,
      emoji: selectedMood.emoji,
      color: selectedMood.color,
      note: moodNote.trim() || undefined,
      date: new Date().toLocaleDateString('pl-PL'),
      timestamp: Date.now(),
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setSelectedMood(null);
    setMoodNote('');
    setShowAddForm(false);
  };

  const getTodayEntry = () => {
    const today = new Date().toLocaleDateString('pl-PL');
    return moodEntries.find(entry => entry.date === today);
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekEntries = moodEntries.filter(entry => entry.timestamp > oneWeekAgo);
    
    if (weekEntries.length === 0) return null;

    const moodValues = weekEntries.map(entry => {
      const moodOption = moodOptions.find(m => m.name === entry.mood);
      return moodOption?.value || 3;
    });

    const average = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
    const trend = weekEntries.length >= 2 ? 
      (moodValues[0] - moodValues[moodValues.length - 1]) : 0;

    return { average, trend, count: weekEntries.length };
  };

  const getRecentEntries = () => {
    return moodEntries.slice(0, 7);
  };

  const todayEntry = getTodayEntry();
  const weeklyStats = getWeeklyStats();
  const recentEntries = getRecentEntries();

  const encouragingMessages = [
    "Każdy dzień to nowy początek 🌅",
    "Pamiętaj, że emocje są jak pogoda - przechodzą 🌈",
    "Jesteś silniejsza niż myślisz 💪",
    "Małe kroki też są krokami naprzód 🌱",
    "Dziś też możesz być dumna z siebie ✨",
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-mood-happy via-background to-mood-calm/50">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Nastrój
        </h1>
        <p className="text-muted-foreground">
          Śledź swoje emocje i dostrzegaj wzorce
        </p>
      </div>

      {/* Today's mood */}
      <Card className="card-soft mb-8 bg-gradient-mood border-0">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Jak się dziś czujesz?
          </h2>
          
          {todayEntry ? (
            <div className="space-y-4">
              <div className="text-6xl mb-2">{todayEntry.emoji}</div>
              <p className="text-lg font-medium text-foreground">
                {todayEntry.mood}
              </p>
              {todayEntry.note && (
                <p className="text-muted-foreground italic">
                  "{todayEntry.note}"
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Zapisane dziś o {new Date(todayEntry.timestamp).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(true)}
                className="rounded-xl"
              >
                Zaktualizuj nastrój
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-muted-foreground mb-4">
                Jeszcze nie zapisałaś dzisiejszego nastroju
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="btn-primary-soft"
              >
                <Smile className="h-4 w-4 mr-2" />
                Dodaj nastrój
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Add mood form */}
      {showAddForm && (
        <Card className="card-soft mb-8 border-primary/20">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Wybierz swój nastrój
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-3 sm:p-4 rounded-2xl border-2 transition-all hover:scale-105 touch-target ${
                    selectedMood?.name === mood.name
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{mood.emoji}</div>
                   <p className="text-xs sm:text-sm font-medium text-foreground">
                    {mood.name}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Dodatkowe notatki (opcjonalnie)
              </label>
              <Textarea
                placeholder="Jak się czujesz? Co wpłynęło na Twój nastrój? Możesz napisać co chcesz..."
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="border-border/50 rounded-xl resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveMood}
                disabled={!selectedMood}
                className="btn-primary-soft"
              >
                <Heart className="h-4 w-4 mr-2" />
                Zapisz nastrój
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedMood(null);
                  setMoodNote('');
                }}
                className="rounded-xl"
              >
                Anuluj
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Weekly stats */}
      {weeklyStats && (
        <Card className="card-soft mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Statystyki z tego tygodnia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {weeklyStats.count}
              </p>
              <p className="text-sm text-muted-foreground">
                dni z zapisanym nastrojem
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">
                {weeklyStats.average.toFixed(1)}/5
              </p>
              <p className="text-sm text-muted-foreground">
                średni nastrój
              </p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                weeklyStats.trend > 0 ? 'text-secondary' : 
                weeklyStats.trend < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {weeklyStats.trend > 0 ? '📈' : weeklyStats.trend < 0 ? '📉' : '➡️'}
              </p>
              <p className="text-sm text-muted-foreground">
                trend tygodniowy
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent entries */}
      {recentEntries.length > 0 && (
        <Card className="card-soft mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ostatnie wpisy
          </h3>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/30"
              >
                <div className="text-2xl">{entry.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {entry.mood}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {entry.date}
                    </Badge>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Encouragement */}
      <Card className="card-soft bg-gradient-accent border-0">
        <div className="text-center">
          <div className="text-4xl mb-3">💚</div>
          <p className="text-foreground font-medium">
            {encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MoodTracker;