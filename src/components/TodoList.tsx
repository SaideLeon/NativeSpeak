import React, { useState } from 'react';
import { useGoalsData } from '../hooks/useGoalsData';
import './TodoList.css';
import cn from 'classnames';

const TodoList: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoal, loading, error } = useGoalsData();
  const [newGoalText, setNewGoalText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      await addGoal({ text: newGoalText.trim(), status: 'inProgress' });
      setNewGoalText('');
    }
  };

  const handleCycleStatus = (goal: any) => {
    const newStatus =
      goal.status === 'inProgress'
        ? 'completed'
        : goal.status === 'completed'
        ? 'onHold'
        : 'inProgress';
    updateGoal(goal.id, { status: newStatus });
  };

  if (loading) {
    return <div className="todo-list-container">Carregando metas...</div>;
  }

  if (error) {
    return <div className="todo-list-container">Erro ao carregar metas: {error}</div>;
  }

  return (
    <div className="todo-list-container">
      <h4 className="sidebar-section-title">Metas de Estudo</h4>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          placeholder="Adicionar nova meta..."
          className="todo-input"
        />
        <button
          type="submit"
          className="todo-add-button"
          aria-label="Add goal"
          title="Adicionar meta"
        >
          <span className="icon">add</span>
        </button>
      </form>
      <ul className="todo-items-list">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className={cn('todo-item', {
              completed: goal.status === 'completed',
              inProgress: goal.status === 'inProgress',
              onHold: goal.status === 'onHold',
            })}
          >
            <button
              onClick={() => handleCycleStatus(goal)}
              className="todo-status-button"
              aria-label={`Change status for ${goal.text}`}
              title="Alterar status"
            >
              <span className="icon">
                {goal.status === 'onHold' && 'radio_button_unchecked'}
                {goal.status === 'inProgress' && 'progress_activity'}
                {goal.status === 'completed' && 'check_circle'}
              </span>
            </button>
            <span className="todo-text">{goal.text}</span>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="todo-delete-button"
              aria-label={`Delete ${goal.text}`}
              title="Excluir meta"
            >
              <span className="icon">delete</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;