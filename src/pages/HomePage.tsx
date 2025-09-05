import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Target, 
  Download,
  TrendingUp,
  ChevronRight,
  Check,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Import Intelligent',
      description: 'Importez votre profil depuis LinkedIn, Indeed ou uploadez votre CV existant'
    },
    {
      icon: Sparkles,
      title: 'IA Personnalisée',
      description: 'Notre IA analyse les offres d\'emploi et adapte automatiquement votre CV'
    },
    {
      icon: Target,
      title: 'Matching Précis',
      description: 'Scoring automatique et suggestions pour maximiser vos chances'
    },
    {
      icon: Download,
      title: 'Export Professionnel',
      description: 'Téléchargez en PDF, Word ou partagez via un lien unique'
    }
  ];

  const templates = [
    { name: 'Classique', preview: 'bg-blue-100', popular: false },
    { name: 'Moderne', preview: 'bg-indigo-100', popular: true },
    { name: 'Créatif', preview: 'bg-purple-100', popular: false },
    { name: 'Minimal', preview: 'bg-gray-100', popular: false }
  ];

  const stats = [
    { value: '10K+', label: 'CV créés' },
    { value: '95%', label: 'Taux de réussite' },
    { value: '50+', label: 'Templates disponibles' },
    { value: '24/7', label: 'Support IA' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Créez le CV <span className="text-blue-600">Parfait</span>
            <br />avec l'Intelligence Artificielle
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Importez votre profil, ciblez une offre d'emploi, et laissez notre IA créer un CV ultra-personnalisé qui maximise vos chances de décrocher l'entretien.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/import"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Commencer maintenant</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          
          <Link
            to="/dashboard"
            className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Voir les exemples
          </Link>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir CV Builder Ultra ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une solution complète qui combine l'intelligence artificielle et des templates professionnels pour créer des CV qui se démarquent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Templates Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Templates Professionnels
          </h2>
          <p className="text-gray-600">
            Choisissez parmi nos templates optimisés pour différents secteurs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="relative"
            >
              <div className={`aspect-[3/4] ${template.preview} rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200 cursor-pointer`}>
                {template.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Populaire</span>
                  </div>
                )}
              </div>
              <p className="text-center mt-2 font-medium text-gray-700">
                {template.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Un processus simple en 4 étapes pour créer votre CV parfait
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Import', desc: 'Importez votre profil existant' },
            { step: '2', title: 'Analyse', desc: 'Notre IA analyse vos données' },
            { step: '3', title: 'Personnalisation', desc: 'Adaptez selon l\'offre cible' },
            { step: '4', title: 'Export', desc: 'Téléchargez votre CV optimisé' }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-blue-100 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center bg-white rounded-2xl shadow-lg p-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Prêt à créer votre CV parfait ?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de candidats qui ont déjà trouvé leur emploi de rêve grâce à CV Builder Ultra.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/import"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Créer mon CV maintenant</span>
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-500" />
              <span>Gratuit</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-500" />
              <span>Sans inscription</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-500" />
              <span>Export illimité</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
