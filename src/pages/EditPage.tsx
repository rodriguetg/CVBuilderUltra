import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCVContext } from '../context/CVContext';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import { FileText, Target, Download, Save, Bot, ShieldCheck } from 'lucide-react';

import CVPreview from '../components/edit/CVPreview';
import JobMatchModal from '../components/edit/JobMatchModal';
import AISuggestionModal from '../components/edit/AISuggestionModal';
import AppearanceEditor from '../components/edit/AppearanceEditor';
import { exportToPDF, exportToDocx } from '../services/exportService';
import { CVSectionType } from '../types';
import AtsCheckModal from '../components/edit/AtsCheckModal';

type SuggestionModalState = {
  isOpen: boolean;
  sectionType: CVSectionType | null;
  itemId: string | null;
  currentText: string;
};

const EditPage: React.FC = () => {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch, currentProfile, currentCVs } = useCVContext();
  
  const [currentCV, setCurrentCV] = useState(() => state.cvs.find(cv => cv.id === cvId) || null);
  const [isMatchModalOpen, setMatchModalOpen] = useState(false);
  const [isAtsModalOpen, setAtsModalOpen] = useState(false);
  const [suggestionModalState, setSuggestionModalState] = useState<SuggestionModalState>({
    isOpen: false,
    sectionType: null,
    itemId: null,
    currentText: '',
  });

  const cvPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cvId) {
      const cvToEdit = state.cvs.find(cv => cv.id === cvId);
      setCurrentCV(cvToEdit || null);
      if (!cvToEdit) {
        navigate('/edit');
      }
    } else if (currentCVs.length > 0) {
      navigate(`/edit/${currentCVs[0].id}`);
    }
  }, [cvId, state.cvs, currentCVs, navigate]);
  
  useEffect(() => {
    if (currentProfile && currentCV && currentCV.profileId !== currentProfile.id) {
      const cvForNewProfile = state.cvs.find(cv => cv.profileId === currentProfile.id);
      if (cvForNewProfile) {
        navigate(`/edit/${cvForNewProfile.id}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentProfile, currentCV, state.cvs, navigate]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (currentCV && active.id !== over?.id) {
      const oldIndex = currentCV.sections.findIndex((section) => section.id === active.id);
      const newIndex = currentCV.sections.findIndex((section) => section.id === over!.id);
      const newSections = arrayMove(currentCV.sections, oldIndex, newIndex);
      dispatch({ type: 'UPDATE_CV', payload: { cvId: currentCV.id, updates: { sections: newSections } } });
    }
  };

  const handleOpenSuggestionModal = (sectionType: CVSectionType, itemId: string | null, currentText: string) => {
    setSuggestionModalState({ isOpen: true, sectionType, itemId, currentText });
  };

  const handleApplySuggestion = (newText: string) => {
    const { sectionType, itemId } = suggestionModalState;
    if (!currentProfile || !currentCV) return;

    if (sectionType === 'summary') {
      dispatch({ type: 'UPDATE_SUMMARY', payload: { profileId: currentProfile.id, summary: newText } });
    } else if (sectionType === 'experience' && itemId) {
      dispatch({ type: 'UPDATE_EXPERIENCE', payload: { profileId: currentProfile.id, experienceId: itemId, updates: { description: newText } } });
    }
    setSuggestionModalState({ isOpen: false, sectionType: null, itemId: null, currentText: '' });
  };

  const handleExportPDF = () => {
    if (cvPreviewRef.current) {
      exportToPDF('cv-preview-area', currentCV?.name || 'cv');
    }
  };

  const handleExportDocx = () => {
    if (currentCV) {
      exportToDocx(currentCV, currentCV.name || 'cv');
    }
  };

  if (!currentProfile || !currentCV) {
    if (currentCVs.length > 0) {
        return <div>Chargement du CV...</div>;
    }
    return (
        <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Aucun CV trouvé pour ce profil</h2>
            <p className="text-gray-600 mb-6">Pour commencer, veuillez créer un nouveau CV pour ce profil.</p>
            <Link to="/import" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              Créer un nouveau CV
            </Link>
        </div>
    );
  }
  
  const cvWithLatestProfile = {
      ...currentCV,
      content: currentProfile
  }

  return (
    <div className="space-y-8">
      <JobMatchModal isOpen={isMatchModalOpen} onClose={() => setMatchModalOpen(false)} />
      <AtsCheckModal isOpen={isAtsModalOpen} onClose={() => setAtsModalOpen(false)} />
      <AISuggestionModal 
        isOpen={suggestionModalState.isOpen}
        onClose={() => setSuggestionModalState({ ...suggestionModalState, isOpen: false })}
        onApply={handleApplySuggestion}
        sectionType={suggestionModalState.sectionType}
        itemId={suggestionModalState.itemId}
        currentText={suggestionModalState.currentText}
      />
      
      <div className="flex items-center justify-between">
        <input 
            type="text" 
            value={currentCV.name}
            onChange={(e) => dispatch({ type: 'UPDATE_CV', payload: { cvId: currentCV.id, updates: { name: e.target.value } } })}
            className="text-3xl font-bold text-gray-900 bg-transparent focus:outline-none focus:bg-gray-100 rounded-lg p-1 -m-1"
        />
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50">
            <Save className="w-4 h-4" />
            <span>Sauvegardé</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Exporter PDF</span>
          </button>
           <button 
            onClick={handleExportDocx}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>Exporter DOCX</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6 sticky top-8">
          <AppearanceEditor />
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2"><Target className="w-5 h-5 text-orange-500" /><span>Optimisation IA</span></h3>
            <div className="space-y-2">
              <button 
                onClick={() => setMatchModalOpen(true)}
                className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center space-x-2 border"
              >
                <Bot className="w-4 h-4" />
                <span>Analyser une offre</span>
              </button>
              <button 
                onClick={() => setAtsModalOpen(true)}
                className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center space-x-2 border"
              >
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Vérificateur ATS</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Editor Canvas */}
        <main className="lg:col-span-9">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={currentCV.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div id="cv-preview-area" ref={cvPreviewRef} className="w-full transform scale-[0.9] origin-top">
                <CVPreview cv={cvWithLatestProfile} onSuggestRewrite={handleOpenSuggestionModal} />
              </div>
            </SortableContext>
          </DndContext>
        </main>
      </div>
    </div>
  );
};

export default EditPage;
