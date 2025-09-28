import React, { useState } from 'react';
import { useTodoStore } from '../lib/todoStore';
import './TodoList.css';
import cn from 'classnames';

const TodoList: React.FC = () => {
  const { todos, addTodo, removeTodo, toggleTodo } = useTodoStore();
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
        <button type="submit" className="todo-add-button" aria-label="Add goal">
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
              >
                <span className="icon">delete</span>
              </button>
            </li>
          ) : (
            <li
              key={todo.id}
              className={cn('todo-item', { completed: todo.completed })}
            >
              <label className="todo-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="todo-checkbox-visual"></span>
              </label>
              <span className="todo-text">{todo.text}</span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="todo-delete-button"
                aria-label={`Delete ${todo.text}`}
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