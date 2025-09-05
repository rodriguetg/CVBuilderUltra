import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Trash2, Eye, Calendar, Building2 } from 'lucide-react';
import { CoverLetter } from '../types';

interface SavedLettersProps {
  letters: CoverLetter[];
  onDeleteLetter: (id: string) => void;
}

const SavedLetters: React.FC<SavedLettersProps> = ({ letters, onDeleteLetter }) => {
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Lettre copiée dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette lettre ?')) {
      onDeleteLetter(id);
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Lettres sauvegardées ({letters.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Letters List */}
        <div className="space-y-3">
          <AnimatePresence>
            {letters.map((letter) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedLetter?.id === letter.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {letter.jobTitle}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3" />
                        <span>{letter.company}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(letter.createdAt)}</span>
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {letter.tone}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {letter.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLetter(letter);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(letter.content);
                      }}
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Copier"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(letter.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {letters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune lettre sauvegardée pour le moment.</p>
            </div>
          )}
        </div>

        {/* Letter Preview */}
        <div className="lg:sticky lg:top-6">
          {selectedLetter ? (
            <motion.div
              key={selectedLetter.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedLetter.jobTitle}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedLetter.company}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(selectedLetter.content)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Copier"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                  {selectedLetter.content}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 text-center text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Sélectionnez une lettre pour la prévisualiser</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedLetters;
