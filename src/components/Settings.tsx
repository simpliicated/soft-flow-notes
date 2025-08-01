import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon,
  User,
  Palette,
  MessageCircle,
  Bell,
  Save,
  RotateCcw
} from 'lucide-react';
import APIKeySettings from '@/components/APIKeySettings';

interface UserSettings {
  name: string;
  theme: 'light' | 'dark' | 'auto';
  friendlyMode: boolean;
  showMotivationalQuotes: boolean;
  enableNotifications: boolean;
  language: 'pl' | 'en';
  fontSize: 'small' | 'medium' | 'large';
}

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Paula',
    theme: 'light',
    friendlyMode: true,
    showMotivationalQuotes: true,
    enableNotifications: true,
    language: 'pl',
    fontSize: 'medium'
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('zapiszto-user-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Track changes
  useEffect(() => {
    const savedSettings = localStorage.getItem('zapiszto-user-settings');
    const currentSettingsString = JSON.stringify(settings);
    const savedSettingsString = savedSettings || JSON.stringify({
      name: 'Paula',
      theme: 'light',
      friendlyMode: true,
      showMotivationalQuotes: true,
      enableNotifications: true,
      language: 'pl',
      fontSize: 'medium'
    });
    
    setHasChanges(currentSettingsString !== savedSettingsString);
  }, [settings]);

  const saveSettings = () => {
    localStorage.setItem('zapiszto-user-settings', JSON.stringify(settings));
    setHasChanges(false);
    
    // Apply theme immediately
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Show feedback
    alert('Ustawienia zostały zapisane! ✅');
  };

  const resetSettings = () => {
    const defaultSettings: UserSettings = {
      name: 'Paula',
      theme: 'light',
      friendlyMode: true,
      showMotivationalQuotes: true,
      enableNotifications: true,
      language: 'pl',
      fontSize: 'medium'
    };
    setSettings(defaultSettings);
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const themes = [
    { id: 'light', name: 'Jasny', description: 'Klasyczny jasny motyw' },
    { id: 'dark', name: 'Ciemny', description: 'Łagodny dla oczu' },
    { id: 'auto', name: 'Automatyczny', description: 'Dopasowuje się do systemu' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Mały', description: 'Kompaktowy widok' },
    { id: 'medium', name: 'Średni', description: 'Domyślny rozmiar' },
    { id: 'large', name: 'Duży', description: 'Łatwiejszy do czytania' }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-purple-50 via-background to-pink-50">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Ustawienia
        </h1>
        <p className="text-muted-foreground mb-4">
          Dostosuj aplikację do swoich potrzeb 🎨
        </p>
        
        {hasChanges && (
          <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Masz niezapisane zmiany
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Personal */}
        <Card className="card-soft">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Dane osobowe</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Jak mam się do Ciebie zwracać?
                </label>
                <Input
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                  placeholder="Twoje imię..."
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Używam tego imienia w przywitaniach i komunikatach 👋
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="card-soft">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Wygląd</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Motyw kolorystyczny</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themes.map(theme => (
                    <Button
                      key={theme.id}
                      variant={settings.theme === theme.id ? 'default' : 'outline'}
                      onClick={() => updateSetting('theme', theme.id as any)}
                      className="p-4 h-auto flex-col rounded-xl"
                    >
                      <span className="font-medium">{theme.name}</span>
                      <span className="text-xs opacity-70">{theme.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Rozmiar czcionki</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {fontSizes.map(fontSize => (
                    <Button
                      key={fontSize.id}
                      variant={settings.fontSize === fontSize.id ? 'default' : 'outline'}
                      onClick={() => updateSetting('fontSize', fontSize.id as any)}
                      className="p-4 h-auto flex-col rounded-xl"
                    >
                      <span className="font-medium">{fontSize.name}</span>
                      <span className="text-xs opacity-70">{fontSize.description}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Settings */}
        <APIKeySettings />

        {/* Behavior */}
        <Card className="card-soft">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Zachowanie aplikacji</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium block">
                    Tryb przyjazny 🫶
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Ciepłe, motywujące komunikaty zamiast suchych powiadomień
                  </p>
                </div>
                <Switch
                  checked={settings.friendlyMode}
                  onCheckedChange={(checked) => updateSetting('friendlyMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium block">
                    Cytaty motywacyjne ✨
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Codzienne dawki motywacji na dashboardzie
                  </p>
                </div>
                <Switch
                  checked={settings.showMotivationalQuotes}
                  onCheckedChange={(checked) => updateSetting('showMotivationalQuotes', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium block">
                    Powiadomienia 🔔
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Gentle reminder o zadaniach i nawykach
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="card-soft">
          <div className="flex gap-3">
            <Button 
              onClick={saveSettings}
              disabled={!hasChanges}
              className="btn-primary-soft flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Zapisz ustawienia
            </Button>
            
            <Button 
              variant="outline"
              onClick={resetSettings}
              className="rounded-xl"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetuj
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            Zmiany zostaną zastosowane natychmiast po zapisaniu
          </p>
        </Card>

        {/* App info */}
        <Card className="card-soft bg-muted/30">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">ZapiszTo - Twój zewnętrzny mózg 🧠</h3>
            <p className="text-sm text-muted-foreground">
              Wersja 1.0.0 • Stworzone z ❤️ dla osób z ADHD
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant="outline" className="rounded-lg">
                React + TypeScript
              </Badge>
              <Badge variant="outline" className="rounded-lg">
                Tailwind CSS
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;