import React from 'react';
import { CVPreviewProps, CVSectionType } from '../../types';
import { Mail, Phone, MapPin, Bot, User, Star, Languages, Briefcase, GraduationCap } from 'lucide-react';
import SortableSection from '../edit/SortableSection';

const SuggestionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-0 -right-6 p-1 bg-blue-100 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-200"
        title="Suggérer une réécriture IA"
    >
        <Bot className="w-3 h-3" />
    </button>
);

const CreativeTemplate: React.FC<CVPreviewProps> = ({ cv, onSuggestRewrite }) => {
    const { content, layout, sections } = cv;
    const sidebarSections: CVSectionType[] = ['summary', 'skills', 'languages'];

    const renderSection = (type: CVSectionType, location: 'main' | 'sidebar') => {
        const headingStyle = { color: location === 'sidebar' ? '#FFFFFF' : layout.colors.primary };
        const textStyle = { color: location === 'sidebar' ? '#E0E0E0' : '#4A5568' };
        const iconStyle = { color: location === 'sidebar' ? '#FFFFFF' : layout.colors.primary };

        switch (type) {
            case 'summary':
                return (
                    <div className="relative group">
                        <h2 style={headingStyle} className="text-lg font-bold mb-2 flex items-center"><User className="w-5 h-5 mr-2" style={iconStyle}/><span>RÉSUMÉ</span></h2>
                        <p style={textStyle} className="text-sm">{content.summary}</p>
                        <SuggestionButton onClick={() => onSuggestRewrite('summary', null, content.summary)} />
                    </div>
                );
            case 'experience':
                return (
                    <div>
                        <h2 style={headingStyle} className="text-xl font-bold mb-4 flex items-center"><Briefcase className="w-6 h-6 mr-3" style={iconStyle}/><span>EXPÉRIENCE</span></h2>
                        {content.experience.map(exp => (
                            <div key={exp.id} className="mb-4 relative group">
                                <h3 className="font-bold text-md text-gray-800">{exp.title}</h3>
                                <p className="text-sm text-gray-600 font-medium">{exp.company} | {exp.startDate} - {exp.current ? 'Aujourd\'hui' : exp.endDate}</p>
                                <p style={textStyle} className="text-sm mt-1">{exp.description}</p>
                                <SuggestionButton onClick={() => onSuggestRewrite('experience', exp.id, exp.description)} />
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                 return (
                    <div>
                        <h2 style={headingStyle} className="text-xl font-bold mb-4 flex items-center"><GraduationCap className="w-6 h-6 mr-3" style={iconStyle}/><span>FORMATION</span></h2>
                        {content.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-bold text-md text-gray-800">{edu.degree}</h3>
                                <p className="text-sm text-gray-600 font-medium">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return (
                    <div>
                        <h2 style={headingStyle} className="text-lg font-bold mb-2 flex items-center"><Star className="w-5 h-5 mr-2" style={iconStyle}/><span>COMPÉTENCES</span></h2>
                        <div className="flex flex-wrap gap-2">
                            {content.skills.map(skill => (
                                <span key={skill.id} className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>{skill.name}</span>
                            ))}
                        </div>
                    </div>
                );
             case 'languages':
                return (
                    <div>
                        <h2 style={headingStyle} className="text-lg font-bold mb-2 flex items-center"><Languages className="w-5 h-5 mr-2" style={iconStyle}/><span>LANGUES</span></h2>
                        {content.languages.map(lang => (
                            <p key={lang.id} style={textStyle} className="text-sm">{lang.name}: {lang.level}</p>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const mainSections = sections.filter(s => !sidebarSections.includes(s.id));
    const sideSections = sections.filter(s => sidebarSections.includes(s.id));

    return (
        <div className="flex min-h-[29.7cm] bg-white" style={{ fontFamily: layout.fonts.body }}>
            {/* Sidebar */}
            <aside className="w-1/3 p-6 space-y-6" style={{ backgroundColor: layout.colors.primary }}>
                <header className="text-white">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: layout.fonts.heading }}>{content.name}</h1>
                    <p className="text-lg font-light" style={{ color: layout.colors.secondary }}>Développeur Full-Stack</p>
                </header>
                <div className="text-sm text-white space-y-2">
                    <p className="flex items-center"><Mail className="w-4 h-4 mr-2"/> {content.email}</p>
                    <p className="flex items-center"><Phone className="w-4 h-4 mr-2"/> {content.phone}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> {content.address}</p>
                </div>
                {sideSections.map(section => (
                    <SortableSection key={section.id} id={section.id}>
                        {renderSection(section.id, 'sidebar')}
                    </SortableSection>
                ))}
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8 space-y-6">
                {mainSections.map(section => (
                    <SortableSection key={section.id} id={section.id}>
                        {renderSection(section.id, 'main')}
                    </SortableSection>
                ))}
            </main>
        </div>
    );
};

export default CreativeTemplate;
