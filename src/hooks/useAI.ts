
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  content: string;
  error?: string;
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const expandNote = async (noteContent: string, noteTitle: string): Promise<AIResponse> => {
    setIsLoading(true);
    
    try {
      console.log('Calling AI expand function...', { noteTitle });
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-expand-note', {
        body: { noteContent, noteTitle }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Błąd wywołania funkcji AI');
      }

      if (data?.error) {
        console.error('AI function returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.content) {
        throw new Error('Brak odpowiedzi od AI');
      }

      console.log('AI expansion successful');
      return { content: data.content };

    } catch (error) {
      console.error('Error expanding note:', error);
      
      // Fallback to enhanced mock response
      console.log('Using fallback mock response...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const expandedContent = `💡 **Rozwinięcie pomysłu: "${noteTitle}"**

🌟 **Główna myśl:** ${noteContent}

🔍 **Możliwe kierunki rozwoju:**
• **Praktyczne zastosowanie:** Jak możesz wykorzystać ten pomysł w codziennym życie?
• **Powiązania:** Czy łączy się z innymi twoimi projektami lub pomysłami?
• **Następne kroki:** Jakie małe działania możesz podjąć już dziś?
• **Zasoby:** Czego potrzebujesz, aby ten pomysł zrealizować?

📝 **Konkretne działania:**
• Zrób szybki research na ten temat
• Porozmawiaj z kimś, kto ma doświadczenie w tej dziedzinie
• Rozpocznij od najmniejszego możliwego kroku
• Zaplanuj czas na regularne rozwijanie tej idei

🚀 **Dlaczego warto to robić:**
Ten pomysł może prowadzić do nieoczekiwanych odkryć i możliwości!

*⚠️ To była odpowiedź demo. Sprawdź ustawienia AI lub klucz API.*`;

      return { 
        content: expandedContent,
        error: error instanceof Error ? error.message : 'Nie udało się połączyć z AI - używam wersji demo'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expandNote,
    isLoading
  };
};
