import axios from 'axios';
import { APIConfig, UserProfile, JobOffer } from '../types';

const getApiUrl = (provider: 'openai' | 'deepseek') => {
  if (provider === 'openai') return 'https://api.openai.com/v1/chat/completions';
  return 'https://api.deepseek.com/v1/chat/completions';
};

const callApi = async (prompt: string, apiConfig: APIConfig) => {
  const { provider, apiKey, model } = apiConfig;
  const url = getApiUrl(provider);
  const defaultModel = provider === 'openai' ? 'gpt-4-turbo' : 'deepseek-chat';

  try {
    const response = await axios.post(
      url,
      {
        model: model || defaultModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`Error calling ${provider} API:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(`Erreur d'authentification avec ${provider}. Veuillez vérifier votre clé API.`);
    }
    throw new Error(`Une erreur est survenue lors de la communication avec l'API ${provider}.`);
  }
};

export const generateRewriteSuggestion = async (
  section: string,
  currentText: string,
  profile: UserProfile,
  jobOffer: JobOffer | null,
  apiConfig: APIConfig
): Promise<string> => {
  const jobContext = jobOffer
    ? `
**OFFRE D'EMPLOI CIBLÉE :**
- Titre: ${jobOffer.title}
- Entreprise: ${jobOffer.company}
- Mots-clés: ${jobOffer.keywords.join(', ')}
`
    : '';

  const prompt = `
En tant qu'expert en recrutement et en rédaction de CV, réécris la section suivante d'un CV pour la rendre plus percutante et professionnelle.
Adapte la réécriture pour correspondre au mieux à l'offre d'emploi ciblée si elle est fournie.

**PROFIL DU CANDIDAT :**
- Profession: Développeur Full-Stack
- Expérience clé: ${profile.experience.map(e => e.title).join(', ')}
- Compétences clés: ${profile.skills.slice(0, 5).map(s => s.name).join(', ')}

${jobContext}

**SECTION À RÉÉCRIRE :**
- Type de section: "${section}"
- Contenu actuel: "${currentText}"

**INSTRUCTIONS :**
1.  Utilise un langage d'action et des verbes forts.
2.  Quantifie les réalisations avec des chiffres lorsque c'est possible.
3.  Mets en évidence l'alignement avec l'offre d'emploi.
4.  Sois concis et direct.
5.  Ne retourne QUE le texte réécrit, sans introduction ni conclusion.

**RÉÉCRITURE PROPOSÉE :**
`;

  return callApi(prompt, apiConfig);
};
