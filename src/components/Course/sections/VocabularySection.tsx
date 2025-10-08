// src/components/Course/sections/VocabularySection.tsx
import type { VocabularyItem } from '../../../types/course.types';

export const VocabularySection = ({ items }: { items: VocabularyItem[] }) => {
    return <div style={{padding: '1rem', background: '#2a3b4d', borderRadius: '8px', marginTop: '1rem'}}><b>Vocabulary Section</b><p>({items.length} items) - Component not fully implemented yet.</p></div>;
};
