import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCVContext } from '../context/CVContext';
import { Plus, FileText, Target, TrendingUp, Users, Calendar, Eye, Download, MoreVertical } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { state } = useCVContext();
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const importStatus = searchParams.get('import');
    if (importStatus === 'success' || importStatus === 'manual') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  const stats = [
    {
      label: 'CV créés',
      value: state.cvs.length,
      icon: FileText,
      color: 'blue',
      change: '+2 ce mois'
    },
    {
      label: 'Vues totales',
      value: state.cvs.reduce((sum, cv) => sum + cv.views, 0),
      icon: Eye,
      color: 'green',
      change: '+15%'
    },
    {
      label: 'Score moyen',
      value: state.cvs.length > 0 ? Math.round(state.cvs.reduce((sum, cv) => sum + (cv.score || 0), 0) / state.cvs.length) : 0,
      icon: TrendingUp,
      color: 'purple',
      change: '+5 points'
    },
    {
      label: 'Offres ciblées',
      value: state.jobOffers.length,
      icon: Target,
      color: 'orange',
      change: '3 nouvelles'
    }
  ];

  const recentCVs = state.cvs.slice(0, 3);
  const recentJobOffers = state.jobOffers.slice(0, 3);

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
              Votre profil a été importé avec succès. Vous pouvez maintenant créer votre premier CV.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {state.currentProfile ? `Bonjour ${state.currentProfile.name}` : 'Gérez vos CV et candidatures'}
          </p>
        </div>
        
        <Link
          to="/edit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau CV</span>
        </Link>
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
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent CVs */}
        <div className="lg:col-span-2">
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
                {recentCVs.map((cv, index) => (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{cv.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          {cv.targetCompany && (
                            <span>{cv.targetCompany}</span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{cv.views} vues</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(cv.updatedAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                        {cv.score && (
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${cv.score}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{cv.score}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/edit/${cv.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun CV créé</h3>
                <p className="text-gray-600 mb-6">
                  Commencez par créer votre premier CV personnalisé
                </p>
                <Link
                  to="/edit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Créer un CV
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link
                to="/edit"
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Nouveau CV</span>
              </Link>
              <Link
                to="/import"
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Importer profil</span>
              </Link>
              <button className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors w-full text-left">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Ajouter offre</span>
              </button>
            </div>
          </motion.div>

          {/* Recent Job Offers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Offres récentes</h3>
            {recentJobOffers.length > 0 ? (
              <div className="space-y-3">
                {recentJobOffers.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">{job.title}</h4>
                    <p className="text-gray-600 text-xs">{job.company}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-blue-600">
                        {job.keywords.length} mots-clés
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune offre ciblée</p>
              </div>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
          >
            <h3 className="font-semibold mb-2">💡 Conseil du jour</h3>
            <p className="text-blue-100 text-sm">
              Personnalisez votre CV pour chaque offre d'emploi pour augmenter vos chances de 40% !
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
