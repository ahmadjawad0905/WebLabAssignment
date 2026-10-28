import { useMemo } from 'react';

/**
 * Custom hook to calculate dashboard task metrics using useMemo
 * to prevent unnecessary recalculations on unrelated renders.
 */
export function useTaskMetrics(tasks = []) {
  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter((task) => task.priority === 'High' && !task.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      pending,
      highPriority,
      percentage,
    };
  }, [tasks]);
}
