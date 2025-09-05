import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ExternalLink, ChevronLeft, AlertCircle, Info } from 'lucide-react';

interface LinkedInImportProps {
  onBack: () => void;
}

const LinkedInImport: React.FC<LinkedInImportProps> = ({ onBack }) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      alert('Fonctionnalité en développement - Connexion LinkedIn bientôt disponible !');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import LinkedIn</h2>
          <p className="text-gray-600">Connectez votre profil LinkedIn pour un import automatique</p>
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Linkedin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Importez depuis LinkedIn
          </h3>
          <p className="text-gray-600">
            Connectez-vous à LinkedIn pour importer automatiquement toutes vos informations professionnelles
          </p>
        </div>

        {/* Method 1: Direct Connection */}
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Méthode 1: Connexion directe</h4>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Linkedin className="w-5 h-5" />
              <span>{isConnecting ? 'Connexion...' : 'Se connecter avec LinkedIn'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Method 2: URL Import */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Méthode 2: Import par URL</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de votre profil LinkedIn
                </label>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/votre-profil"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => alert('Fonctionnalité en développement')}
                disabled={!profileUrl}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                Importer depuis l'URL
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <h4 className="font-medium mb-1">Fonctionnalité en développement</h4>
              <p>
                L'import LinkedIn direct est actuellement en développement. 
                En attendant, vous pouvez utiliser l'upload de fichier ou la saisie manuelle.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">📊 Données importées automatiquement :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>✓ Informations personnelles</div>
          <div>✓ Expériences professionnelles</div>
          <div>✓ Formation et diplômes</div>
          <div>✓ Compétences et recommandations</div>
          <div>✓ Projets et réalisations</div>
          <div>✓ Langues et certifications</div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImport;
