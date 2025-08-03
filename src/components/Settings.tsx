import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useDataMigration } from '@/hooks/useDataMigration';
import APIKeySettings from './APIKeySettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserSettings {
  name: string;
  theme: 'light' | 'dark' | 'auto' | 'blue' | 'pink' | 'green' | 'purple' | 'orange';
  friendlyMode: boolean;
  showMotivationalQuotes: boolean;
  enableNotifications: boolean;
  language: 'pl' | 'en';
  fontSize: 'small' | 'medium' | 'large';
}

const Settings = () => {
  const { user, signOut, loading } = useAuth();
  const { checkLocalData, migrateData, clearLocalData } = useDataMigration();

  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    theme: 'light',
    friendlyMode: true,
    showMotivationalQuotes: true,
    enableNotifications: false,
    language: 'pl',
    fontSize: 'medium',
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Auth form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  // Track changes for unsaved indicator
  useEffect(() => {
    const savedSettings = localStorage.getItem('user-settings');
    const currentSettingsString = JSON.stringify(settings);
    const savedSettingsString = savedSettings || JSON.stringify({
      name: '',
      theme: 'light',
      friendlyMode: true,
      showMotivationalQuotes: true,
      enableNotifications: false,
      language: 'pl',
      fontSize: 'medium',
    });
    
    setHasUnsavedChanges(currentSettingsString !== savedSettingsString);
  }, [settings]);

  const saveSettings = () => {
    localStorage.setItem('user-settings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    
    // Apply theme
    const body = document.documentElement;
    
    // Remove all theme classes
    body.classList.remove('dark', 'theme-blue', 'theme-pink', 'theme-green', 'theme-purple', 'theme-orange');
    
    if (settings.theme === 'dark') {
      body.classList.add('dark');
    } else if (settings.theme === 'light') {
      // Light theme is default, no additional classes needed
    } else if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('dark');
      }
    } else {
      // Color themes
      body.classList.add(`theme-${settings.theme}`);
    }
    
    toast.success('Ustawienia zostały zapisane!');
  };

  const resetSettings = () => {
    const defaultSettings: UserSettings = {
      name: '',
      theme: 'light',
      friendlyMode: true,
      showMotivationalQuotes: true,
      enableNotifications: false,
      language: 'pl',
      fontSize: 'medium',
    };
    setSettings(defaultSettings);
  };

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'signup' && password !== confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }

    setAuthLoading(true);
    
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      if (authMode === 'signup') {
        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast.success('Konto zostało utworzone! Sprawdź email aby potwierdzić.');
          // Migrate data after successful signup
          setTimeout(async () => {
            await migrateData();
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast.success('Zalogowano pomyślnie!');
          // Migrate data after successful signin
          setTimeout(async () => {
            await migrateData();
          }, 1000);
          // Force page reload
          window.location.href = '/';
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Błąd podczas logowania');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMigrateData = async () => {
    const success = await migrateData();
    if (success) {
      // Optionally clear local data after successful migration
      setTimeout(() => {
        const shouldClear = window.confirm('Dane zostały przeniesione do chmury. Czy chcesz usunąć kopie lokalne?');
        if (shouldClear) {
          clearLocalData();
        }
      }, 1000);
    }
  };

  const { localData, totalItems } = checkLocalData();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Ustawienia</h1>
        <p className="text-muted-foreground">
          Zarządzaj swoim kontem i preferencjami aplikacji
        </p>
        {hasUnsavedChanges && (
          <div className="bg-orange-100 border border-orange-200 text-orange-800 px-4 py-2 rounded-lg dark:bg-orange-900 dark:border-orange-800 dark:text-orange-200">
            ⚠️ Masz niezapisane zmiany
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {user ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Informacje o koncie</CardTitle>
                <CardDescription>Szczegóły Twojego konta użytkownika</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ''} disabled />
                </div>
                <div>
                  <Label>ID użytkownika</Label>
                  <Input value={user.id} disabled />
                </div>
                
                {totalItems > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Wykryto dane lokalne ({totalItems} elementów)
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Możesz przenieść swoje dane lokalne do chmury, aby mieć do nich dostęp na wszystkich urządzeniach.
                    </p>
                    <Button 
                      onClick={handleMigrateData}
                      className="mt-2"
                      size="sm"
                    >
                      Przenieś dane do chmury
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={signOut}
                  variant="destructive"
                >
                  Wyloguj się
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Logowanie / Rejestracja</CardTitle>
              <CardDescription>
                {totalItems > 0 
                  ? `Załóż konto aby synchronizować swoje dane (${totalItems} elementów) między urządzeniami`
                  : 'Załóż konto aby synchronizować swoje dane między urządzeniami'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={authMode === 'signin' ? 'default' : 'outline'}
                    onClick={() => setAuthMode('signin')}
                    className="flex-1"
                  >
                    Logowanie
                  </Button>
                  <Button
                    type="button"
                    variant={authMode === 'signup' ? 'default' : 'outline'}
                    onClick={() => setAuthMode('signup')}
                    className="flex-1"
                  >
                    Rejestracja
                  </Button>
                </div>
                
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Twój email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Hasło</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Twoje hasło"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  {authMode === 'signup' && (
                    <div>
                      <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Powtórz hasło"
                        required
                        minLength={6}
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={authLoading || loading}
                  >
                    {authLoading ? 'Przetwarzanie...' : 
                     authMode === 'signup' ? 'Utwórz konto' : 'Zaloguj się'}
                  </Button>
                </form>
                
                {totalItems > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      💡 Po zalogowaniu Twoje lokalne dane ({totalItems} elementów) zostaną automatycznie przeniesione do chmury!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personalizacja</CardTitle>
            <CardDescription>Dostosuj aplikację do swoich preferencji</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Twoje imię</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                  placeholder="Jak mam się do Ciebie zwracać?"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wygląd</CardTitle>
            <CardDescription>Zmień motyw i rozmiar czcionki</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Motyw</Label>
              <Select value={settings.theme} onValueChange={(value: any) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Jasny</SelectItem>
                  <SelectItem value="dark">Ciemny</SelectItem>
                  <SelectItem value="auto">Automatyczny</SelectItem>
                  <SelectItem value="blue">🌊 Niebieski</SelectItem>
                  <SelectItem value="pink">🌸 Różowy</SelectItem>
                  <SelectItem value="green">🌿 Zielony</SelectItem>
                  <SelectItem value="purple">🔮 Fioletowy</SelectItem>
                  <SelectItem value="orange">🍊 Pomarańczowy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Rozmiar czcionki</Label>
              <Select value={settings.fontSize} onValueChange={(value: any) => updateSetting('fontSize', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Mały</SelectItem>
                  <SelectItem value="medium">Średni</SelectItem>
                  <SelectItem value="large">Duży</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <APIKeySettings />

        <Card>
          <CardHeader>
            <CardTitle>Zachowanie aplikacji</CardTitle>
            <CardDescription>Dostosuj sposób działania aplikacji</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tryb przyjazny</Label>
                <p className="text-sm text-muted-foreground">
                  Ciepłe, motywujące komunikaty
                </p>
              </div>
              <Switch
                checked={settings.friendlyMode}
                onCheckedChange={(checked) => updateSetting('friendlyMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cytaty motywacyjne</Label>
                <p className="text-sm text-muted-foreground">
                  Codzienne dawki motywacji
                </p>
              </div>
              <Switch
                checked={settings.showMotivationalQuotes}
                onCheckedChange={(checked) => updateSetting('showMotivationalQuotes', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Powiadomienia</Label>
                <p className="text-sm text-muted-foreground">
                  Przypomnienia o zadaniach
                </p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Akcje</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={saveSettings} disabled={!hasUnsavedChanges}>
              Zapisz ustawienia
            </Button>
            <Button variant="outline" onClick={resetSettings}>
              Resetuj do domyślnych
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>ZapiszTo - Twój zewnętrzny mózg 🧠</p>
              <p>Wersja 1.0.0 • Stworzone z ❤️ dla produktywności</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;