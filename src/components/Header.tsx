import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JobMotivator</h1>
              <p className="text-sm text-gray-600">Générateur de lettres de motivation IA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Propulsé par l'IA</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
