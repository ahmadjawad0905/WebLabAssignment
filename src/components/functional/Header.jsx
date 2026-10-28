import React from 'react';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component
 * Functional Component displaying application branding, active task count,
 * ThemeToggle, and a trigger button for the Activity Logger.
 */
export function Header({ pendingCount, onOpenLogger, logCount = 0 }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-icon">📋</span>
        <div>
          <h1 className="header-title">Task & Activity Dashboard</h1>
          <p className="header-subtitle">
            React Component Architecture & State Management
          </p>
        </div>
      </div>

      <div className="header-actions">
        {pendingCount > 0 ? (
          <span className="badge badge-primary">
            {pendingCount} Pending {pendingCount === 1 ? 'Task' : 'Tasks'}
          </span>
        ) : (
          <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            ✓ All Caught Up
          </span>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenLogger}
          title="Open Activity Logs"
        >
          {/* History/Activity SVG icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Activity Log
          {logCount > 0 && (
            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#ffffff', marginLeft: 4 }}>
              {logCount}
            </span>
          )}
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
