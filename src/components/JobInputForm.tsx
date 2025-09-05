import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { JobOffer } from '../types';

interface JobInputFormProps {
  onComplete: (jobOffer: JobOffer) => void;
}

const JobInputForm: React.FC<JobInputFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    type: '',
    salary: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      alert('Veuillez remplir au minimum le titre, l\'entreprise et la description du poste.');
      return;
    }
    onComplete(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
          Informations sur l'offre d'emploi
        </h2>
        <p className="text-gray-600">
          Copiez-collez les détails de l'offre d'emploi LinkedIn que vous souhaitez cibler.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Titre du poste *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ex: Développeur Frontend React"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Entreprise *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="ex: Google France"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Localisation
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="ex: Paris, France"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Type de contrat
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="ex: CDI, CDD, Stage"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Salaire (optionnel)
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="ex: 45-55k€"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du poste *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Collez ici la description complète du poste..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences requises *
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={4}
            placeholder="Listez les compétences, qualifications et exigences mentionnées..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Continuer vers le profil</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};

export default JobInputForm;
