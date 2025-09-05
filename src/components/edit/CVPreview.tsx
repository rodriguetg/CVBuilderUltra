import React from 'react';
import { useCVContext } from '../../context/CVContext';
import { CV, CVPreviewProps } from '../../types';

const CVPreview: React.FC<CVPreviewProps> = ({ cv, onSuggestRewrite }) => {
  const { state } = useCVContext();
  const { templates } = state;

  const activeTemplate = templates.find(t => t.id === cv.templateId);

  if (!activeTemplate) {
    return <div className="p-4 bg-red-100 text-red-800">Template non trouvé</div>;
  }

  const TemplateComponent = activeTemplate.component;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <TemplateComponent cv={cv} onSuggestRewrite={onSuggestRewrite} />
    </div>
  );
};

export default CVPreview;
