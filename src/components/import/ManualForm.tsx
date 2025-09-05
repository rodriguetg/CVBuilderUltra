import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Briefcase, GraduationCap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCVContext } from '../../context/CVContext';
import { UserProfile } from '../../types';

interface ManualFormProps {
  onBack: () => void;
}

const ManualForm: React.FC<ManualFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { dispatch } = useCVContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    
    // Experience
    experiences: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    }],
    
    // Education
    education: [{
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }],
    
    // Skills
    skills: [''],
    languages: [{ name: '', level: '' }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    }]
  });

  const handleInputChange = (field: string, value: any, index?: number, subField?: string) => {
    setFormData(prev => {
      if (index !== undefined && subField) {
        const arrayField = prev[field as keyof typeof prev] as any[];
        const newArray = [...arrayField];
        newArray[index] = { ...newArray[index], [subField]: value };
        return { ...prev, [field]: newArray };
      } else if (index !== undefined) {
        const arrayField = prev[field as keyof typeof prev] as any[];
        const newArray = [...arrayField];
        newArray[index] = value;
        return { ...prev, [field]: newArray };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), defaultItem]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Create UserProfile object
    const profile: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      summary: formData.summary,
      experience: formData.experiences.map((exp, index) => ({
        id: `exp-${index}`,
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description,
        achievements: exp.achievements.filter(a => a.trim()),
        technologies: []
      })),
      education: formData.education.map((edu, index) => ({
        id: `edu-${index}`,
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        description: edu.description
      })),
      skills: formData.skills.filter(s => s.trim()).map((skill, index) => ({
        id: `skill-${index}`,
        name: skill,
        level: 'intermediate' as const,
        category: 'Technical'
      })),
      languages: formData.languages.filter(l => l.name.trim()).map((lang, index) => ({
        id: `lang-${index}`,
        name: lang.name,
        level: lang.level
      })),
      certifications: formData.certifications.filter(c => c.name.trim()).map((cert, index) => ({
        id: `cert-${index}`,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        expiryDate: cert.expiryDate,
        credentialId: cert.credentialId
      })),
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'SET_PROFILE', payload: profile });
    navigate('/dashboard?import=manual');
  };

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Expérience professionnelle', icon: Briefcase },
    { id: 3, title: 'Formation', icon: GraduationCap },
    { id: 4, title: 'Compétences', icon: Star }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Résumé professionnel
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez brièvement votre profil professionnel..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Expérience {index + 1}</h4>
                  {formData.experiences.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('experiences', index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Titre du poste"
                    value={exp.title}
                    onChange={(e) => handleInputChange('experiences', e.target.value, index, 'title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Entreprise"
                    value={exp.company}
                    onChange={(e) => handleInputChange('experiences', e.target.value, index, 'company')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Lieu"
                    value={exp.location}
                    onChange={(e) => handleInputChange('experiences', e.target.value, index, 'location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="month"
                      placeholder="Date de début"
                      value={exp.startDate}
                      onChange={(e) => handleInputChange('experiences', e.target.value, index, 'startDate')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="month"
                      placeholder="Date de fin"
                      value={exp.endDate}
                      onChange={(e) => handleInputChange('experiences', e.target.value, index, 'endDate')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={exp.current}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleInputChange('experiences', e.target.checked, index, 'current')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Poste actuel</span>
                  </label>
                </div>
                
                <textarea
                  placeholder="Description du poste et responsabilités"
                  value={exp.description}
                  onChange={(e) => handleInputChange('experiences', e.target.value, index, 'description')}
                  rows={3}
                  className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('experiences', {
                title: '', company: '', location: '', startDate: '', endDate: '', 
                current: false, description: '', achievements: ['']
              })}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + Ajouter une expérience
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Formation {index + 1}</h4>
                  {formData.education.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('education', index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Diplôme/Formation"
                    value={edu.degree}
                    onChange={(e) => handleInputChange('education', e.target.value, index, 'degree')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="École/Université"
                    value={edu.institution}
                    onChange={(e) => handleInputChange('education', e.target.value, index, 'institution')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Lieu"
                    value={edu.location}
                    onChange={(e) => handleInputChange('education', e.target.value, index, 'location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="month"
                      placeholder="Date de début"
                      value={edu.startDate}
                      onChange={(e) => handleInputChange('education', e.target.value, index, 'startDate')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="month"
                      placeholder="Date de fin"
                      value={edu.endDate}
                      onChange={(e) => handleInputChange('education', e.target.value, index, 'endDate')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('education', {
                degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '', description: ''
              })}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + Ajouter une formation
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences techniques
              </label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Compétence"
                    value={skill}
                    onChange={(e) => handleInputChange('skills', e.target.value, index)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('skills', index)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('skills', '')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Ajouter une compétence
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langues
              </label>
              {formData.languages.map((lang, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Langue"
                    value={lang.name}
                    onChange={(e) => handleInputChange('languages', e.target.value, index, 'name')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={lang.level}
                    onChange={(e) => handleInputChange('languages', e.target.value, index, 'level')}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Niveau</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Courant">Courant</option>
                    <option value="Natif">Natif</option>
                  </select>
                  {formData.languages.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('languages', index)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('languages', { name: '', level: '' })}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Ajouter une langue
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Création manuelle de profil</h2>
          <p className="text-gray-600">Remplissez vos informations étape par étape</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h3>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <span>Créer le profil</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualForm;
