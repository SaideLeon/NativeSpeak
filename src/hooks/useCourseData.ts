// src/hooks/useCourseData.ts
import { useState, useEffect } from 'react';
import type { Unit } from '../types/course.types';

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
