import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { useCVContext } from '../../context/CVContext';
import { checkCvForAts } from '../../services/atsCheckerService';
import { AtsCheckResult, AtsRecommendation } from '../../types';

interface AtsCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AtsCheckModal: React.FC<AtsCheckModalProps> = ({ isOpen, onClose }) => {
  const { state } = useCVContext();
  const [result, setResult] = useState<AtsCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && state.currentCV) {
      setIsLoading(true);
      // Simulate a short delay for better UX
      setTimeout(() => {
        const checkResult = checkCvForAts(state.currentCV!);
        setResult(checkResult);
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, state.currentCV]);

  if (!isOpen) return null;

  const getSeverityIcon = (severity: AtsRecommendation['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          <header className="p-6 border-b bg-white flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <span>Vérificateur de compatibilité ATS</span>
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </header>

          <main className="p-6 overflow-y-auto flex-grow">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-700">Analyse de votre CV en cours...</p>
              </div>
            )}
            {!isLoading && result && (
              <div className="space-y-6">
                <div className="text-center bg-white p-6 rounded-lg border">
                  <p className="text-sm text-gray-600 uppercase tracking-wider">Score de compatibilité ATS</p>
                  <div className={`text-7xl font-bold my-2 ${getScoreColor(result.score)}`}>
                    {result.score}
                    <span className="text-4xl">%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${getScoreColor(result.score).replace('text-', 'bg-')}`} style={{ width: `${result.score}%` }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.recommendations.map(rec => (
                    <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getSeverityIcon(rec.severity)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          <footer className="p-4 border-t bg-white flex justify-end space-x-3">
            <button onClick={onClose} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">
              Fermer
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AtsCheckModal;
