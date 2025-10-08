// src/components/Course/UnitDetail.tsx
import { useUnitDetail } from '../../hooks/useCourseData';
import type { Theme, Topic } from '../../types/course.types';
import styles from './UnitDetail.module.css';
import { DialogueSection } from './sections/DialogueSection';
import { ExerciseList } from './sections/ExerciseList';
import { GrammarSection } from './sections/GrammarSection';
import { VocabularySection } from './sections/VocabularySection';

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
          <TopicItem key={topic.id} topic={topic} onExerciseClick={onExerciseClick} />
        ))}
      </div>
    </div>
  );
}

interface TopicItemProps {
  topic: Topic;
  onExerciseClick: (exerciseId: number) => void;
}

function TopicItem({ topic, onExerciseClick }: TopicItemProps) {

  return (

    <div className={styles.topicItem}>

      <span className={styles.topicIcon}>{topic.icon}</span>

      <span className={styles.topicTitle}>{topic.title}</span>

      {topic.description && <p className={styles.topicDescription}>{topic.description}</p>}



      {topic.vocabulary_items && topic.vocabulary_items.length > 0 && (

        <VocabularySection items={topic.vocabulary_items} />

      )}



      {topic.grammar_contents && topic.grammar_contents.length > 0 && (

        <GrammarSection contents={topic.grammar_contents} />

      )}



      {topic.dialogues && topic.dialogues.length > 0 && (

        <DialogueSection dialogues={topic.dialogues} />

      )}



      {topic.exercises && topic.exercises.length > 0 && (

        <ExerciseList exercises={topic.exercises} onExerciseClick={onExerciseClick} />

      )}

    </div>

  );

}
