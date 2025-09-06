import axios from 'axios';
import { APIConfig, UserProfile, JobOffer, CVSectionType } from '../types';

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
        max_tokens: 2000,
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
  section: CVSectionType,
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
- Mots-clés: ${jobOffer.keywords?.join(', ')}
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

export const parseCvTextToProfile = async (
  cvText: string,
  apiConfig: APIConfig
): Promise<Partial<UserProfile>> => {
  const prompt = `
    Analyse le texte brut de ce CV et extrais les informations pour les structurer en JSON.
    Ta réponse DOIT être un unique objet JSON valide. N'inclus AUCUN texte, explication, ou commentaire avant ou après l'objet JSON. N'utilise PAS de blocs de code markdown comme \`\`\`json. Ta sortie doit commencer par { et se terminer par }.
    Le JSON DOIT suivre EXACTEMENT la structure de l'interface TypeScript UserProfile ci-dessous.
    Si une information n'est pas trouvée, laisse le champ vide ("") ou le tableau vide ([]).
    Pour les dates, utilise le format AAAA-MM si possible, sinon laisse le texte tel quel.

    \`\`\`typescript
    interface UserProfile {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      summary: string;
      experience: {
        title: string;
        company: string;
        location?: string;
        startDate: string; // Format AAAA-MM
        endDate?: string; // Format AAAA-MM, ou vide si poste actuel
        current: boolean;
        description: string;
      }[];
      education: {
        degree: string;
        institution: string;
        location?: string;
        startDate: string; // Format AAAA-MM
        endDate?: string; // Format AAAA-MM
      }[];
      skills: {
        name: string;
        category: string; // ex: 'Frontend', 'Backend', 'Langages', 'Outils'
      }[];
      languages: {
        name:string;
        level: string; // ex: 'Natif', 'Courant', 'Intermédiaire'
      }[];
    }
    \`\`\`

    Voici le texte du CV à analyser :
    ---
    ${cvText}
    ---

    JSON de sortie :
  `;

  const jsonString = await callApi(prompt, apiConfig);

  try {
    // The API might return the JSON inside a markdown block, so we need to clean it.
    const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedJsonString);
    
    // We need to add IDs and other missing fields to match the full UserProfile type
    const profile: Partial<UserProfile> = {
      ...parsedData,
      id: `user-${Date.now()}`,
      experience: parsedData.experience?.map((exp: any, index: number) => ({
        ...exp,
        id: `exp-${index}`,
        achievements: [],
      })) || [],
      education: parsedData.education?.map((edu: any, index: number) => ({
        ...edu,
        id: `edu-${index}`,
      })) || [],
      skills: parsedData.skills?.map((skill: any, index: number) => ({
        ...skill,
        id: `skill-${index}`,
        level: 'intermediate', // Default level
      })) || [],
      languages: parsedData.languages?.map((lang: any, index: number) => ({
        ...lang,
        id: `lang-${index}`,
      })) || [],
      certifications: [],
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return profile;

  } catch (error) {
    console.error("Failed to parse AI response:", error);
    console.error("AI Response was:", jsonString);
    throw new Error("L'IA n'a pas pu analyser le CV. Le format du document est peut-être trop complexe.");
  }
};
