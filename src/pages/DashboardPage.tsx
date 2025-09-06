import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCVContext } from '../context/CVContext';
import { Plus, FileText, Target, TrendingUp, FileSignature, Calendar, Edit, Trash2, Briefcase } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardAnalytics from '../components/dashboard/DashboardAnalytics';

const DashboardPage: React.FC = () => {
  const { state, dispatch, currentProfile, currentCVs } = useCVContext();
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const importStatus = searchParams.get('import');
    if (importStatus === 'success' || importStatus === 'manual') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  const handleDeleteCV = (cvId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.')) {
      dispatch({ type: 'DELETE_CV', payload: cvId });
    }
  };

  const stats = [
    {
      label: 'CV créés (profil actuel)',
      value: currentCVs.length,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Lettres générées',
      value: state.letters.length,
      icon: FileSignature,
      color: 'green',
    },
    {
      label: 'Score moyen',
      value: currentCVs.length > 0 ? Math.round(currentCVs.reduce((sum, cv) => sum + (cv.score || 0), 0) / currentCVs.length) : 0,
      icon: TrendingUp,
      color: 'purple',
    },
    {
      label: 'Offres ciblées',
      value: state.jobOffers.length,
      icon: Target,
      color: 'orange',
    }
  ];

  const recentCVs = currentCVs.slice(0, 3);
  const recentLetters = state.letters.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-green-900">Import réussi !</h3>
            <p className="text-green-700 text-sm">
              Votre nouveau profil a été créé avec succès. Vous pouvez maintenant créer votre premier CV.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {currentProfile ? `Profil actif : ${currentProfile.name}` : 'Gérez vos CV et candidatures'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/letter-generator"
            className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border hover:bg-gray-50 flex items-center space-x-2"
          >
            <FileSignature className="w-5 h-5" />
            <span>Nouvelle Lettre</span>
          </Link>
          <Link
            to="/edit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau CV</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600'
          };

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <DashboardAnalytics cvs={currentCVs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent CVs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">CV récents</h2>
            <Link to="/edit" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tous
            </Link>
          </div>
          {recentCVs.length > 0 ? (
            <div className="space-y-4">
              {recentCVs.map((cv) => (
                <div key={cv.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cv.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        {cv.targetCompany && <span>{cv.targetCompany}</span>}
                        <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{new Date(cv.updatedAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/edit/${cv.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => handleDeleteCV(cv.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">Aucun CV créé pour ce profil</h3></div>
          )}
        </motion.div>

        {/* Recent Letters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Lettres récentes</h2>
            <Link to="/letter-generator" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir toutes
            </Link>
          </div>
          {recentLetters.length > 0 ? (
            <div className="space-y-4">
              {recentLetters.map((letter) => (
                <div key={letter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center">
                      <FileSignature className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{letter.jobTitle}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center space-x-1"><Briefcase className="w-3 h-3" /><span>{letter.company}</span></span>
                        <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{new Date(letter.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Link to="/letter-generator" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FileSignature className="w-4 h-4" /></Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8"><FileSignature className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">Aucune lettre générée</h3></div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
