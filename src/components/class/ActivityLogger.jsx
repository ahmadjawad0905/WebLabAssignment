import React, { Component } from 'react';

/**
 * ActivityLogger Component (Legacy Class Component)
 *
 * Demonstrates proficiency in React Class Component architecture:
 * - constructor() with explicit this.state initialization and method binding
 * - componentDidMount() lifecycle: retrieves persisted logs & binds global event listeners
 * - componentDidUpdate() lifecycle: responds to prop changes, persists to localStorage, triggers toast
 * - componentWillUnmount() lifecycle: cleans up timers and removes global event listeners
 * - this.setState() explicit state management
 */
export class ActivityLogger extends Component {
  constructor(props) {
    super(props);

    // Initial local component state
    this.state = {
      logs: [],
      toast: null,
      filter: 'all',
    };

    // Timer reference for clearing toasts
    this.toastTimer = null;

    // Explicit method bindings
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClearLogs = this.handleClearLogs.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleCloseToast = this.handleCloseToast.bind(this);
  }

  /**
   * Lifecycle: componentDidMount
   * Executed once after component is inserted into DOM.
   * 1. Retrieves saved logs from browser localStorage.
   * 2. Registers global keyboard listener (Escape to close drawer).
   */
  componentDidMount() {
    try {
      const savedLogs = localStorage.getItem('task_activity_logs');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) {
          this.setState({ logs: parsed });
          if (this.props.onLogCountChange) {
            this.props.onLogCountChange(parsed.length);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load activity logs from localStorage:', err);
    }

    // Attach global keyboard listener for accessibility
    window.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Lifecycle: componentDidUpdate
   * Executed immediately after updating occurs.
   * 1. Detects new activity received via latestActivity prop.
   * 2. Prepends to logs state using this.setState().
   * 3. Persists new log collection to browser localStorage.
   * 4. Triggers an automated visual toast notification.
   */
  componentDidUpdate(prevProps, prevState) {
    const { latestActivity } = this.props;

    // Check if a new activity was passed down
    if (
      latestActivity &&
      latestActivity.id &&
      (!prevProps.latestActivity || prevProps.latestActivity.id !== latestActivity.id)
    ) {
      const updatedLogs = [latestActivity, ...this.state.logs];

      this.setState(
        {
          logs: updatedLogs,
          toast: latestActivity.message,
        },
        () => {
          // Persist newly added logs to localStorage
          try {
            localStorage.setItem('task_activity_logs', JSON.stringify(updatedLogs));
          } catch (err) {
            console.warn('Failed to save activity logs to localStorage:', err);
          }

          if (this.props.onLogCountChange) {
            this.props.onLogCountChange(updatedLogs.length);
          }
        }
      );

      // Trigger auto-dismiss timer for toast notification
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
      }
      this.toastTimer = setTimeout(() => {
        this.setState({ toast: null });
      }, 3500);
    }
  }

  /**
   * Lifecycle: componentWillUnmount
   * Perform necessary cleanups before component unmounts:
   * 1. Clear any active toast timeouts to prevent memory leaks.
   * 2. Unsubscribe from global event listeners.
   */
  componentWillUnmount() {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // Handle global Escape key to close the drawer
  handleKeyDown(event) {
    if (event.key === 'Escape' && this.props.isOpen) {
      this.props.onClose();
    }
  }

  // Clear all logs from state and localStorage
  handleClearLogs() {
    this.setState({ logs: [] }, () => {
      try {
        localStorage.removeItem('task_activity_logs');
      } catch (err) {
        console.warn('Failed to clear logs:', err);
      }
      if (this.props.onLogCountChange) {
        this.props.onLogCountChange(0);
      }
    });
  }

  handleFilterChange(filter) {
    this.setState({ filter });
  }

  handleCloseToast() {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.setState({ toast: null });
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { logs, toast, filter } = this.state;

    // Filter logs based on category
    const filteredLogs = logs.filter((log) => {
      if (filter === 'all') return true;
      return log.type === filter;
    });

    return (
      <React.Fragment>
        {/* Visual Toast Notification (Triggered via componentDidUpdate) */}
        {toast && (
          <div className="toast-container" role="status" aria-live="polite">
            <div className="toast">
              <span>🔔</span>
              <span>{toast}</span>
              <button
                type="button"
                onClick={this.handleCloseToast}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: 16,
                  marginLeft: 8,
                }}
                aria-label="Dismiss Notification"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Modal Backdrop when drawer is open */}
        {isOpen && (
          <div
            className="logger-backdrop"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* Slide-out Activity Logger Drawer */}
        <aside
          className={`logger-drawer ${isOpen ? 'open' : ''}`}
          aria-label="System Activity Log"
          aria-hidden={!isOpen}
        >
          {/* Drawer Header */}
          <div className="logger-header">
            <div className="logger-title">
              <span>📋</span>
              <span>Activity & System Log</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              aria-label="Close activity log"
            >
              ✕
            </button>
          </div>

          {/* Drawer Toolbar & Filters */}
          <div className="logger-toolbar">
            <select
              className="form-control"
              style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}
              value={filter}
              onChange={(e) => this.handleFilterChange(e.target.value)}
              aria-label="Filter activity log"
            >
              <option value="all">All Events ({logs.length})</option>
              <option value="TASK_ADD">Task Added</option>
              <option value="TASK_DELETE">Task Deleted</option>
              <option value="STATUS_CHANGE">Status Changed</option>
              <option value="FILTER_CHANGE">Filter Changed</option>
            </select>

            {logs.length > 0 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={this.handleClearLogs}
              >
                Clear
              </button>
            )}
          </div>

          {/* Log Items List */}
          <div className="logger-list">
            {filteredLogs.length === 0 ? (
              <div className="empty-state" style={{ padding: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📜</div>
                <p className="empty-state-text">No activity recorded yet.</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const badgeClass =
                  log.type === 'TASK_ADD'
                    ? 'log-badge-add'
                    : log.type === 'TASK_DELETE'
                    ? 'log-badge-delete'
                    : log.type === 'STATUS_CHANGE'
                    ? 'log-badge-toggle'
                    : log.type === 'FILTER_CHANGE'
                    ? 'log-badge-filter'
                    : 'log-badge-theme';

                return (
                  <div key={log.id} className="log-item">
                    <div className="log-item-header">
                      <span className={`log-badge ${badgeClass}`}>
                        {log.type.replace('_', ' ')}
                      </span>
                      <span className="log-time">{log.time}</span>
                    </div>
                    <p className="log-message">{log.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </React.Fragment>
    );
  }
}

export default ActivityLogger;
