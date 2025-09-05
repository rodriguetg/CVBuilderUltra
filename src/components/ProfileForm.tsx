import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, Briefcase, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: '',
    summary: '',
    achievements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.experience || !formData.skills) {
      alert('Veuillez remplir les champs obligatoires.');
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
          Votre profil professionnel
        </h2>
        <p className="text-gray-600">
          Renseignez vos informations pour personnaliser la lettre de motivation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: Marie Dupont"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="marie.dupont@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Formation et éducation *
          </label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows={3}
            placeholder="ex: Master en Informatique - École Supérieure d'Informatique Paris (2022)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Expérience professionnelle *
          </label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows={4}
            placeholder="Décrivez vos expériences professionnelles pertinentes..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-2" />
            Compétences clés *
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={3}
            placeholder="ex: React, TypeScript, Node.js, Python, Git, Agile..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Résumé professionnel
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            placeholder="Décrivez brièvement votre profil et vos objectifs professionnels..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Réalisations et distinctions
          </label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            rows={3}
            placeholder="Mentionnez vos principales réalisations, prix, projets marquants..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
            <span>Continuer vers l'API</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileForm;
