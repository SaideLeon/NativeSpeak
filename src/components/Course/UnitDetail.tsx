// src/components/Course/UnitDetail.tsx
import { useUnit } from '../../hooks/useCourseData';
import { VocabularySection } from './sections/VocabularySection';
import { GrammarSection } from './sections/GrammarSection';
import { DialogueSection } from './sections/DialogueSection';
import { ExerciseList } from './sections/ExerciseList';
import type { Topic } from '../../types/course.types';

import styles from './UnitDetail.module.css';

interface UnitDetailProps {
  unitId: number;
  onExerciseClick: (exerciseId: number) => void;
  onBack: () => void;
}

export function UnitDetail({ unitId, onExerciseClick, onBack }: UnitDetailProps) {
  const { unit, loading, error } = useUnit(unitId);

  if (loading) return <div className={styles.unitDetail}>Carregando...</div>;
  if (error || !unit) return <div className={styles.unitDetail}>Erro ao carregar unidade</div>;

  return (
    <div className={styles.unitDetail}>
        <button onClick={onBack} className={styles.backButton}>
            <span className="icon">arrow_back</span>
            Voltar para Unidades
        </button>
      <header className={styles.header}>
        <h1>{unit.icon} {unit.title}</h1>
        <p>{unit.description}</p>
      </header>

      <div className={styles.content}>
        {unit.themes.map((theme) => (
          <section key={theme.id} className={styles.themeSection}>
            <h2>
              <span>{theme.icon}</span> {theme.title}
            </h2>

            {theme.topics.map((topic) => (
              <TopicContent 
                key={topic.id} 
                topic={topic}
                onExerciseClick={onExerciseClick}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

interface TopicContentProps {
  topic: Topic;
  onExerciseClick: (exerciseId: number) => void;
}

function TopicContent({ topic, onExerciseClick }: TopicContentProps) {
  return (
    <div className={styles.topic}>
      <h3>{topic.icon} {topic.title}</h3>
      {topic.description && <p>{topic.description}</p>}

      {/* Vocabulary */}
      {topic.topic_type === 'vocabulary' && topic.vocabulary_items.length > 0 && (
        <VocabularySection items={topic.vocabulary_items} />
      )}

      {/* Grammar */}
      {topic.topic_type === 'grammar' && topic.grammar_contents.length > 0 && (
        <GrammarSection contents={topic.grammar_contents} />
      )}

      {/* Dialogues */}
      {topic.topic_type === 'speaking' && topic.dialogues.length > 0 && (
        <DialogueSection dialogues={topic.dialogues} />
      )}

      {/* Example Boxes */}
      {topic.example_boxes.map((box) => (
        <div key={box.id} className={`${styles.exampleBox} ${styles[box.box_type]}`}>
          <strong>{box.title}:</strong>
          <div dangerouslySetInnerHTML={{ __html: box.content.replace(/\n/g, '<br>') }} />
        </div>
      ))}

      {/* Exercises */}
      {topic.exercises.length > 0 && (
        <ExerciseList 
          exercises={topic.exercises}
          onExerciseClick={onExerciseClick}
        />
      )}
    </div>
  );
}
