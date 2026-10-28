import React from 'react';

/**
 * CardWrapper Component
 * Demonstrates the use of React Children (props.children) to build
 * a flexible, reusable container component with an optional header slot.
 */
export function CardWrapper({ title, badge, action, children, className = '' }) {
  return (
    <div className={`card-wrapper ${className}`}>
      {(title || action) && (
        <div className="card-wrapper-header">
          <div className="card-wrapper-title">
            <span>{title}</span>
            {badge !== undefined && (
              <span className="badge badge-primary">{badge}</span>
            )}
          </div>
          {action && <div className="card-wrapper-action">{action}</div>}
        </div>
      )}
      <div className="card-wrapper-body">
        {children}
      </div>
    </div>
  );
}

export default CardWrapper;
