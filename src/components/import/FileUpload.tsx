import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronLeft, Loader2, Bot } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCVContext } from '../../context/CVContext';
import { parseCVFile } from '../../services/importService';
import { parseCvTextToProfile } from '../../services/aiGenerator';
import { UserProfile } from '../../types';

interface FileUploadProps {
  onBack: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onBack }) => {
  const [status, setStatus] = useState<'idle' | 'reading' | 'analyzing' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state, dispatch } = useCVContext();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploadedFile(file);
    setStatus('reading');

    try {
      const cvText = await parseCVFile(file);
      
      setStatus('analyzing');

      if (!state.settings.apiConfig?.apiKey) {
        setError("Veuillez configurer votre clé API dans les paramètres avant d'importer un CV.");
        setStatus('error');
        return;
      }

      const partialProfile = await parseCvTextToProfile(cvText, state.settings.apiConfig);

      // Combine with existing data or create new, ensuring all fields are present
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: '',
        email: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...partialProfile,
      };

      dispatch({ type: 'SET_PROFILE', payload: newProfile });
      
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard?import=success');
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du traitement du fichier.';
      setError(errorMessage);
      setStatus('error');
    }
  }, [navigate, dispatch, state.settings.apiConfig]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: status !== 'idle' && status !== 'error'
  });

  const renderStatus = () => {
    switch (status) {
      case 'reading':
        return <><Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin mb-4" /><h3 className="text-lg font-medium text-gray-900">Lecture du fichier...</h3></>;
      case 'analyzing':
        return <><Bot className="w-16 h-16 text-blue-600 mx-auto animate-pulse mb-4" /><h3 className="text-lg font-medium text-gray-900">Analyse par l'IA...</h3><p className="text-gray-600">Extraction et structuration des données.</p></>;
      case 'success':
        return <><CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">Import réussi !</h3><p className="text-gray-600">Redirection vers le dashboard...</p></>;
      default:
        return (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            
            {isDragActive ? (
              <p className="text-lg text-blue-600 font-medium">Déposez le fichier ici...</p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Glissez-déposez votre CV ici</p>
                <p className="text-gray-600 mb-4">ou cliquez pour sélectionner un fichier</p>
                <p className="text-sm text-gray-500">Formats supportés: PDF, DOCX, DOC (max 10MB)</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload de votre CV</h2>
          <p className="text-gray-600">Glissez-déposez votre fichier ou cliquez pour sélectionner</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {status === 'idle' || status === 'error' ? renderStatus() : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            {renderStatus()}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800 text-sm">{error}</span>
            {error.includes('clé API') && (
              <Link to="/settings" className="text-sm text-blue-700 underline ml-auto">
                Configurer l'API
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
