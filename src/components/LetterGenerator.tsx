import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Download, Save, ChevronLeft, Settings, Loader2 } from 'lucide-react';
import { JobOffer, UserProfile, APIConfig, CoverLetter, GenerationOptions } from '../types';
import { generateCoverLetter } from '../services/aiService';

interface LetterGeneratorProps {
  jobOffer: JobOffer;
  userProfile: UserProfile;
  apiConfig: APIConfig;
  onLetterSaved: (letter: CoverLetter) => void;
  onBack: () => void;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({
  jobOffer,
  userProfile,
  apiConfig,
  onLetterSaved,
  onBack
}) => {
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({
    tone: 'professional',
    length: 'medium',
    language: 'fr'
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const letter = await generateCoverLetter(jobOffer, userProfile, apiConfig, options);
      setGeneratedLetter(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      alert('Lettre copiée dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleSave = () => {
    if (!generatedLetter) return;

    const letter: CoverLetter = {
      id: Date.now().toString(),
      jobTitle: jobOffer.title,
      company: jobOffer.company,
      content: generatedLetter,
      createdAt: new Date(),
      tone: options.tone,
      length: options.length
    };

    onLetterSaved(letter);
    alert('Lettre sauvegardée avec succès !');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `lettre-motivation-${jobOffer.company}-${jobOffer.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Job Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la candidature</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Poste:</span>
            <p className="text-gray-600">{jobOffer.title}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Entreprise:</span>
            <p className="text-gray-600">{jobOffer.company}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Candidat:</span>
            <p className="text-gray-600">{userProfile.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Modèle IA:</span>
            <p className="text-gray-600">{apiConfig.provider} - {apiConfig.model}</p>
          </div>
        </div>
      </div>

      {/* Generation Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Options de génération</h3>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>{showOptions ? 'Masquer' : 'Personnaliser'}</span>
          </button>
        </div>

        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ton</label>
              <select
                value={options.tone}
                onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value as GenerationOptions['tone'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professionnel</option>
                <option value="enthusiastic">Enthousiaste</option>
                <option value="confident">Confiant</option>
                <option value="creative">Créatif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longueur</label>
              <select
                value={options.length}
                onChange={(e) => setOptions(prev => ({ ...prev, length: e.target.value as GenerationOptions['length'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Courte</option>
                <option value="medium">Moyenne</option>
                <option value="long">Longue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select
                value={options.language}
                onChange={(e) => setOptions(prev => ({ ...prev, language: e.target.value as GenerationOptions['language'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </motion.div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Générer la lettre</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Generated Letter */}
      {generatedLetter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lettre de motivation générée</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Copier"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Sauvegarder"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
              {generatedLetter}
            </pre>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LetterGenerator;
