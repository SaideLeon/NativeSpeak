// src/components/Course/UnitDetail.tsx
import { useUnitDetail } from '../../hooks/useCourseData';
import type { Theme } from '../../types/course.types';
import styles from './UnitDetail.module.css';

interface UnitDetailProps {
  unitId: number;
  onExerciseClick: (exerciseId: number) => void;
  onBack: () => void;
}

export function UnitDetail({ unitId, onExerciseClick, onBack }: UnitDetailProps) {
  const { unit, loading, error } = useUnitDetail(unitId);

  if (loading) {
    return <div className={styles.loading}>Carregando detalhes da unidade...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!unit) {
    return <div className={styles.error}>Unidade não encontrada.</div>;
  }

  return (
    <div className={styles.unitDetail}>
      <button onClick={onBack} className={styles.backButton}>&larr; Voltar para as unidades</button>
      <h1 className={styles.title}>{unit.icon} {unit.title}</h1>
      <p className={styles.description}>{unit.description}</p>
      <div className={styles.themesGrid}>
        {unit.themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} onExerciseClick={onExerciseClick} />
        ))}
      </div>
    </div>
  );
}

interface ThemeCardProps {
  theme: Theme;
  onExerciseClick: (exerciseId: number) => void;
}

function ThemeCard({ theme, onExerciseClick }: ThemeCardProps) {
  return (
    <div className={styles.themeCard}>
      <h3>{theme.icon} {theme.title}</h3>
      <div className={styles.topicsList}>
        {theme.topics.map((topic) => (
          <div key={topic.id} className={styles.topicItem}>
            <div>
              <span className={styles.topicIcon}>{topic.icon}</span>
              <span className={styles.topicTitle}>{topic.title}</span>
            </div>
            <div className={styles.exercisesList}>
              {topic.exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  className={styles.exerciseButton}
                  onClick={() => onExerciseClick(exercise.id)}
                >
                  {exercise.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}