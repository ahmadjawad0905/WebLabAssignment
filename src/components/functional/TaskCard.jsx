import React, { memo } from 'react';

/**
 * TaskCard Component
 * Memoized using React.memo to prevent unnecessary re-renders
 * when other tasks or unrelated parent state updates.
 *
 * Demonstrates:
 * - Dynamic JavaScript expressions ({ ... })
 * - Conditional rendering via ternary operators & logical && short-circuiting
 * - Synthetic event handling (onChange, onClick)
 * - Callback props for parent-child communication
 */
export const TaskCard = memo(function TaskCard({ task, onToggle, onDelete }) {
  const { id, title, description, priority, category, dueDate, completed } = task;

  // Determine if task is overdue
  const isOverdue = !completed && dueDate && new Date(dueDate + 'T23:59:59') < new Date();

  // Dynamic CSS class for priority badge
  const priorityClass =
    priority === 'High'
      ? 'priority-high'
      : priority === 'Medium'
      ? 'priority-medium'
      : 'priority-low';

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`}>
      {/* Status Toggle Checkbox */}
      <div className="task-checkbox-wrapper">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        />
      </div>

      {/* Task Content */}
      <div className="task-content">
        <h3 className="task-title">{title}</h3>

        {/* Conditional description rendering */}
        {description && (
          <p className="task-description">{description}</p>
        )}

        {/* Meta badges: priority, category, due date */}
        <div className="task-meta-row">
          <span className={`priority-badge ${priorityClass}`}>
            {priority}
          </span>

          {category && (
            <span className="category-tag">
              {category}
            </span>
          )}

          {dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              <span>📅</span>
              <span>{dueDate}</span>
              {isOverdue && <strong> (Overdue!)</strong>}
            </span>
          )}
        </div>
      </div>

      {/* Task Actions */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-icon"
          onClick={() => onDelete(id, title)}
          title="Delete Task"
          aria-label={`Delete task "${title}"`}
        >
          {/* Trash Can SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default TaskCard;
