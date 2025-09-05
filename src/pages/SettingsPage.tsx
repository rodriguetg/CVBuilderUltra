import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCVContext } from '../context/CVContext';
import { Settings, Key, Palette, Globe, Bell, Eye, EyeOff } from 'lucide-react';
import { APIConfig } from '../types';

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useCVContext();
  const [apiConfig, setApiConfig] = useState<Partial<APIConfig>>({
    provider: 'openai',
    apiKey: '',
    model: ''
  });
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (state.settings.apiConfig) {
      setApiConfig(state.settings.apiConfig);
    }
  }, [state.settings.apiConfig]);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { apiConfig: apiConfig as APIConfig } });
    alert('Configuration API sauvegardée !');
  };

  const handleProviderChange = (provider: 'openai' | 'deepseek') => {
    setApiConfig(prev => ({ ...prev, provider, apiKey: prev?.provider === provider ? prev.apiKey : '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et configuration de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Menu */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Catégories</h2>
          <nav className="space-y-2">
            {[
              { icon: Key, label: 'API Configuration', active: true },
              { icon: Palette, label: 'Thème & Apparence', active: false },
              { icon: Globe, label: 'Langue & Région', active: false },
              { icon: Bell, label: 'Notifications', active: false }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* API Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Configuration API</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fournisseur d'IA
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleProviderChange('openai')}
                    className={`p-4 border rounded-lg text-left transition-all ${apiConfig.provider === 'openai' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}>
                    <div className="font-medium">OpenAI</div>
                    <div className="text-sm">GPT-4, GPT-3.5</div>
                  </button>
                  <button 
                    onClick={() => handleProviderChange('deepseek')}
                    className={`p-4 border rounded-lg text-left transition-all ${apiConfig.provider === 'deepseek' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}>
                    <div className="font-medium">DeepSeek</div>
                    <div className="text-sm">DeepSeek Chat, Coder</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé API {apiConfig.provider === 'openai' ? 'OpenAI' : 'DeepSeek'}
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiConfig.apiKey}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Collez votre clé API ici"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Votre clé API est stockée localement dans votre navigateur et n'est jamais envoyée à nos serveurs.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle par défaut (optionnel)
                </label>
                <select 
                  value={apiConfig.model}
                  onChange={(e) => setApiConfig(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {apiConfig.provider === 'openai' ? (
                    <>
                      <option value="gpt-4-turbo">gpt-4-turbo (recommandé)</option>
                      <option value="gpt-4">gpt-4</option>
                      <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    </>
                  ) : (
                    <>
                      <option value="deepseek-chat">deepseek-chat (recommandé)</option>
                      <option value="deepseek-coder">deepseek-coder</option>
                    </>
                  )}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Comment obtenir votre clé API ?</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  {apiConfig.provider === 'openai' ? (
                    <>
                      <p>1. Rendez-vous sur <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.openai.com/api-keys</a></p>
                      <p>2. Connectez-vous et cliquez sur "Create new secret key".</p>
                      <p>3. Copiez la clé et collez-la ci-dessus.</p>
                    </>
                  ) : (
                    <>
                      <p>1. Rendez-vous sur <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.deepseek.com/api_keys</a></p>
                      <p>2. Connectez-vous et cliquez sur "Create new API key".</p>
                      <p>3. Copiez la clé et collez-la ci-dessus.</p>
                    </>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Sauvegarder la configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
