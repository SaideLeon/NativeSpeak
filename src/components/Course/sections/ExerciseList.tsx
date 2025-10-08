// src/components/Course/sections/ExerciseList.tsx
import type { Exercise } from '../../../types/course.types';

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseClick: (exerciseId: number) => void;
}

export const ExerciseList = ({ exercises, onExerciseClick }: ExerciseListProps) => {
    return (
        <div style={{padding: '1rem', background: '#2a3b4d', borderRadius: '8px', marginTop: '1rem'}}>
            <b>Exercise List</b>
            <p>({exercises.length} exercises) - Component not fully implemented yet.</p>
            {exercises.map(ex => (
                <button key={ex.id} onClick={() => onExerciseClick(ex.id)} style={{display: 'block', marginTop: '0.5rem'}}>
                    Praticar: {ex.title}
                </button>
            ))}
        </div>
    );
};
