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

const ModernTemplate: React.FC<CVPreviewProps> = ({ cv, onSuggestRewrite }) => {
    const { content, layout, sections } = cv;

    const renderSection = (type: CVSectionType) => {
        switch (type) {
            case 'summary':
                return (
                    <div className="relative group">
                        <h2 style={{ color: layout.colors.primary }} className="text-lg font-bold border-b-2 pb-1 mb-3" >RÉSUMÉ</h2>
                        <p className="text-sm text-gray-700">{content.summary}</p>
                        <SuggestionButton onClick={() => onSuggestRewrite('summary', null, content.summary)} />
                    </div>
                );
            case 'experience':
                return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-lg font-bold border-b-2 pb-1 mb-3">EXPÉRIENCE PROFESSIONNELLE</h2>
                        {content.experience.map(exp => (
                            <div key={exp.id} className="mb-4 relative group">
                                <h3 className="font-bold text-md text-gray-800">{exp.title}</h3>
                                <p className="text-sm text-gray-600 font-medium">{exp.company} | {exp.location}</p>
                                <p className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Aujourd\'hui' : exp.endDate}</p>
                                <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
                                <SuggestionButton onClick={() => onSuggestRewrite('experience', exp.id, exp.description)} />
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                 return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-lg font-bold border-b-2 pb-1 mb-3">FORMATION</h2>
                        {content.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-bold text-md text-gray-800">{edu.degree}</h3>
                                <p className="text-sm text-gray-600 font-medium">{edu.institution}</p>
                                <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-lg font-bold border-b-2 pb-1 mb-3">COMPÉTENCES</h2>
                        <div className="flex flex-wrap gap-2">
                            {content.skills.map(skill => (
                                <span key={skill.id} style={{ backgroundColor: `${layout.colors.primary}20`, color: layout.colors.primary }} className="px-3 py-1 text-sm rounded-full font-medium">{skill.name}</span>
                            ))}
                        </div>
                    </div>
                );
             case 'languages':
                return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-lg font-bold border-b-2 pb-1 mb-3">LANGUES</h2>
                        {content.languages.map(lang => (
                            <p key={lang.id} className="text-sm text-gray-700">{lang.name} ({lang.level})</p>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8 bg-white font-sans" style={{ fontFamily: layout.fonts.body }}>
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold" style={{ color: layout.colors.primary, fontFamily: layout.fonts.heading }}>{content.name}</h1>
                <div className="flex justify-center items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center space-x-1"><Mail className="w-4 h-4" /><span>{content.email}</span></span>
                    <span className="flex items-center space-x-1"><Phone className="w-4 h-4" /><span>{content.phone}</span></span>
                    <span className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{content.address}</span></span>
                </div>
            </header>

            {/* Body */}
            <div className="space-y-6">
                {sections.map(section => (
                    <SortableSection key={section.id} id={section.id}>
                        {renderSection(section.id)}
                    </SortableSection>
                ))}
            </div>
        </div>
    );
};

export default ModernTemplate;
