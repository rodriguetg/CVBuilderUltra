import { UserProfile, CV, CVTemplate, CVSection } from '../types';
import ModernTemplate from '../components/templates/ModernTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import AtsFriendlyTemplate from '../components/templates/AtsFriendlyTemplate';

export const mockProfiles: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Alexandre Dubois (Full-Stack)',
    email: 'alex.dubois@email.com',
    phone: '06 12 34 56 78',
    address: '123 Rue de la République, 75001 Paris',
    summary: 'Développeur Full-Stack passionné avec 5 ans d\'expérience dans la création d\'applications web robustes et scalables. Expert en React, Node.js et TypeScript, je suis à la recherche de nouveaux défis pour mettre à profit mes compétences techniques et ma créativité.',
    experience: [
      {
        id: 'exp-1',
        title: 'Développeur Full-Stack Senior',
        company: 'Tech Solutions Inc.',
        location: 'Paris, France',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: 'Développement et maintenance d\'une plateforme SaaS pour la gestion de projets. Conception d\'API RESTful, optimisation des performances et mentorat de développeurs juniors.',
        achievements: ['Réduction de 50% du temps de chargement des pages.', 'Mise en place de l\'intégration continue (CI/CD).'],
        technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']
      },
      {
        id: 'exp-2',
        title: 'Développeur Frontend',
        company: 'Web Agency Creativ',
        location: 'Lyon, France',
        startDate: '2019-06',
        endDate: '2020-12',
        current: false,
        description: 'Création d\'interfaces utilisateur interactives et responsives pour divers clients.',
        achievements: ['Amélioration de 20% de l\'engagement utilisateur.'],
        technologies: ['React', 'JavaScript', 'Sass', 'Figma']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Master en Informatique',
        institution: 'Université Claude Bernard Lyon 1',
        location: 'Lyon, France',
        startDate: '2017-09',
        endDate: '2019-06',
        description: 'Spécialisation en développement logiciel et architecture web.'
      }
    ],
    skills: [
      { id: 'skill-1', name: 'React', level: 'expert', category: 'Frontend' },
      { id: 'skill-2', name: 'TypeScript', level: 'expert', category: 'Langages' },
      { id: 'skill-3', name: 'Node.js', level: 'advanced', category: 'Backend' },
      { id: 'skill-4', name: 'GraphQL', level: 'intermediate', category: 'Backend' },
      { id: 'skill-5', name: 'Figma', level: 'intermediate', category: 'Design' },
      { id: 'skill-6', name: 'Docker', level: 'advanced', category: 'DevOps' }
    ],
    languages: [
      { id: 'lang-1', name: 'Français', level: 'Natif' },
      { id: 'lang-2', name: 'Anglais', level: 'Courant (C1)' }
    ],
    certifications: [],
    projects: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user-2',
    name: 'Alexandre Dubois (Chef de Projet)',
    email: 'alex.dubois.pm@email.com',
    phone: '06 12 34 56 78',
    address: '123 Rue de la République, 75001 Paris',
    summary: 'Chef de projet technique expérimenté, spécialisé dans la méthodologie Agile et la livraison de produits logiciels de haute qualité. Excellent communicant, capable de faire le pont entre les équipes techniques et les parties prenantes métier.',
    experience: [
       {
        id: 'exp-3',
        title: 'Chef de Projet Technique',
        company: 'Innovatech',
        location: 'Paris, France',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: 'Pilotage de projets de développement d\'applications web et mobiles. Gestion des budgets, plannings et ressources. Animation des cérémonies Agile (Sprint Planning, Daily Stand-up, Retrospective).',
        achievements: ['Livraison de 3 projets majeurs dans les délais et budgets impartis.', 'Amélioration de 30% de la vélocité de l\'équipe.'],
        technologies: ['Jira', 'Confluence', 'Agile', 'Scrum']
      }
    ],
    education: [
      {
        id: 'edu-2',
        degree: 'Certification PMP',
        institution: 'Project Management Institute',
        location: 'En ligne',
        startDate: '2020-05',
        endDate: '2020-08',
        description: 'Certification en gestion de projet.'
      }
    ],
    skills: [
      { id: 'skill-7', name: 'Gestion de Projet', level: 'expert', category: 'Management' },
      { id: 'skill-8', name: 'Agile/Scrum', level: 'expert', category: 'Méthodologies' },
      { id: 'skill-9', name: 'Jira', level: 'advanced', category: 'Outils' },
      { id: 'skill-10', name: 'Gestion de budget', level: 'advanced', category: 'Management' }
    ],
    languages: [
      { id: 'lang-3', name: 'Français', level: 'Natif' },
      { id: 'lang-4', name: 'Anglais', level: 'Courant (C1)' }
    ],
    certifications: [],
    projects: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const defaultSections: CVSection[] = [
    { id: 'summary', title: 'Résumé' },
    { id: 'experience', title: 'Expérience Professionnelle' },
    { id: 'education', title: 'Formation' },
    { id: 'skills', title: 'Compétences' },
    { id: 'languages', title: 'Langues' }
];

export const mockCVs: CV[] = [
  {
    id: 'cv-1',
    profileId: 'user-1',
    name: 'CV Développeur Full-Stack',
    templateId: 'modern',
    targetJob: 'Développeur Full-Stack Senior',
    targetCompany: 'Google',
    content: mockProfiles[0],
    layout: {
      colors: { primary: '#2563EB', secondary: '#4F46E5', text: '#111827', background: '#FFFFFF' },
      fonts: { heading: 'Georgia, serif', body: 'Arial, sans-serif' }
    },
    sections: defaultSections,
    score: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
    exports: [],
    views: 12
  }
];

export const mockTemplates: CVTemplate[] = [
    { id: 'modern', name: 'Moderne', category: 'modern', preview: '', component: ModernTemplate },
    { id: 'classic', name: 'Classique', category: 'classic', preview: '', component: ClassicTemplate },
    { id: 'creative', name: 'Créatif', category: 'creative', preview: '', component: CreativeTemplate },
    { id: 'ats-friendly', name: 'ATS Optimisé', category: 'modern', preview: '', component: AtsFriendlyTemplate },
];
