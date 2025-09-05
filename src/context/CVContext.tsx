import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { UserProfile, CV, JobOffer, CVTemplate, AppSettings, CVSection, Experience } from '../types';
import { mockProfile, mockCVs, mockTemplates } from './mockData';

const LOCAL_STORAGE_KEY = 'cv-builder-data';

interface CVState {
  currentProfile: UserProfile | null;
  cvs: CV[];
  currentCV: CV | null;
  jobOffers: JobOffer[];
  templates: CVTemplate[];
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
}

type CVAction =
  | { type: 'INITIALIZE_DATA' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<CVState> }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'ADD_CV'; payload: CV }
  | { type: 'UPDATE_CV'; payload: Partial<CV> }
  | { type: 'DELETE_CV'; payload: string }
  | { type: 'SET_CURRENT_CV'; payload: CV | null }
  | { type: 'ADD_JOB_OFFER'; payload: JobOffer }
  | { type: 'DELETE_JOB_OFFER'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: CVTemplate[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'REORDER_SECTIONS'; payload: { cvId: string; sections: CVSection[] } }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; updates: Partial<Experience> } };

const initialState: CVState = {
  currentProfile: null,
  cvs: [],
  currentCV: null,
  jobOffers: [],
  templates: mockTemplates,
  settings: {
    language: 'fr',
    theme: 'light',
    autoSave: true,
    defaultTemplate: 'modern'
  },
  isLoading: true,
  error: null
};

const CVContext = createContext<{
  state: CVState;
  dispatch: React.Dispatch<CVAction>;
} | null>(null);

function cvReducer(state: CVState, action: CVAction): CVState {
  switch (action.type) {
    case 'INITIALIZE_DATA':
      const cvsWithTemplates = mockCVs.map(cv => ({
        ...cv,
        templateId: cv.templateId || 'modern'
      }));
      return {
        ...state,
        isLoading: false,
        currentProfile: mockProfile,
        templates: mockTemplates,
        cvs: cvsWithTemplates,
        currentCV: cvsWithTemplates.length > 0 ? cvsWithTemplates[0] : null,
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        templates: mockTemplates, // Always load fresh templates
      };

    case 'SET_PROFILE':
      return { ...state, currentProfile: action.payload };
    
    case 'ADD_CV':
      if (state.cvs.some(cv => cv.id === action.payload.id)) {
        return state;
      }
      return { 
        ...state, 
        cvs: [action.payload, ...state.cvs],
        currentCV: action.payload 
      };
    
    case 'UPDATE_CV':
      const updatedCVs = state.cvs.map(cv => 
        cv.id === state.currentCV?.id ? { ...cv, ...action.payload, updatedAt: new Date() } : cv
      );
      return {
        ...state,
        cvs: updatedCVs,
        currentCV: state.currentCV ? { ...state.currentCV, ...action.payload, updatedAt: new Date() } : null
      };
    
    case 'DELETE_CV':
      return {
        ...state,
        cvs: state.cvs.filter(cv => cv.id !== action.payload),
        currentCV: state.currentCV?.id === action.payload ? null : state.currentCV
      };
    
    case 'SET_CURRENT_CV':
      return { ...state, currentCV: action.payload };
    
    case 'ADD_JOB_OFFER':
      return { ...state, jobOffers: [action.payload, ...state.jobOffers] };
    
    case 'DELETE_JOB_OFFER':
      return {
        ...state,
        jobOffers: state.jobOffers.filter(job => job.id !== action.payload)
      };
    
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      localStorage.setItem('cv-builder-settings', JSON.stringify(newSettings));
      return { 
        ...state, 
        settings: newSettings
      };
    
    case 'REORDER_SECTIONS':
      if (!state.currentCV) return state;
      const reorderedCVs = state.cvs.map(cv =>
        cv.id === action.payload.cvId
          ? { ...cv, sections: action.payload.sections }
          : cv
      );
      return {
        ...state,
        cvs: reorderedCVs,
        currentCV: { ...state.currentCV, sections: action.payload.sections }
      };

    case 'UPDATE_SUMMARY':
      if (!state.currentCV || !state.currentProfile) return state;
       const updatedProfileSummary = { ...state.currentProfile, summary: action.payload };
       const updatedCVContentSummary = { ...state.currentCV, content: { ...state.currentCV.content, summary: action.payload } };
      return {
        ...state,
        currentProfile: updatedProfileSummary,
        currentCV: updatedCVContentSummary,
        cvs: state.cvs.map(cv => cv.id === state.currentCV?.id ? updatedCVContentSummary : cv)
      };

    case 'UPDATE_EXPERIENCE':
      if (!state.currentCV || !state.currentProfile) return state;
      const updatedExperience = state.currentProfile.experience.map(exp => 
              exp.id === action.payload.id ? { ...exp, ...action.payload.updates } : exp
            );
      const updatedProfileExp = { ...state.currentProfile, experience: updatedExperience };
      const updatedCVContentExp = { ...state.currentCV, content: { ...state.currentCV.content, experience: updatedExperience } };
      return {
        ...state,
        currentProfile: updatedProfileExp,
        currentCV: updatedCVContentExp,
        cvs: state.cvs.map(cv => cv.id === state.currentCV?.id ? updatedCVContentExp : cv)
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDataJSON) {
        const savedData = JSON.parse(savedDataJSON);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedData });
      } else {
        dispatch({ type: 'INITIALIZE_DATA' });
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      dispatch({ type: 'INITIALIZE_DATA' });
    }

    // Load settings separately
    const savedSettings = localStorage.getItem('cv-builder-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      if (parsedSettings.apiConfig && !parsedSettings.apiConfig.provider) {
        parsedSettings.apiConfig.provider = 'openai';
      }
      dispatch({ type: 'UPDATE_SETTINGS', payload: parsedSettings });
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      const dataToSave = {
        currentProfile: state.currentProfile,
        cvs: state.cvs,
        currentCV: state.currentCV,
        jobOffers: state.jobOffers,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [state.currentProfile, state.cvs, state.currentCV, state.jobOffers, state.isLoading]);

  return (
    <CVContext.Provider value={{ state, dispatch }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};
