// src/components/Course/CoursesPage.tsx
import { useState } from 'react';
import { UnitList } from './UnitList';
import { UnitDetail } from './UnitDetail';
import { ExerciseView } from './ExerciseView';

export function CoursesPage() {
  const [view, setView] = useState('list'); // 'list', 'unit', 'exercise'
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

  const handleUnitClick = (unitId: number) => {
    setSelectedUnitId(unitId);
    setView('unit');
  };

  const handleExerciseClick = (exerciseId: number) => {
    setSelectedExerciseId(exerciseId);
    setView('exercise');
  };

  const handleBackToUnits = () => {
    setView('list');
    setSelectedUnitId(null);
    setSelectedExerciseId(null);
  };

  const handleBackToUnit = () => {
    setView('unit');
    setSelectedExerciseId(null);
  };

  if (view === 'exercise' && selectedExerciseId) {
    return <ExerciseView exerciseId={selectedExerciseId} onBack={handleBackToUnit} />;
  }

  if (view === 'unit' && selectedUnitId) {
    return <UnitDetail unitId={selectedUnitId} onExerciseClick={handleExerciseClick} onBack={handleBackToUnits} />;
  }

  return <UnitList onUnitClick={handleUnitClick} />;
}
