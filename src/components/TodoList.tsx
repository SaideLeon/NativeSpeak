import React, { useState } from 'react';
import { useTodoStore } from '../lib/todoStore';
import './TodoList.css';
import cn from 'classnames';

const TodoList: React.FC = () => {
  const { todos, addTodo, removeTodo, cycleTodoStatus } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  return (
    <div className="todo-list-container">
      <h4 className="sidebar-section-title">Metas de Estudo</h4>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
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
        {todos.map((todo) =>
          todo.isHeader ? (
            <li key={todo.id} className="todo-header">
              <span>{todo.text}</span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="todo-delete-button"
                aria-label={`Delete category ${todo.text}`}
                title="Excluir categoria"
              >
                <span className="icon">delete</span>
              </button>
            </li>
          ) : (
            <li
              key={todo.id}
              className={cn('todo-item', {
                completed: todo.status === 'completed',
                inProgress: todo.status === 'inProgress',
              })}
            >
              <button
                onClick={() => cycleTodoStatus(todo.id)}
                className="todo-status-button"
                aria-label={`Change status for ${todo.text}`}
                title="Alterar status"
              >
                <span className="icon">
                  {todo.status === 'todo' && 'radio_button_unchecked'}
                  {todo.status === 'inProgress' && 'progress_activity'}
                  {todo.status === 'completed' && 'check_circle'}
                </span>
              </button>
              <span className="todo-text">{todo.text}</span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="todo-delete-button"
                aria-label={`Delete ${todo.text}`}
                title="Excluir meta"
              >
                <span className="icon">delete</span>
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default TodoList;