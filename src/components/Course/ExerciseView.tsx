// src/components/Course/ExerciseView.tsx

interface ExerciseViewProps {
  exerciseId: number;
  onBack: () => void;
}

export const ExerciseView = ({ exerciseId, onBack }: ExerciseViewProps) => {
    return (
        <div style={{padding: '2rem'}}>
            <button onClick={onBack} style={{marginBottom: '1rem'}}>Voltar para a Unidade</button>
            <h2>Exercise View</h2>
            <p>Exercicio ID: {exerciseId}</p>
            <p>Componente de exercício ainda não implementado.</p>
        </div>
    );
};
