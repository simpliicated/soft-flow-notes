import { useState } from 'react';

interface AIResponse {
  content: string;
  error?: string;
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const expandNote = async (noteContent: string, noteTitle: string): Promise<AIResponse> => {
    setIsLoading(true);
    
    try {
      // Check if OpenAI API key is available
      const apiKey = localStorage.getItem('openai-api-key');
      
      if (!apiKey) {
        // Return enhanced mock response with better context
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const expandedContent = `💡 **Rozwinięcie pomysłu: "${noteTitle}"**

🌟 **Główna myśl:** ${noteContent}

🔍 **Możliwe kierunki rozwoju:**
• **Praktyczne zastosowanie:** Jak możesz wykorzystać ten pomysł w codziennym życiu?
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

*💡 Aby uzyskać bardziej spersonalizowane rozwinięcia, dodaj swój klucz OpenAI API w ustawieniach.*`;

        return { content: expandedContent };
      }

      // Real OpenAI API call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Jesteś pomocnym asystentem, który rozwijają pomysły użytkowników. Odpowiadaj w języku polskim. Bądź kreatywny, praktyczny i inspirujący. Pomagaj przekształcać proste pomysły w konkretne plany działania.'
            },
            {
              role: 'user',
              content: `Rozwiń ten pomysł/notatkę w sposób praktyczny i inspirujący:

Tytuł: "${noteTitle}"
Treść: "${noteContent}"

Zaproponuj konkretne kierunki rozwoju, działania do podjęcia, pytania do rozważenia i powiązania z innymi obszarami życia. Bądź kreatywny ale praktyczny.`
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Błąd API OpenAI');
      }

      const data = await response.json();
      const expandedContent = data.choices[0]?.message?.content || 'Nie udało się wygenerować odpowiedzi.';

      return { content: expandedContent };
    } catch (error) {
      return { 
        content: '', 
        error: 'Nie udało się rozwinąć notatki. Sprawdź klucz API lub spróbuj ponownie.' 
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