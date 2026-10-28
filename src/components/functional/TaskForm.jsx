import React, { useState, useRef, useEffect } from 'react';

/**
 * TaskForm Component
 * Functional Component handling task creation.
 * Demonstrates:
 * - useState for controlled form controls
 * - useRef to automatically shift focus upon mount and after submitting
 * - Synthetic event handling (onSubmit, onChange)
 * - Callback prop pattern (onAddTask) for child-to-parent communication
 */
export function TaskForm({ onAddTask }) {
  // Form input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // useRef to automatically focus the primary input field
  const titleInputRef = useRef(null);

  // Automatically shift focus to title input on component mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setError('Task title is required.');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Invoke parent callback prop
    onAddTask(newTask);

    // Reset form controls
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('Work');
    setDueDate('');
    setError('');

    // Shift focus back to main input field after submission (useRef)
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="task-title">Task Title *</label>
        <input
          id="task-title"
          ref={titleInputRef}
          type="text"
          className="form-control"
          placeholder="e.g., Complete React Architecture Assignment"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
        />
        {error && <span className="form-hint">{error}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          className="form-control"
          placeholder="Provide optional details or notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-category">Category</label>
          <select
            id="task-category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
            <option value="Study">Study</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-date">Due Date</label>
        <input
          id="task-date"
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
