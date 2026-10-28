import React from 'react';

/**
 * MetricsSummary Component
 * Functional Component presenting real-time statistical overview of tasks.
 * Embeds dynamic JavaScript expressions and renders a live progress bar.
 */
export function MetricsSummary({ metrics }) {
  const { total, completed, pending, highPriority, percentage } = metrics;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-label">
          <span>Total Tasks</span>
          <span>📁</span>
        </div>
        <div className="metric-value">{total}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">
          <span>Pending</span>
          <span>⏳</span>
        </div>
        <div className="metric-value" style={{ color: pending > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
          {pending}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">
          <span>Completed</span>
          <span>✅</span>
        </div>
        <div className="metric-value" style={{ color: 'var(--success)' }}>
          {completed}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">
          <span>High Priority</span>
          <span>🔥</span>
        </div>
        <div className="metric-value" style={{ color: highPriority > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
          {highPriority}
        </div>
      </div>
    </div>
  );
}

export default MetricsSummary;
