
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { noteContent, noteTitle } = await req.json();

    if (!noteContent || !noteTitle) {
      throw new Error('noteContent and noteTitle are required');
    }

    console.log('Expanding note:', { noteTitle, contentLength: noteContent.length });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Jesteś pomocnym asystentem, który rozwija pomysły użytkowników. Odpowiadaj w języku polskim. Bądź kreatywny, praktyczny i inspirujący. Pomagaj przekształcać proste pomysły w konkretne plany działania. Używaj emoji i formatowania markdown dla lepszej czytelności.'
          },
          {
            role: 'user',
            content: `Rozwiń ten pomysł/notatkę w sposób praktyczny i inspirujący:

Tytuł: "${noteTitle}"
Treść: "${noteContent}"

Zaproponuj:
- 🎯 Konkretne kierunki rozwoju
- ⚡ Działania do podjęcia 
- 🤔 Pytania do rozważenia
- 🔗 Powiązania z innymi obszarami życia
- 📋 Następne kroki

Bądź kreatywny ale praktyczny. Maksymalnie 500 słów.`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const expandedContent = data.choices[0]?.message?.content || 'Nie udało się wygenerować odpowiedzi.';

    console.log('Note expanded successfully');

    return new Response(JSON.stringify({ 
      content: expandedContent,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-expand-note function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Nie udało się rozwinąć notatki',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
