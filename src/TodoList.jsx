import React, { useState, useEffect, useRef } from 'react';
import './TodoList.css';

// TodoItem component for single todo, now with description support
function TodoItem({
  todo,
  index,
  isEditing,
  editingText,
  editingDescription,
  onToggle,
  onEditStart,
  onEditChange,
  onEditDescriptionChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onToggleDescription,
  showDescription,
  inputRef
}) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(index)}
        aria-label={`Mark ${todo.text} as completed`}
      />
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingText}
            onChange={onEditChange}
            onKeyDown={e => {
              if (e.key === 'Enter') onEditSave(index);
              if (e.key === 'Escape') onEditCancel();
            }}
            ref={inputRef}
            aria-label="Edit todo"
            placeholder="Edit title"
          />
          <input
            type="text"
            value={editingDescription}
            onChange={onEditDescriptionChange}
            onKeyDown={e => {
              if (e.key === 'Enter') onEditSave(index);
              if (e.key === 'Escape') onEditCancel();
            }}
            aria-label="Edit description"
            placeholder="Edit description"
            style={{ width: '50%', marginLeft: 4 }}
          />
          <button onClick={() => onEditSave(index)} aria-label="Save edit">💾</button>
          <button onClick={onEditCancel} aria-label="Cancel edit">✖️</button>
        </>
      ) : (
        <>
          <span
            tabIndex={0}
            onDoubleClick={() => onEditStart(index)}
            onKeyDown={e => {
              if (e.key === 'Enter') onEditStart(index);
            }}
            aria-label={`Todo: ${todo.text}`}
            role="textbox"
          >
            {todo.text}
          </span>
          <button onClick={() => onEditStart(index)} aria-label="Edit todo">✏️</button>
          <button onClick={() => onDelete(index)} aria-label="Delete todo">❌</button>
          <button onClick={() => onToggleDescription(index)} aria-label="Show description">
            {showDescription ? 'Hide Info' : 'Info'}
          </button>
        </>
      )}
      {showDescription && !isEditing && (
        <div className="todo-description">
          <strong>Description:</strong> {todo.description || <em>No description</em>}
        </div>
      )}
    </li>
  );
}

// Main TodoList component
function TodoList() {
  // State hooks
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDescriptions, setShowDescriptions] = useState({});
  const inputRef = useRef(null);

  // Persist todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Focus on edit input
  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  // Add new todo with description
  const handleAddTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { text: input, completed: false, description }]);
      setInput('');
      setDescription('');
    }
  };

  // Toggle completed
  const toggleTodo = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  // Confirm delete
  const confirmDeleteTodo = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  // Delete todo
  const deleteTodo = () => {
    const updated = todos.filter((_, i) => i !== deleteIndex);
    setTodos(updated);
    setShowConfirm(false);
    setDeleteIndex(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteIndex(null);
  };

  // Start editing (also set editingDescription)
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].text);
    setEditingDescription(todos[index].description || '');
  };

  // Edit input change
  const handleEditChange = (e) => {
    setEditingText(e.target.value);
  };

  // Edit description input change
  const handleEditDescriptionChange = (e) => {
    setEditingDescription(e.target.value);
  };

  // Save edit (also save description)
  const saveEdit = (index) => {
    if (editingText.trim()) {
      const updated = [...todos];
      updated[index].text = editingText;
      updated[index].description = editingDescription;
      setTodos(updated);
      setEditingIndex(null);
      setEditingText('');
      setEditingDescription('');
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
    setEditingDescription('');
  };

  // Clear completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Mark all as completed
  const markAllCompleted = () => {
    setTodos(todos.map(todo => ({ ...todo, completed: true })));
  };

  // Filtered todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Progress bar
  const completedCount = todos.filter(todo => todo.completed).length;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

  // Toggle description visibility for a todo
  const toggleDescription = (index) => {
    setShowDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-row">
        <label htmlFor="todo-input" className="visually-hidden">Add new todo</label>
        <input
          id="todo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new todo"
          onKeyDown={e => { if (e.key === 'Enter') handleAddTodo(); }}
          aria-label="Add new todo"
        />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add description"
          aria-label="Add description"
          style={{ width: '50%' }}
        />
        <button onClick={handleAddTodo} aria-label="Add todo">Add</button>
      </div>
      <div className="filters">
        <button
          className={filter === 'all' ? 'active-filter' : ''}
          onClick={() => setFilter('all')}
        >All</button>
        <button
          className={filter === 'active' ? 'active-filter' : ''}
          onClick={() => setFilter('active')}
        >Active</button>
        <button
          className={filter === 'completed' ? 'active-filter' : ''}
          onClick={() => setFilter('completed')}
        >Completed</button>
        <button onClick={clearCompleted}>Clear Completed</button>
        <button onClick={markAllCompleted}>Mark All Completed</button>
      </div>
      <div className="progress-bar-container" aria-label="Progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-label">{completedCount}/{todos.length} completed</span>
      </div>
      <ul>
        {filteredTodos.length === 0 && (
          <li className="no-todos">No todos to show.</li>
        )}
        {filteredTodos.map((todo, idx) => (
          <TodoItem
            key={todos.indexOf(todo) + '-' + todo.text}
            todo={todo}
            index={todos.indexOf(todo)}
            isEditing={editingIndex === todos.indexOf(todo)}
            editingText={editingText}
            editingDescription={editingDescription}
            onToggle={toggleTodo}
            onEditStart={startEditing}
            onEditChange={handleEditChange}
            onEditDescriptionChange={handleEditDescriptionChange}
            onEditSave={saveEdit}
            onEditCancel={cancelEdit}
            onDelete={confirmDeleteTodo}
            onToggleDescription={toggleDescription}
            showDescription={!!showDescriptions[todos.indexOf(todo)]}
            inputRef={inputRef}
          />
        ))}
      </ul>
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this todo?</p>
            <button onClick={deleteTodo} autoFocus>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
