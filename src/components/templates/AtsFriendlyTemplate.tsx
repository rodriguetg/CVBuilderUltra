import React from 'react';
import { CVPreviewProps, CVSectionType } from '../../types';
import { Mail, Phone, MapPin, Bot } from 'lucide-react';
import SortableSection from '../edit/SortableSection';

const SuggestionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-1 -right-7 p-1 bg-blue-100 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-200"
        title="Suggérer une réécriture IA"
    >
        <Bot className="w-4 h-4" />
    </button>
);

const AtsFriendlyTemplate: React.FC<CVPreviewProps> = ({ cv, onSuggestRewrite }) => {
    const { content, layout, sections } = cv;
    const fontStyle = { fontFamily: "'Arial', sans-serif" }; // Force a standard font

    const renderSection = (type: CVSectionType) => {
        const headingStyle = { color: layout.colors.primary, fontFamily: "'Arial', sans-serif" };
        
        switch (type) {
            case 'summary':
                return (
                    <div className="relative group">
                        <h2 style={headingStyle} className="text-base font-bold uppercase tracking-widest mb-2">Résumé</h2>
                        <p className="text-sm text-gray-700 leading-normal">{content.summary}</p>
                        <SuggestionButton onClick={() => onSuggestRewrite('summary', null, content.summary)} />
                    </div>
                );
            case 'experience':
                return (
                    <div>
                        <h2 style={headingStyle} className="text-base font-bold uppercase tracking-widest mb-2">Expérience Professionnelle</h2>
                        {content.experience.map(exp => (
                            <div key={exp.id} className="mb-4 relative group">
                                <h3 className="font-bold text-md text-gray-900">{exp.title}</h3>
                                <p className="text-sm text-gray-700 font-semibold">{exp.company} | {exp.location}</p>
                                <p className="text-xs text-gray-500 uppercase">{exp.startDate} - {exp.current ? 'Aujourd\'hui' : exp.endDate}</p>
                                <p className="mt-1 text-sm text-gray-700 leading-normal">{exp.description}</p>
                                <SuggestionButton onClick={() => onSuggestRewrite('experience', exp.id, exp.description)} />
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                 return (
                    <div>
                        <h2 style={headingStyle} className="text-base font-bold uppercase tracking-widest mb-2">Formation</h2>
                        {content.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-bold text-md text-gray-900">{edu.degree}</h3>
                                <p className="text-sm text-gray-700 font-semibold">{edu.institution}</p>
                                <p className="text-xs text-gray-500 uppercase">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return (
                    <div>
                        <h2 style={headingStyle} className="text-base font-bold uppercase tracking-widest mb-2">Compétences</h2>
                        <p className="text-sm text-gray-700 leading-normal">
                            {content.skills.map(skill => skill.name).join(', ')}
                        </p>
                    </div>
                );
             case 'languages':
                return (
                    <div>
                        <h2 style={headingStyle} className="text-base font-bold uppercase tracking-widest mb-2">Langues</h2>
                        {content.languages.map(lang => (
                            <p key={lang.id} className="text-sm text-gray-700">{lang.name}: <span className="font-semibold">{lang.level}</span></p>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8 bg-white" style={fontStyle}>
            {/* Header */}
            <header className="text-left mb-6">
                <h1 className="text-3xl font-bold" style={{ color: layout.colors.text }}>{content.name}</h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 border-t pt-2 mt-2">
                    <span>{content.email}</span>
                    <span>{content.phone}</span>
                    <span>{content.address}</span>
                </div>
            </header>

            {/* Body */}
            <div className="space-y-4">
                {sections.map(section => (
                    <SortableSection key={section.id} id={section.id}>
                        {renderSection(section.id)}
                    </SortableSection>
                ))}
            </div>
        </div>
    );
};

export default AtsFriendlyTemplate;
