import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Tag, Edit3, Trash2, Heart } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  tags: string[];
  color: string;
  date: string;
  title: string;
}

const predefinedTags = [
  { name: 'cytat', color: 'primary' },
  { name: 'pomysł', color: 'accent' },
  { name: 'do sprawdzenia', color: 'secondary' },
  { name: 'link', color: 'primary' },
  { name: 'brain dump', color: 'accent' },
  { name: 'praca', color: 'secondary' },
  { name: 'dom', color: 'primary' },
];

const colorOptions = [
  { name: 'Lavenda', value: 'primary' },
  { name: 'Mint', value: 'secondary' },
  { name: 'Peach', value: 'accent' },
  { name: 'Neutral', value: 'muted' },
];

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    color: 'primary'
  });

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('zapiszto-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('zapiszto-notes', JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title || 'Bez tytułu',
      content: newNote.content,
      tags: newNote.tags,
      color: newNote.color,
      date: new Date().toLocaleDateString('pl-PL'),
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: [], color: 'primary' });
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const toggleTag = (tagName: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary-soft border-primary/20';
      case 'secondary': return 'bg-secondary-soft border-secondary/20';
      case 'accent': return 'bg-accent-soft border-accent/20';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto pb-24 bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 dark:from-pink-900/10 dark:via-rose-900/5 dark:to-pink-900/15">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Notatki ✏️
        </h1>
        <p className="text-muted-foreground">
          Miejsce na wszystkie Twoje myśli i pomysły
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj w notatkach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-2xl border-border/50 touch-target"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedTag === '' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag('')}
            className="rounded-2xl font-space-grotesk touch-target"
          >
            Wszystkie
          </Button>
          {predefinedTags.map(tag => (
            <Button
              key={tag.name}
              variant={selectedTag === tag.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(selectedTag === tag.name ? '' : tag.name)}
              className="rounded-2xl font-space-grotesk touch-target"
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Add note button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          className="btn-primary-soft mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nowa notatka
        </Button>
      )}

      {/* Add note form */}
      {isAdding && (
        <Card className="card-soft mb-8 border-primary/20">
          <div className="space-y-4">
            <Input
              placeholder="Tytuł notatki..."
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="border-border/50 rounded-xl"
            />
            <Textarea
              placeholder="Napisz swoją notatkę tutaj... 💭"
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px] border-border/50 rounded-xl resize-none"
            />
            
            {/* Tags */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tagi
              </p>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map(tag => (
                  <Badge
                    key={tag.name}
                    variant={newNote.tags.includes(tag.name) ? "default" : "outline"}
                    className={`cursor-pointer rounded-xl transition-colors ${
                      newNote.tags.includes(tag.name) ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Kolor</p>
              <div className="flex gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewNote(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      getColorClass(color.value)
                    } ${newNote.color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveNote} className="btn-primary-soft">
                <Heart className="h-4 w-4 mr-2" />
                Zapisz
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

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm || selectedTag ? 'Brak wyników' : 'Jeszcze żadnych notatek'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedTag 
                ? 'Spróbuj zmienić kryteria wyszukiwania'
                : 'Dodaj pierwszą notatkę, aby zacząć!'
              }
            </p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} className={`card-soft ${getColorClass(note.color)} group`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-foreground line-clamp-2">
                    {note.title}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/80 line-clamp-4">
                  {note.content}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs rounded-lg">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {note.date}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;