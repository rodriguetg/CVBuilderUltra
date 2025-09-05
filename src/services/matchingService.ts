import { UserProfile, JobOffer, MatchingResult } from '../types';

const extractKeywords = (text: string): string[] => {
    return text.toLowerCase().match(/\b[a-z-]{3,}\b/g) || [];
};

export const calculateMatch = (profile: UserProfile, jobOffer: JobOffer): MatchingResult => {
    const profileText = `
        ${profile.summary}
        ${profile.experience.map(e => `${e.title} ${e.description} ${e.technologies?.join(' ')}`).join(' ')}
        ${profile.skills.map(s => s.name).join(' ')}
    `.toLowerCase();

    const jobKeywords = new Set(extractKeywords(jobOffer.description + ' ' + jobOffer.requirements.join(' ')));
    
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    jobKeywords.forEach(keyword => {
        if (profileText.includes(keyword)) {
            matchedSkills.push(keyword);
        } else {
            missingSkills.push(keyword);
        }
    });

    const score = jobKeywords.size > 0 ? Math.round((matchedSkills.length / jobKeywords.size) * 100) : 0;

    return {
        score,
        matchedSkills,
        missingSkills,
        suggestions: [] // AI suggestions can be added here
    };
};
