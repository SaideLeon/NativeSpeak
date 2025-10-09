
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../lib/authStore';

const API_URL = 'https://nativespeak.cognick.qzz.io/api';

export interface Goal {
  id: number;
  text: string;
  status: 'inProgress' | 'completed' | 'onHold';
  created_at: string;
}

export function useGoalsData() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = useAuthStore.getState().user?.token?.access;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }, []);

  const fetchGoals = useCallback(async () => {
    const token = useAuthStore.getState().user?.token?.access;
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/goals/`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (newGoal: Omit<Goal, 'id' | 'created_at'>) => {
    const token = useAuthStore.getState().user?.token?.access;
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/goals/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newGoal),
      });
      if (!response.ok) {
        throw new Error('Failed to create goal');
      }
      const createdGoal = await response.json();
      setGoals(prev => [...prev, createdGoal]);
      return createdGoal;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const updateGoal = async (id: number, updatedData: Partial<Goal>) => {
    const token = useAuthStore.getState().user?.token?.access;
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/goals/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ text: updatedData.text, status: updatedData.status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      const updatedGoal = await response.json();
      setGoals(prev => prev.map(goal => goal.id === id ? updatedGoal : goal));
      return updatedGoal;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const deleteGoal = async (id: number) => {
    const token = useAuthStore.getState().user?.token?.access;
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/goals/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete goal');
      }
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
