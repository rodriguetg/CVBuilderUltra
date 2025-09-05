import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { useCVContext } from '../../context/CVContext';
import { calculateMatch } from '../../services/matchingService';
import { JobOffer, MatchingResult } from '../../types';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobMatchModal: React.FC<JobMatchModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCVContext();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<MatchingResult | null>(null);

  const handleAnalyze = () => {
    if (!state.currentProfile || !jobDescription) return;

    const jobOffer: JobOffer = {
        id: `job-${Date.now()}`,
        title: 'Offre analysée',
        company: 'Inconnue',
        description: jobDescription,
        requirements: [],
        keywords: [],
        source: 'manual',
        createdAt: new Date()
    };

    const matchResult = calculateMatch(state.currentProfile, jobOffer);
    setResult(matchResult);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        >
          <header className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span>Analyse de l'offre d'emploi</span>
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </header>

          <main className="p-6 overflow-y-auto flex-grow">
            {!result ? (
              <div className="space-y-4">
                <label htmlFor="job-desc" className="font-medium text-gray-700">
                  Collez la description du poste ci-dessous :
                </label>
                <textarea
                  id="job-desc"
                  rows={10}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Collez ici la description complète de l'offre d'emploi..."
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!jobDescription}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  Analyser et calculer le score
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600">{result.score}%</div>
                    <p className="text-lg text-gray-600">Score de compatibilité</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2 flex items-center"><CheckCircle className="w-5 h-5 mr-2"/>Compétences correspondantes</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.matchedSkills.slice(0, 10).map(skill => (
                                <span key={skill} className="px-2 py-1 bg-green-200 text-green-900 text-xs rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-800 mb-2 flex items-center"><XCircle className="w-5 h-5 mr-2"/>Compétences manquantes</h3>
                         <div className="flex flex-wrap gap-2">
                            {result.missingSkills.slice(0, 10).map(skill => (
                                <span key={skill} className="px-2 py-1 bg-red-200 text-red-900 text-xs rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-800 mb-2 flex items-center"><Lightbulb className="w-5 h-5 mr-2"/>Suggestions d'amélioration</h3>
                    <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1">
                        <li>Ajoutez les compétences manquantes si vous les possédez.</li>
                        <li>Mettez en avant vos expériences liées à "{result.matchedSkills[0]}" et "{result.matchedSkills[1]}".</li>
                        <li>Utilisez les mots-clés de l'offre dans votre résumé.</li>
                    </ul>
                </div>
              </div>
            )}
          </main>

          <footer className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
            {result && (
                 <button onClick={() => setResult(null)} className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-100">
                    Analyser une autre offre
                </button>
            )}
            <button onClick={onClose} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Fermer
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JobMatchModal;
