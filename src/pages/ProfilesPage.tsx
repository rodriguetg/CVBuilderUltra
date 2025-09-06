import React from 'react';
import { motion } from 'framer-motion';
import { useCVContext } from '../context/CVContext';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

const ProfilesPage: React.FC = () => {
  const { state, dispatch } = useCVContext();
  const { profiles, currentProfileId } = state;

  const handleSetCurrent = (profileId: string) => {
    dispatch({ type: 'SET_CURRENT_PROFILE_ID', payload: profileId });
  };

  const handleDeleteProfile = (profileId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ? Tous les CV associés seront également supprimés. Cette action est irréversible.')) {
      dispatch({ type: 'DELETE_PROFILE', payload: profileId });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <span>Gestion des Profils</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Créez et gérez différents profils pour adapter vos CV à chaque candidature.
          </p>
        </div>
        <Link
          to="/import"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Profil</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-lg border-2 flex flex-col ${
              currentProfileId === profile.id ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <div className="p-6 flex-grow">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                {currentProfileId === profile.id && (
                  <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>Actif</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
              <p className="text-sm text-gray-600 mt-4 h-16 overflow-hidden">
                {profile.summary}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-xl">
              <button
                onClick={() => handleSetCurrent(profile.id)}
                disabled={currentProfileId === profile.id}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Définir comme actif
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200" title="Modifier (Bientôt)">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                  title="Supprimer le profil"
                  disabled={profiles.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;
