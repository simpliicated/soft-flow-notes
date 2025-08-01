import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const APIKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey.trim());
      toast({
        title: "Klucz API zapisany",
        description: "Możesz teraz korzystać z rozszerzonych funkcji AI!",
      });
    } else {
      localStorage.removeItem('openai-api-key');
      toast({
        title: "Klucz API usunięty",
        description: "Funkcje AI będą działać w trybie demo.",
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedKey = localStorage.getItem('openai-api-key') || '';
    setApiKey(savedKey);
    setIsEditing(false);
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}` : '';

  return (
    <Card className="card-soft">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Klucz API OpenAI
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Dodaj swój klucz API OpenAI, aby korzystać z zaawansowanych funkcji AI do rozwijania notatek i pomysłów.
        </p>

        <div className="space-y-3">
          <Label htmlFor="api-key" className="text-sm font-medium">
            Klucz API
          </Label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                disabled={!isEditing}
                className="pr-10"
              />
              {apiKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              )}
            </div>
            
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="px-3"
              >
                {apiKey ? 'Edytuj' : 'Dodaj'}
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="px-3"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="px-3"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {apiKey && !isEditing && (
            <p className="text-xs text-muted-foreground">
              Aktualny klucz: {maskedKey}
            </p>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Jak uzyskać klucz API:</strong><br />
            1. Idź na <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a><br />
            2. Utwórz nowy klucz API<br />
            3. Skopiuj go i wklej tutaj
          </p>
        </div>
      </div>
    </Card>
  );
};

export default APIKeySettings;