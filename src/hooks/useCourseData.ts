// src/hooks/useCourseData.ts
import { useState, useEffect } from 'react';
import type { Unit, UnitDetail, ExerciseDetail } from '../types/course.types';

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnits() {
      try {
        const response = await fetch('https://nativespeak.cognick.qzz.io/api/units/');
        if (!response.ok) {
          throw new Error('Failed to fetch units');
        }
        const data = await response.json();
        setUnits(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, []);

  return { units, loading, error };
}

export function useUnitDetail(unitId: number) {
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) return;

    async function fetchUnitDetail() {
      try {
        const response = await fetch(`https://nativespeak.cognick.qzz.io/api/units/${unitId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch unit details');
        }
        const data = await response.json();
        setUnit(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchUnitDetail();
  }, [unitId]);

  return { unit, loading, error };
}

export function useExercise(exerciseId: number) {
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exerciseId) return;

    async function fetchExercise() {
      try {
        const response = await fetch(`https://nativespeak.cognick.qzz.io/api/exercises/${exerciseId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch exercise details');
        }
        const data = await response.json();
        setExercise(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchExercise();
  }, [exerciseId]);

  return { exercise, loading, error };
}
