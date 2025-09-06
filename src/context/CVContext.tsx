import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { UserProfile, CV, JobOffer, CVTemplate, AppSettings, CVSection, Experience, CoverLetter } from '../types';
import { mockProfiles, mockCVs, mockTemplates } from './mockData';

const LOCAL_STORAGE_KEY = 'cv-builder-data-v2';

interface CVState {
  profiles: UserProfile[];
  currentProfileId: string | null;
  cvs: CV[];
  jobOffers: JobOffer[];
  letters: CoverLetter[];
  templates: CVTemplate[];
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
}

type CVAction =
  | { type: 'INITIALIZE_DATA' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<CVState> }
  | { type: 'ADD_PROFILE'; payload: UserProfile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SET_CURRENT_PROFILE_ID'; payload: string }
  | { type: 'ADD_CV'; payload: CV }
  | { type: 'UPDATE_CV'; payload: { cvId: string; updates: Partial<CV> } }
  | { type: 'DELETE_CV'; payload: string }
  | { type: 'ADD_JOB_OFFER'; payload: JobOffer }
  | { type: 'DELETE_JOB_OFFER'; payload: string }
  | { type: 'ADD_LETTER'; payload: CoverLetter }
  | { type: 'DELETE_LETTER'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: CVTemplate[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'REORDER_SECTIONS'; payload: { cvId: string; sections: CVSection[] } }
  | { type: 'UPDATE_SUMMARY'; payload: { profileId: string; summary: string } }
  | { type: 'UPDATE_EXPERIENCE'; payload: { profileId: string; experienceId: string; updates: Partial<Experience> } };

const initialState: CVState = {
  profiles: [],
  currentProfileId: null,
  cvs: [],
  jobOffers: [],
  letters: [],
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
      return {
        ...state,
        isLoading: false,
        profiles: mockProfiles,
        currentProfileId: mockProfiles.length > 0 ? mockProfiles[0].id : null,
        templates: mockTemplates,
        cvs: mockCVs,
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        templates: mockTemplates,
      };

    case 'ADD_PROFILE':
      if (state.profiles.some(p => p.id === action.payload.id)) return state;
      return {
        ...state,
        profiles: [...state.profiles, action.payload],
        currentProfileId: action.payload.id,
      };

    case 'DELETE_PROFILE': {
        const profileIdToDelete = action.payload;
        const remainingProfiles = state.profiles.filter(p => p.id !== profileIdToDelete);
        const remainingCVs = state.cvs.filter(cv => cv.profileId !== profileIdToDelete);
        
        let newCurrentProfileId = state.currentProfileId;
        if (state.currentProfileId === profileIdToDelete) {
            newCurrentProfileId = remainingProfiles.length > 0 ? remainingProfiles[0].id : null;
        }

        return {
            ...state,
            profiles: remainingProfiles,
            cvs: remainingCVs,
            currentProfileId: newCurrentProfileId
        };
    }

    case 'SET_CURRENT_PROFILE_ID':
      return { ...state, currentProfileId: action.payload };

    case 'ADD_CV':
      if (state.cvs.some(cv => cv.id === action.payload.id)) return state;
      return { ...state, cvs: [action.payload, ...state.cvs] };

    case 'UPDATE_CV':
      return {
        ...state,
        cvs: state.cvs.map(cv =>
          cv.id === action.payload.cvId
            ? { ...cv, ...action.payload.updates, updatedAt: new Date() }
            : cv
        ),
      };

    case 'DELETE_CV':
      return {
        ...state,
        cvs: state.cvs.filter(cv => cv.id !== action.payload),
      };

    case 'ADD_JOB_OFFER':
      return { ...state, jobOffers: [action.payload, ...state.jobOffers] };

    case 'DELETE_JOB_OFFER':
      return { ...state, jobOffers: state.jobOffers.filter(job => job.id !== action.payload) };

    case 'ADD_LETTER':
      return { ...state, letters: [action.payload, ...state.letters] };

    case 'DELETE_LETTER':
      return { ...state, letters: state.letters.filter(letter => letter.id !== action.payload) };

    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      localStorage.setItem('cv-builder-settings', JSON.stringify(newSettings));
      return { ...state, settings: newSettings };

    case 'REORDER_SECTIONS': {
      return {
        ...state,
        cvs: state.cvs.map(cv =>
          cv.id === action.payload.cvId ? { ...cv, sections: action.payload.sections } : cv
        ),
      };
    }

    case 'UPDATE_SUMMARY': {
      const { profileId, summary } = action.payload;
      return {
        ...state,
        profiles: state.profiles.map(p =>
          p.id === profileId ? { ...p, summary } : p
        ),
        cvs: state.cvs.map(cv =>
          cv.profileId === profileId ? { ...cv, content: { ...cv.content, summary } } : cv
        ),
      };
    }
      
    case 'UPDATE_EXPERIENCE': {
      const { profileId, experienceId, updates } = action.payload;
      return {
        ...state,
        profiles: state.profiles.map(p =>
          p.id === profileId
            ? {
                ...p,
                experience: p.experience.map(exp =>
                  exp.id === experienceId ? { ...exp, ...updates } : exp
                ),
              }
            : p
        ),
        cvs: state.cvs.map(cv =>
          cv.profileId === profileId
            ? {
                ...cv,
                content: {
                  ...cv.content,
                  experience: cv.content.experience.map(exp =>
                    exp.id === experienceId ? { ...exp, ...updates } : exp
                  ),
                },
              }
            : cv
        ),
      };
    }

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

  useEffect(() => {
    try {
      const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDataJSON) {
        const savedData = JSON.parse(savedDataJSON);
        if (savedData.letters) {
          savedData.letters = savedData.letters.map((l: CoverLetter) => ({...l, createdAt: new Date(l.createdAt)}));
        }
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedData });
      } else {
        dispatch({ type: 'INITIALIZE_DATA' });
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      dispatch({ type: 'INITIALIZE_DATA' });
    }

    const savedSettings = localStorage.getItem('cv-builder-settings');
    if (savedSettings) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      const dataToSave = {
        profiles: state.profiles,
        currentProfileId: state.currentProfileId,
        cvs: state.cvs,
        jobOffers: state.jobOffers,
        letters: state.letters,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [state.profiles, state.currentProfileId, state.cvs, state.jobOffers, state.letters, state.isLoading]);

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
  const { state, dispatch } = context;
  const currentProfile = state.profiles.find(p => p.id === state.currentProfileId) || null;
  const currentCVs = state.cvs.filter(cv => cv.profileId === state.currentProfileId);

  return { state, dispatch, currentProfile, currentCVs };
};
