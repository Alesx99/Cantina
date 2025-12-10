import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";
import { Wine } from '../models/wine.model';

// Assume 'process' is available in the global scope, injected by the environment.
declare var process: any;

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  public error = signal<string | null>(null);

  constructor() {
    let apiKey: string | undefined;
    try {
      // This will only work if the environment provides a 'process' global.
      apiKey = process.env.API_KEY;
    } catch (e) {
      apiKey = undefined;
    }

    if (apiKey && apiKey !== "YOUR_API_KEY_HERE") {
       this.ai = new GoogleGenAI({ apiKey: apiKey });
    } else {
        console.warn("API Key non trovata o è un placeholder. Verranno usati dati fittizi. Fornisci una chiave API valida.");
    }
  }

  async generateWineDetails(wine: Omit<Wine, 'id' | 'labelImage'>): Promise<{ tastingNotes: string; foodPairings: string[] } | null> {
    this.error.set(null);

    if (!this.ai) {
      console.log("Gemini AI non inizializzato. Verranno restituiti dati fittizi.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      return {
        tastingNotes: `Questo ${wine.name} ${wine.year} di ${wine.winery} offre un delizioso bouquet di frutti di bosco finti e rovere simulato. Al palato si presenta una struttura complessa di sapori generati, con un finale morbido e algoritmicamente bilanciato.`,
        foodPairings: ['Tagliere di formaggi stagionati', 'Agnello arrosto con rosmarino', 'Tortino al cioccolato con cuore caldo']
      };
    }
    
    const prompt = `Analizza il seguente vino e fornisci note di degustazione e tre abbinamenti gastronomici.
    Nome Vino: ${wine.name}
    Cantina: ${wine.winery}
    Annata: ${wine.year}
    Tipo: ${wine.type}
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tastingNotes: { type: Type.STRING },
              foodPairings: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });
      
      const jsonString = response.text.trim();
      const result = JSON.parse(jsonString);

      return result;
    } catch (e) {
      console.error('Errore durante la generazione di contenuti da Gemini:', e);
      this.error.set('Impossibile generare contenuto AI. Il modello potrebbe essere sovraccarico. Riprova più tardi.');
      return null;
    }
  }
}