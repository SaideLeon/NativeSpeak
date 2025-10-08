// src/components/Course/sections/DialogueSection.tsx
import type { DialogueContent } from '../../../types/course.types';

export const DialogueSection = ({ dialogues }: { dialogues: DialogueContent[] }) => {
    return <div style={{padding: '1rem', background: '#2a3b4d', borderRadius: '8px', marginTop: '1rem'}}><b>Dialogue Section</b><p>({dialogues.length} items) - Component not fully implemented yet.</p></div>;
};
