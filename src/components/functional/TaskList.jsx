import React from 'react';
import TaskCard from './TaskCard';

/**
 * TaskList Component
 * Functional Component responsible for listing and filtering tasks.
 *
 * Demonstrates:
 * - Conditional Rendering (ternary operators and && short-circuiting)
 * - Array rendering via Array.prototype.map() with unique key props
 * - Synthetic events (onChange, onClick) for search and filter controls
 * - Passing callback props down to child components
 */
export function TaskList({
  tasks,
  totalTaskCount,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onToggleTask,
  onDeleteTask,
  onClearFilters,
}) {
  return (
    <div>
      {/* Search and Filters Bar */}
      <div className="list-controls">
        {/* Search input with synthetic onChange event */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Filter Chips */}
        <div className="filter-chips-row">
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
            Status:
          </span>
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => onStatusFilterChange(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Priority & Category Dropdowns */}
        <div className="filter-selects-row">
          <select
            className="form-control"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
            <option value="Study">Study</option>
          </select>
        </div>
      </div>

      {/* Conditional Rendering: Empty States vs. Task Collection */}
      {totalTaskCount === 0 ? (
        /* Empty State 1: No tasks created yet */
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h4 className="empty-state-title">No tasks created yet</h4>
          <p className="empty-state-text">
            Use the form on the left to add your first task and start organizing your day.
          </p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State 2: Filters matched no tasks */
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <h4 className="empty-state-title">No matching tasks found</h4>
          <p className="empty-state-text">
            No tasks match your current search query or filter criteria.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 12 }}
            onClick={onClearFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Task Cards Collection rendered with Array.prototype.map() */
        <div className="tasks-container">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
