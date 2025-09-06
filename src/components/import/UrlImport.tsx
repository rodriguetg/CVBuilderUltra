import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronLeft, AlertTriangle, Link2 } from 'lucide-react';

interface UrlImportProps {
  onBack: () => void;
}

const UrlImport: React.FC<UrlImportProps> = ({ onBack }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!url.includes('linkedin.com/in/')) {
        setError('Veuillez entrer une URL de profil LinkedIn valide (ex: https://www.linkedin.com/in/votre-nom).');
        return;
    }
    
    setError('');
    
    // Display the informational error about CORS limitation
    setError("L'import direct depuis une URL LinkedIn n'est pas possible depuis votre navigateur pour des raisons de sécurité (CORS). Cette fonctionnalité nécessite un service côté serveur pour fonctionner. Nous vous recommandons d'utiliser la méthode d'export PDF de LinkedIn, qui est plus fiable et sécurisée.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import depuis une URL LinkedIn</h2>
          <p className="text-gray-600">Collez l'URL de votre profil pour l'analyser.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Link2 className="w-4 h-4 mr-2" />
              URL de votre profil LinkedIn
            </label>
            <input
              id="linkedin-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!url}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Globe className="w-5 h-5" />
            <span>Analyser le profil</span>
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg flex items-start space-x-3"
          >
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-yellow-800">Note importante</h4>
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UrlImport;
