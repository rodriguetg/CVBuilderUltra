import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2, AlertTriangle, Briefcase, ExternalLink, Clock, DollarSign, FileText, X } from 'lucide-react';
import { searchJobs } from '../services/joobleService';
import { JobOffer, CV } from '../types';
import { useCVContext } from '../context/CVContext';
import { useNavigate } from 'react-router-dom';

const SelectCVModal: React.FC<{ job: JobOffer; onClose: () => void }> = ({ job, onClose }) => {
    const { currentCVs, dispatch } = useCVContext();
    const navigate = useNavigate();

    const handleSelectCv = (cvId: string) => {
        dispatch({
            type: 'UPDATE_CV',
            payload: {
                cvId,
                updates: {
                    targetJob: job.title,
                    targetCompany: job.company,
                },
            },
        });
        navigate(`/edit/${cvId}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
            >
                <header className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Choisir un CV</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </header>
                <main className="p-6">
                    <p className="text-gray-600 mb-4">
                        Quel CV souhaitez-vous utiliser pour l'offre "{job.title}" chez {job.company} ?
                    </p>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {currentCVs.length > 0 ? (
                            currentCVs.map((cv: CV) => (
                                <button
                                    key={cv.id}
                                    onClick={() => handleSelectCv(cv.id)}
                                    className="w-full text-left flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                                >
                                    <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800">{cv.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Aucun CV trouvé pour ce profil. Veuillez en créer un d'abord.
                            </p>
                        )}
                    </div>
                </main>
            </motion.div>
        </div>
    );
};

interface JobCardProps {
    job: JobOffer;
    onAnalyze: (job: JobOffer) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onAnalyze }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                    </div>
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{job.location}</span></span>
                    {job.type && <span className="flex items-center space-x-1"><Briefcase className="w-4 h-4" /><span>{job.type}</span></span>}
                    {job.salary && <span className="flex items-center space-x-1"><DollarSign className="w-4 h-4" /><span>{job.salary}</span></span>}
                </div>
                <p className="text-sm text-gray-700 mt-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: job.description }}></p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                 <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</span>
                </p>
                <button 
                    onClick={() => onAnalyze(job)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                    Analyser & Postuler
                </button>
            </div>
        </motion.div>
    );
};

const JobSearchPage: React.FC = () => {
    const [keywords, setKeywords] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState<JobOffer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [jobToAnalyze, setJobToAnalyze] = useState<JobOffer | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setJobs([]);

        try {
            const results = await searchJobs(keywords, location);
            setJobs(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {jobToAnalyze && (
                <SelectCVModal job={jobToAnalyze} onClose={() => setJobToAnalyze(null)} />
            )}

            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <Search className="w-8 h-8" />
                    <span>Recherche d'offres d'emploi</span>
                </h1>
                <p className="text-gray-600 mt-1">Trouvez votre prochain poste et analysez-le avec l'IA.</p>
            </div>

            {/* Search Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">Poste / Mots-clés</label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    id="keywords"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="ex: Développeur React"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                             <div className="relative">
                                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="ex: Paris, France"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !keywords}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        <span>{isLoading ? 'Recherche...' : 'Rechercher'}</span>
                    </button>
                </form>
            </motion.div>

            {/* Results */}
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-red-800">{error}</span>
                    </div>
                )}
                
                {jobs.length > 0 && (
                    <p className="text-gray-600">{jobs.length} offres trouvées</p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} onAnalyze={setJobToAnalyze} />
                    ))}
                </div>

                {!isLoading && jobs.length === 0 && !error && (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800">Lancez une recherche</h3>
                        <p className="text-gray-600">Utilisez le formulaire ci-dessus pour trouver des offres d'emploi.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSearchPage;
