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
      // For now, return a mock response since we don't have OpenAI key setup
      // In a real implementation, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI thinking
      
      const expandedContent = `💡 **Rozwinięcie pomysłu z notatki "${noteTitle}":**

🌟 Główna myśl: ${noteContent}

🔍 **Możliwe kierunki rozwoju:**
• Praktyczne zastosowanie tej idei
• Powiązania z innymi projektami
• Kolejne kroki do realizacji
• Potencjalne wyzwania i rozwiązania

📝 **Pomysły na działania:**
• Utworzenie szczegółowego planu
• Poszukanie podobnych rozwiązań
• Zebranie potrzebnych zasobów
• Określenie pierwszych małych kroków

✨ To jest początek czegoś większego! Warto eksplorować te kierunki.`;

      return { content: expandedContent };
    } catch (error) {
      return { 
        content: '', 
        error: 'Nie udało się rozwinąć notatki. Spróbuj ponownie.' 
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