import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Wand2, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { useCVContext } from '../../context/CVContext';
import { generateRewriteSuggestion } from '../../services/aiGenerator';
import { CVSectionType, JobOffer } from '../../types';
import { Link } from 'react-router-dom';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (newText: string) => void;
  sectionType: CVSectionType | null;
  itemId: string | null;
  currentText: string;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({ 
    isOpen, onClose, onApply, sectionType, currentText 
}) => {
  const { state } = useCVContext();
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestion = async () => {
    if (!sectionType || !state.currentProfile) {
        setError("Impossible de générer une suggestion sans contexte.");
        return;
    }
    if (!state.settings.apiConfig?.apiKey) {
      setError('Clé API manquante.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestion('');

    let jobOfferContext: JobOffer | null = null;
    if (state.currentCV?.targetJob) {
        jobOfferContext = {
            id: 'context-job',
            title: state.currentCV.targetJob,
            company: state.currentCV.targetCompany || '',
            description: '', // Not available here, but title is most important
            requirements: [],
            keywords: [state.currentCV.targetJob],
            source: 'manual',
            createdAt: new Date(),
        };
    }

    try {
      const newSuggestion = await generateRewriteSuggestion(
        sectionType,
        currentText,
        state.currentProfile,
        jobOfferContext,
        state.settings.apiConfig
      );
      setSuggestion(newSuggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          <header className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Bot className="w-6 h-6 text-blue-600" />
              <span>Suggestion de Réécriture IA</span>
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </header>

          <main className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Text */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Version Actuelle</h3>
              <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{currentText}</pre>
              </div>
            </div>

            {/* Suggested Text */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Suggestion IA</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 h-full relative overflow-y-auto">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <div className="text-center">
                        <Bot className="w-8 h-8 text-blue-500 animate-pulse mx-auto" />
                        <p className="mt-2 text-blue-700">L'IA réfléchit...</p>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-red-700 font-medium">Erreur de génération</p>
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                    {error === 'Clé API manquante.' && (
                        <Link to="/settings" className="mt-2 text-xs text-white bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-700">
                            Configurer l'API
                        </Link>
                    )}
                  </div>
                )}
                {!isLoading && !error && suggestion && (
                  <pre className="whitespace-pre-wrap font-sans">{suggestion}</pre>
                )}
              </div>
            </div>
          </main>

          <footer className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
                Propulsé par {state.settings.apiConfig?.provider || 'IA'}. Les suggestions peuvent être imprécises.
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchSuggestion} 
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Régénérer</span>
              </button>
              <button 
                onClick={() => onApply(suggestion)}
                disabled={isLoading || !!error || !suggestion}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>Appliquer la suggestion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AISuggestionModal;
