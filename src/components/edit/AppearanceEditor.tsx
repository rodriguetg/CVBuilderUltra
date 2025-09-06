import React from 'react';
import { motion } from 'framer-motion';
import { useCVContext } from '../../context/CVContext';
import { CVLayout } from '../../types';
import { Palette, Type, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const AppearanceEditor: React.FC = () => {
    const { state, dispatch } = useCVContext();
    const { cvId } = useParams<{ cvId: string }>();
    const currentCV = state.cvs.find(cv => cv.id === cvId);
    const { templates } = state;

    if (!currentCV) return null;

    const handleTemplateChange = (templateId: string) => {
        dispatch({ type: 'UPDATE_CV', payload: { cvId: currentCV.id, updates: { templateId } } });
    };

    const handleLayoutChange = (newLayout: Partial<CVLayout>) => {
        dispatch({ type: 'UPDATE_CV', payload: { cvId: currentCV.id, updates: { layout: { ...currentCV.layout, ...newLayout } } } });
    };

    const handleColorChange = (colorName: keyof CVLayout['colors'], value: string) => {
        handleLayoutChange({ colors: { ...currentCV.layout.colors, [colorName]: value } });
    };

    const handleFontChange = (fontType: keyof CVLayout['fonts'], value: string) => {
        handleLayoutChange({ fonts: { ...currentCV.layout.fonts, [fontType]: value } });
    };

    const webSafeFonts = [
        'Arial, sans-serif',
        'Verdana, sans-serif',
        'Tahoma, sans-serif',
        'Trebuchet MS, sans-serif',
        'Times New Roman, serif',
        'Georgia, serif',
        'Garamond, serif',
        'Courier New, monospace',
        'Brush Script MT, cursive'
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
            <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <span>Templates</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {templates.map(template => (
                        <button 
                            key={template.id} 
                            onClick={() => handleTemplateChange(template.id)}
                            className={`relative p-1 border-2 rounded-lg ${currentCV.templateId === template.id ? 'border-blue-500' : 'border-transparent'}`}
                        >
                            <div className={`h-16 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500`}>{template.name}</div>
                            {currentCV.templateId === template.id && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <span>Couleurs</span>
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Primaire</label>
                        <input type="color" value={currentCV.layout.colors.primary} onChange={e => handleColorChange('primary', e.target.value)} className="w-8 h-8 p-0 border-none rounded-md" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Secondaire</label>
                        <input type="color" value={currentCV.layout.colors.secondary} onChange={e => handleColorChange('secondary', e.target.value)} className="w-8 h-8 p-0 border-none rounded-md" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Type className="w-5 h-5 text-green-500" />
                    <span>Polices</span>
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Titres</label>
                        <select value={currentCV.layout.fonts.heading} onChange={e => handleFontChange('heading', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                            {webSafeFonts.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Corps</label>
                        <select value={currentCV.layout.fonts.body} onChange={e => handleFontChange('body', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                            {webSafeFonts.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AppearanceEditor;
