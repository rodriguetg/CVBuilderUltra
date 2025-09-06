import axios from 'axios';
import { JobOffer } from '../types';

const JOOBLE_API_URL = 'https://jooble.org/api/';
const API_KEY = import.meta.env.VITE_JOOBLE_API_KEY;

interface JoobleJob {
    title: string;
    location: string;
    salary: string;
    company: string;
    snippet: string;
    link: string;
    type: string;
    updated: string; // Date string
}

export const searchJobs = async (keywords: string, location: string): Promise<JobOffer[]> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
        throw new Error("La clé API Jooble n'est pas configurée. Veuillez l'ajouter dans vos paramètres.");
    }

    try {
        const response = await axios.post(
            `${JOOBLE_API_URL}${API_KEY}`,
            {
                keywords,
                location,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data && response.data.jobs) {
            return response.data.jobs.map((job: JoobleJob) => ({
                id: job.link, // Use link as a unique ID
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.snippet,
                requirements: [], // Jooble API doesn't provide this directly
                keywords: [],
                salary: job.salary,
                type: job.type,
                link: job.link,
                source: 'api',
                createdAt: new Date(job.updated),
            }));
        }

        return [];
    } catch (error) {
        console.error('Error fetching jobs from Jooble API:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Erreur de l'API Jooble : ${error.response.statusText}`);
        }
        throw new Error('Une erreur est survenue lors de la recherche d\'offres.');
    }
};
