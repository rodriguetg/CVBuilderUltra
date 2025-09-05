import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Edit, Linkedin, Globe, ChevronRight } from 'lucide-react';
import FileUpload from '../components/import/FileUpload';
import LinkedInImport from '../components/import/LinkedInImport';
import ManualForm from '../components/import/ManualForm';

type ImportMethod = 'file' | 'linkedin' | 'url' | 'manual';

const ImportPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod | null>(null);

  const importMethods = [
    {
      id: 'file' as ImportMethod,
      title: 'Upload de fichier',
      description: 'Importez votre CV existant (PDF, DOC, DOCX)',
      icon: Upload,
      color: 'blue',
      recommended: true,
      disabled: false
    },
    {
      id: 'linkedin' as ImportMethod,
      title: 'Guide d\'import LinkedIn',
      description: 'Suivez les étapes pour exporter votre profil en PDF et l\'importer.',
      icon: Linkedin,
      color: 'indigo',
      recommended: false,
      disabled: false
    },
    {
      id: 'url' as ImportMethod,
      title: 'Import Indeed/URL (Bientôt disponible)',
      description: 'Importez depuis Indeed ou une URL de profil.',
      icon: Globe,
      color: 'purple',
      recommended: false,
      disabled: true
    },
    {
      id: 'manual' as ImportMethod,
      title: 'Saisie manuelle',
      description: 'Créez votre profil à partir de zéro.',
      icon: Edit,
      color: 'green',
      recommended: false,
      disabled: false
    }
  ];

  const renderImportComponent = () => {
    switch (selectedMethod) {
      case 'file':
        return <FileUpload onBack={() => setSelectedMethod(null)} />;
      case 'linkedin':
        return <LinkedInImport onBack={() => setSelectedMethod(null)} />;
      case 'manual':
        return <ManualForm onBack={() => setSelectedMethod(null)} />;
      default:
        return null;
    }
  };

  if (selectedMethod) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto"
      >
        {renderImportComponent()}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Importez votre profil professionnel
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choisissez la méthode d'import qui vous convient le mieux. Nos algorithmes d'IA extrairont automatiquement toutes les informations pertinentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {importMethods.map((method, index) => {
          const Icon = method.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
            purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          };

          return (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !method.disabled && setSelectedMethod(method.id)}
              disabled={method.disabled}
              className={`relative bg-white rounded-xl shadow-lg p-8 text-left transition-all duration-200 border border-gray-200 ${method.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:border-gray-300 group'}`}
            >
              {method.recommended && !method.disabled && (
                <div className="absolute -top-3 left-6 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  Recommandé
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[method.color]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600">
                {method.description}
              </p>

              <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>Import automatique</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Import Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="font-semibold text-blue-900 mb-4">💡 Conseils pour un import optimal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Pour les fichiers PDF/DOC :</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Utilisez un CV bien structuré</li>
              <li>Évitez les images complexes</li>
              <li>Préférez les formats texte standards</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Pour LinkedIn :</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Assurez-vous que votre profil est complet</li>
              <li>Utilisez des descriptions détaillées</li>
              <li>Mettez à jour vos compétences</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImportPage;
