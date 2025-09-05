import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { APIConfig } from '../types';

interface APISettingsProps {
  onComplete: (config: APIConfig) => void;
  onBack: () => void;
}

const APISettings: React.FC<APISettingsProps> = ({ onComplete, onBack }) => {
  const [provider, setProvider] = useState<'openai' | 'deepseek'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem(`jobmotivator_${provider}_key`);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [provider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      alert('Veuillez saisir votre clé API.');
      return;
    }

    // Save API key to localStorage
    localStorage.setItem(`jobmotivator_${provider}_key`, apiKey);

    const config: APIConfig = {
      provider,
      apiKey: apiKey.trim(),
      model: model || getDefaultModel(provider)
    };

    onComplete(config);
  };

  const getDefaultModel = (provider: 'openai' | 'deepseek') => {
    return provider === 'openai' ? 'gpt-4' : 'deepseek-chat';
  };

  const models = {
    openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    deepseek: ['deepseek-chat', 'deepseek-coder']
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuration API
        </h2>
        <p className="text-gray-600">
          Configurez votre clé API pour générer des lettres de motivation personnalisées.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fournisseur d'IA
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                provider === 'openai'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">OpenAI</div>
              <div className="text-sm text-gray-600">GPT-4, GPT-3.5 Turbo</div>
            </button>

            <button
              type="button"
              onClick={() => setProvider('deepseek')}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                provider === 'deepseek'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">DeepSeek</div>
              <div className="text-sm text-gray-600">DeepSeek Chat, Coder</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="w-4 h-4 inline mr-2" />
            Clé API *
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Saisissez votre clé API ${provider === 'openai' ? 'OpenAI' : 'DeepSeek'}`}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Votre clé API est stockée localement et uniquement utilisée pour générer vos lettres.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle (optionnel)
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Par défaut ({getDefaultModel(provider)})</option>
            {models[provider].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Comment obtenir votre clé API ?</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {provider === 'openai' ? (
              <>
                <p>1. Rendez-vous sur <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a></p>
                <p>2. Connectez-vous et allez dans "API Keys"</p>
                <p>3. Créez une nouvelle clé API</p>
              </>
            ) : (
              <>
                <p>1. Rendez-vous sur <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline">platform.deepseek.com</a></p>
                <p>2. Connectez-vous et allez dans "API Keys"</p>
                <p>3. Créez une nouvelle clé API</p>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Générer la lettre</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default APISettings;
