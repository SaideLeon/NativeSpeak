// src/components/Course/sections/GrammarSection.tsx
import type { GrammarContent } from '../../../types/course.types';
import styles from './GrammarSection.module.css';

export const GrammarSection = ({ contents }: { contents: GrammarContent[] }) => {
    return (
        <div className={styles.grammarSection}>
            <h4>Gramática</h4>
            {contents.map(content => (
                <div key={content.id} className={styles.grammarContent}>
                    <h5>{content.title}</h5>
                    <p className={styles.explanation}>{content.explanation}</p>
                    {content.examples && content.examples.length > 0 && (
                        <table className={styles.examplesTable}>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Form</th>
                                    <th>Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.examples.map(example => (
                                    <tr key={example.id}>
                                        <td>{example.subject}</td>
                                        <td>{example.verb_form}</td>
                                        <td>{example.example_sentence}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </div>
    );
};
