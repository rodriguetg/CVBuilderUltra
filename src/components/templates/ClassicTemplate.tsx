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

const ClassicTemplate: React.FC<CVPreviewProps> = ({ cv, onSuggestRewrite }) => {
    const { content, layout, sections } = cv;

    const renderSection = (type: CVSectionType) => {
        switch (type) {
            case 'summary':
                return (
                    <div className="relative group">
                        <h2 style={{ color: layout.colors.primary }} className="text-xl font-bold tracking-wider uppercase mb-3">Résumé</h2>
                        <p className="text-gray-700 leading-relaxed">{content.summary}</p>
                        <SuggestionButton onClick={() => onSuggestRewrite('summary', null, content.summary)} />
                    </div>
                );
            case 'experience':
                return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-xl font-bold tracking-wider uppercase mb-3">Expérience</h2>
                        {content.experience.map(exp => (
                            <div key={exp.id} className="mb-4 relative group">
                                <h3 className="font-bold text-lg text-gray-800">{exp.title}</h3>
                                <div className="flex justify-between text-sm text-gray-600 font-medium">
                                    <span>{exp.company} | {exp.location}</span>
                                    <span>{exp.startDate} - {exp.current ? 'Aujourd\'hui' : exp.endDate}</span>
                                </div>
                                <p className="mt-1 text-gray-700 leading-relaxed">{exp.description}</p>
                                <SuggestionButton onClick={() => onSuggestRewrite('experience', exp.id, exp.description)} />
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                 return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-xl font-bold tracking-wider uppercase mb-3">Formation</h2>
                        {content.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-bold text-lg text-gray-800">{edu.degree}</h3>
                                <div className="flex justify-between text-sm text-gray-600 font-medium">
                                    <span>{edu.institution}</span>
                                    <span>{edu.startDate} - {edu.endDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-xl font-bold tracking-wider uppercase mb-3">Compétences</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {content.skills.map(skill => skill.name).join(' • ')}
                        </p>
                    </div>
                );
             case 'languages':
                return (
                    <div>
                        <h2 style={{ color: layout.colors.primary }} className="text-xl font-bold tracking-wider uppercase mb-3">Langues</h2>
                        {content.languages.map(lang => (
                            <p key={lang.id} className="text-gray-700">{lang.name}: <span className="font-medium">{lang.level}</span></p>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-10 bg-white" style={{ fontFamily: layout.fonts.body }}>
            {/* Header */}
            <header className="text-center mb-8 border-b-2 pb-4" style={{ borderColor: layout.colors.primary }}>
                <h1 className="text-5xl font-bold" style={{ color: layout.colors.text, fontFamily: layout.fonts.heading }}>{content.name}</h1>
                <div className="flex justify-center items-center space-x-6 mt-3 text-sm text-gray-600">
                    <span>{content.email}</span>
                    <span>{content.phone}</span>
                    <span>{content.address}</span>
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

export default ClassicTemplate;
