
import { useState, useEffect, useCallback } from 'react';
import { authStore } from '../lib/authStore';

const API_URL = 'https://nativespeak.cognick.qzz.io/api';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  unlocked_at: string;
  user: number;
}

export function useAchievementsData() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = authStore.getState().token;

  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }, [token]);

  const fetchAchievements = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/achievements/`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }
      const data = await response.json();
      setAchievements(data.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, token]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const addAchievement = async (newAchievement: Omit<Achievement, 'id' | 'unlocked_at' | 'user'>) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/achievements/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newAchievement),
      });
      if (!response.ok) {
        throw new Error('Failed to create achievement');
      }
      const createdAchievement = await response.json();
      setAchievements(prev => [...prev, createdAchievement]);
      return createdAchievement;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const updateAchievement = async (id: number, updatedData: Partial<Omit<Achievement, 'id' | 'unlocked_at' | 'user'>>) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/achievements/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update achievement');
      }
      const updatedAchievement = await response.json();
      setAchievements(prev => prev.map(ach => ach.id === id ? updatedAchievement : ach));
      return updatedAchievement;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const deleteAchievement = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/achievements/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete achievement');
      }
      setAchievements(prev => prev.filter(ach => ach.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return {
    achievements,
    loading,
    error,
    fetchAchievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
  };
}
