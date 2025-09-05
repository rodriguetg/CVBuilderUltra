import axios from 'axios';
import { JobOffer, UserProfile, APIConfig, GenerationOptions } from '../types';

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
    } else {
      return await callDeepSeek(prompt, apiConfig);
    }
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
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

const callOpenAI = async (prompt: string, apiConfig: APIConfig): Promise<string> => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: apiConfig.model || 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
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
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
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
