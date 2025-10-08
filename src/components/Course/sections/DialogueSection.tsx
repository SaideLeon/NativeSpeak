// src/components/Course/sections/DialogueSection.tsx
import type { DialogueContent } from '../../../types/course.types';
import styles from './DialogueSection.module.css';

export const DialogueSection = ({ dialogues }: { dialogues: DialogueContent[] }) => {
    return (
        <div className={styles.dialogueSection}>
            <h4>Diálogo</h4>
            {dialogues.map(dialogue => (
                <div key={dialogue.id} className={styles.dialogueContent}>
                    <h5>{dialogue.title}</h5>
                    <p className={styles.context}>{dialogue.context}</p>
                    <div>
                        {dialogue.lines.map(line => (
                            <div key={line.id} className={styles.dialogueLine}>
                                <div className={styles.speaker}>{line.speaker}:</div>
                                <div className={styles.lineText}>{line.text}</div>
                                <div className={styles.translation}>({line.translation})</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
