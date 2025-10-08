// src/components/Course/sections/GrammarSection.tsx
import type { GrammarContent } from '../../../types/course.types';

export const GrammarSection = ({ contents }: { contents: GrammarContent[] }) => {
    return <div style={{padding: '1rem', background: '#2a3b4d', borderRadius: '8px', marginTop: '1rem'}}><b>Grammar Section</b><p>({contents.length} items) - Component not fully implemented yet.</p></div>;
};
