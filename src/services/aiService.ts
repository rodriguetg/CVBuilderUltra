import axios from 'axios';
import { JobOffer, UserProfile, APIConfig, GenerationOptions } from '../types';

const callOpenAI = async (prompt: string, apiConfig: APIConfig): Promise<string> => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: apiConfig.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    },
    {
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content;
};

const callDeepSeek = async (prompt: string, apiConfig: APIConfig): Promise<string> => {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: apiConfig.model || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    },
    {
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content;
};

const callGemini = async (prompt: string, apiConfig: APIConfig): Promise<string> => {
  const model = apiConfig.model || 'gemini-1.5-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiConfig.apiKey}`;
  
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
    }
  }, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.data.candidates && response.data.candidates[0].content && response.data.candidates[0].content.parts[0]) {
    return response.data.candidates[0].content.parts[0].text;
  }
  throw new Error('Réponse inattendue de l\'API Gemini.');
};

const callOpenRouter = async (prompt: string, apiConfig: APIConfig): Promise<string> => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: apiConfig.model || 'google/gemma-7b-it:free',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CV Builder Ultra',
      },
    }
  );
  return response.data.choices[0].message.content;
};

export const generateCoverLetter = async (
  jobOffer: JobOffer,
  userProfile: UserProfile,
  apiConfig: APIConfig,
  options: GenerationOptions
): Promise<string> => {
  const prompt = createPrompt(jobOffer, userProfile, options);

  try {
    if (apiConfig.provider === 'openai') {
      return await callOpenAI(prompt, apiConfig);
    } else if (apiConfig.provider === 'deepseek') {
      return await callDeepSeek(prompt, apiConfig);
    } else if (apiConfig.provider === 'gemini') {
      return await callGemini(prompt, apiConfig);
    } else if (apiConfig.provider === 'openrouter') {
      return await callOpenRouter(prompt, apiConfig);
    } else {
      throw new Error(`Fournisseur d'API non supporté: ${apiConfig.provider}`);
    }
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data?.error?.message || 'Erreur inconnue';
      throw new Error(`Erreur de l'API ${apiConfig.provider} : ${apiError}. Vérifiez votre clé API et votre connexion internet.`);
    }
    throw new Error('Erreur lors de la génération de la lettre. Vérifiez votre clé API et votre connexion internet.');
  }
};

const createPrompt = (
  jobOffer: JobOffer,
  userProfile: UserProfile,
  options: GenerationOptions
): string => {
  const language = options.language === 'fr' ? 'français' : 'anglais';
  const lengthDesc = {
    short: 'courte (200-300 mots)',
    medium: 'moyenne (400-500 mots)',
    long: 'longue (600-800 mots)'
  };
  
  const toneDesc = {
    professional: 'professionnel et formel',
    enthusiastic: 'enthousiaste et motivé',
    confident: 'confiant et déterminé',
    creative: 'créatif et original'
  };

  return `Tu es un expert en rédaction de lettres de motivation. Génère une lettre de motivation personnalisée en ${language} avec les caractéristiques suivantes :

**INFORMATIONS SUR LE POSTE :**
- Titre : ${jobOffer.title}
- Entreprise : ${jobOffer.company}
- Localisation : ${jobOffer.location || 'Non spécifiée'}
- Type : ${jobOffer.type || 'Non spécifié'}
- Description : ${jobOffer.description}
- Compétences requises : ${jobOffer.requirements}

**PROFIL DU CANDIDAT :**
- Nom : ${userProfile.name}
- Email : ${userProfile.email}
- Téléphone : ${userProfile.phone || 'Non spécifié'}
- Formation : ${userProfile.education}
- Expérience : ${userProfile.experience}
- Compétences : ${userProfile.skills}
- Résumé professionnel : ${userProfile.summary || 'Non spécifié'}
- Réalisations : ${userProfile.achievements || 'Non spécifiées'}

**CONSIGNES DE RÉDACTION :**
- Ton : ${toneDesc[options.tone]}
- Longueur : ${lengthDesc[options.length]}
- Langue : ${language}
- Structure : Introduction, développement (adéquation profil/poste), conclusion
- Personnalisation : Mettre en avant les compétences et expériences du candidat qui correspondent spécifiquement aux exigences du poste
- Éviter les formulations génériques et clichés
- Montrer une connaissance de l'entreprise si possible
- Inclure les coordonnées du candidat en en-tête

Génère une lettre de motivation complète, professionnelle et convaincante qui maximise les chances d'obtenir un entretien.`;
};
