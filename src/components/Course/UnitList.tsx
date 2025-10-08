// src/components/Course/UnitList.tsx
import { useUnits } from '../../hooks/useCourseData';
import type { Unit } from '../../types/course.types';
import styles from './UnitList.module.css';

interface UnitListProps {
  onUnitClick: (unitId: number) => void;
}

export function UnitList({ onUnitClick }: UnitListProps) {
  const { units, loading, error } = useUnits();

  if (loading) {
    return <div className={styles.loading}>Carregando unidades...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.unitList}>
      <h1 className={styles.title}>📚 Unidades do Curso</h1>
      <div className={styles.unitsGrid}>
        {units.map((unit) => (
          <UnitCard 
            key={unit.id} 
            unit={unit} 
            onClick={() => onUnitClick(unit.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
}

function UnitCard({ unit, onClick }: UnitCardProps) {
  return (
    <div className={styles.unitCard} onClick={onClick}>
      <div className={styles.unitIcon}>{unit.icon}</div>
      <h3>Unit {unit.number}: {unit.title}</h3>
      <p>{unit.description}</p>
      <div className={styles.unitMeta}>
        <span>{unit.theme_count} temas</span>
      </div>
    </div>
  );
}
