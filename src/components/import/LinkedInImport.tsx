import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Upload, ChevronLeft, ArrowRight } from 'lucide-react';

interface LinkedInImportProps {
  onBack: () => void;
}

const LinkedInImport: React.FC<LinkedInImportProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import depuis LinkedIn</h2>
          <p className="text-gray-600">Suivez ce guide pour importer votre profil via un export PDF.</p>
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
            Importer votre profil LinkedIn en 2 étapes
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La connexion directe à LinkedIn n'est pas possible pour des raisons de sécurité.
            La méthode la plus simple et la plus sûre est d'exporter votre profil en PDF et de l'importer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full">1</span>
              <h4 className="font-semibold text-lg text-gray-800">Exporter votre PDF depuis LinkedIn</h4>
            </div>
            <ul className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
              <li>Allez sur votre profil LinkedIn.</li>
              <li>Cliquez sur le bouton <strong>"Plus"</strong> sous votre nom.</li>
              <li>Sélectionnez <strong>"Enregistrer au format PDF"</strong>.</li>
              <li>Le fichier PDF sera téléchargé sur votre ordinateur.</li>
            </ul>
             <a 
                href="https://www.linkedin.com/in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:underline"
            >
                <span>Aller sur mon profil LinkedIn</span>
                <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full">2</span>
              <h4 className="font-semibold text-lg text-gray-800">Importer le PDF ici</h4>
            </div>
            <p className="text-gray-600 pl-4">
              Une fois le PDF téléchargé, revenez en arrière et choisissez l'option <strong>"Upload de fichier"</strong> pour que notre IA analyse votre profil.
            </p>
            <div className="pl-4">
                <button
                onClick={onBack}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                >
                    <Upload className="w-5 h-5" />
                    <span>Retourner à l'import</span>
                </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImport;
