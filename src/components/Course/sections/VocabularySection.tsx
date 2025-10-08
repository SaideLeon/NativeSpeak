// src/components/Course/sections/VocabularySection.tsx
import type { VocabularyItem } from '../../../types/course.types';
import styles from './VocabularySection.module.css';

export const VocabularySection = ({ items }: { items: VocabularyItem[] }) => {
    return (
        <div className={styles.vocabularySection}>
            <h4>Vocabulário</h4>
            <div className={styles.vocabularyList}>
                {items.map(item => (
                    <div key={item.id} className={styles.vocabularyItem}>
                        <div className={styles.word}>
                            <strong>{item.word}</strong>
                            {item.pronunciation && <span> ({item.pronunciation})</span>}
                        </div>
                        <div className={styles.translation}>{item.translation}</div>
                        <div className={styles.example}>{item.example_sentence}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
