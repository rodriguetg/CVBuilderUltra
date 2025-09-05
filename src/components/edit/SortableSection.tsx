import React, { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
  id: string;
  children: ReactNode;
}

const SortableSection: React.FC<SortableSectionProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners} className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 rounded-full">
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>
      {children}
    </div>
  );
};

export default SortableSection;
