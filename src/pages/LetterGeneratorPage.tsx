import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCVContext } from '../context/CVContext';
import { useNavigate } from 'react-router-dom';

import JobInputForm from '../components/JobInputForm';
import ProfileForm from '../components/ProfileForm';
import APISettings from '../components/APISettings';
import LetterGenerator from '../components/LetterGenerator';
import SavedLetters from '../components/SavedLetters';

import { JobOffer, UserProfile, APIConfig, CoverLetter } from '../types';
import { FileSignature, History, Plus } from 'lucide-react';

type Step = 'job' | 'profile' | 'api' | 'generate' | 'saved';

const LetterGeneratorPage: React.FC = () => {
  const { state, dispatch } = useCVContext();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('job');
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [apiConfig, setApiConfig] = useState<APIConfig | null>(null);
  const [view, setView] = useState<'new' | 'saved'>('new');

  useEffect(() => {
    if (state.currentProfile) {
      setUserProfile(state.currentProfile);
    }
    if (state.settings.apiConfig) {
      setApiConfig(state.settings.apiConfig);
    }
  }, [state.currentProfile, state.settings.apiConfig]);

  const handleJobComplete = (data: JobOffer) => {
    setJobOffer(data);
    setStep('profile');
  };

  const handleProfileComplete = (data: UserProfile) => {
    setUserProfile(data);
    if (state.settings.apiConfig?.apiKey) {
      setStep('generate');
    } else {
      setStep('api');
    }
  };

  const handleApiComplete = (data: APIConfig) => {
    setApiConfig(data);
    dispatch({ type: 'UPDATE_SETTINGS', payload: { apiConfig: data } });
    setStep('generate');
  };

  const handleLetterSaved = (letter: CoverLetter) => {
    dispatch({ type: 'ADD_LETTER', payload: letter });
    setView('saved');
    setStep('job'); // Reset for new letter
  };

  const handleDeleteLetter = (id: string) => {
    dispatch({ type: 'DELETE_LETTER', payload: id });
  };

  const renderStep = () => {
    switch (step) {
      case 'job':
        return <JobInputForm onComplete={handleJobComplete} />;
      case 'profile':
        return <ProfileForm onComplete={handleProfileComplete} onBack={() => setStep('job')} />;
      case 'api':
        return <APISettings onComplete={handleApiComplete} onBack={() => setStep('profile')} />;
      case 'generate':
        if (jobOffer && userProfile && apiConfig) {
          return (
            <LetterGenerator
              jobOffer={jobOffer}
              userProfile={userProfile}
              apiConfig={apiConfig}
              onLetterSaved={handleLetterSaved}
              onBack={() => setStep('api')}
            />
          );
        }
        return <div>Erreur de configuration. Veuillez recommencer.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <FileSignature className="w-8 h-8" />
            <span>Générateur de Lettres de Motivation</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Créez une lettre de motivation percutante et personnalisée avec l'aide de l'IA.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setView('new')}
          className={`px-4 py-2 text-sm font-medium ${view === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Nouvelle Lettre
        </button>
        <button
          onClick={() => setView('saved')}
          className={`px-4 py-2 text-sm font-medium ${view === 'saved' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          <History className="w-4 h-4 inline mr-2" />
          Lettres Sauvegardées
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {view === 'new' && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        )}
        {view === 'saved' && (
          <SavedLetters letters={state.letters} onDeleteLetter={handleDeleteLetter} />
        )}
      </div>
    </div>
  );
};

export default LetterGeneratorPage;
