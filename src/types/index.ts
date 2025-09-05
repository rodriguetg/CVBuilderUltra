export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate?: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  category: 'classic' | 'modern' | 'creative' | 'minimal';
  preview: string;
  component: React.FC<CVPreviewProps>;
}

export interface CVLayout {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export type CVSectionType = 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects';

export interface CVSection {
  id: CVSectionType;
  title: string;
}

export interface CV {
  id: string;
  profileId: string;
  name: string;
  templateId: string;
  targetJob?: string;
  targetCompany?: string;
  content: UserProfile;
  layout: CVLayout;
  sections: CVSection[];
  score?: number;
  createdAt: Date;
  updatedAt: Date;
  exports: CVExport[];
  views: number;
}

export interface CVPreviewProps {
  cv: CV;
  onSuggestRewrite: (sectionType: CVSectionType, itemId: string | null, currentText: string) => void;
}

export interface CVExport {
  id: string;
  format: 'pdf' | 'docx' | 'link';
  url: string;
  createdAt: Date;
  views: number;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
  location?: string;
  salary?: string;
  type?: string;
  source: 'upload' | 'url' | 'manual';
  createdAt: Date;
}

export interface MatchingResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: MatchingSuggestion[];
}

export interface MatchingSuggestion {
  type: 'reorder' | 'highlight' | 'add' | 'modify';
  section: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface APIConfig {
  provider: 'openai' | 'deepseek';
  apiKey: string;
  model?: string;
}

export interface AppSettings {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  apiConfig?: APIConfig;
  autoSave: boolean;
  defaultTemplate: string;
}
