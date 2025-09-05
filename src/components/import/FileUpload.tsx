import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FileUploadProps {
  onBack: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onBack }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadedFile(file);

    try {
      // Simulate file processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simulate successful parsing
      setTimeout(() => {
        setUploading(false);
        // Navigate to dashboard with success message
        navigate('/dashboard?import=success');
      }, 1000);

    } catch (err) {
      setError('Erreur lors du traitement du fichier. Veuillez réessayer.');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

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
        {!uploading ? (
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
              <p className="text-lg text-blue-600 font-medium">
                Déposez le fichier ici...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Glissez-déposez votre CV ici
                </p>
                <p className="text-gray-600 mb-4">
                  ou cliquez pour sélectionner un fichier
                </p>
                <p className="text-sm text-gray-500">
                  Formats supportés: PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Traitement en cours...
              </h3>
              <p className="text-gray-600">
                Notre IA analyse votre CV et extrait les informations
              </p>
            </div>

            {uploadedFile && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{uploadedFile.name}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complété</p>
              </div>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800">{error}</span>
          </motion.div>
        )}
      </div>

      {/* Processing Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">🤖 Ce que notre IA fait pour vous :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Extraction automatique des informations</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Structuration des données</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Détection des compétences</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Optimisation du contenu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
