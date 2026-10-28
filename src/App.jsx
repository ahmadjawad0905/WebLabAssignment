import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTaskMetrics } from './hooks/useTaskMetrics';

import Header from './components/functional/Header';
import MetricsSummary from './components/functional/MetricsSummary';
import CardWrapper from './components/functional/CardWrapper';
import TaskForm from './components/functional/TaskForm';
import TaskList from './components/functional/TaskList';
import ActivityLogger from './components/class/ActivityLogger';

// Initial sample tasks to provide an immediate interactive experience
const INITIAL_TASKS = [
  {
    id: 'task_sample_1',
    title: 'Review React Component Architecture & Lifecycles',
    description: 'Ensure functional components, hooks, and class lifecycle methods adhere to project specification.',
    priority: 'High',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task_sample_2',
    title: 'Implement Dark/Light Theme with Vanilla CSS',
    description: 'Use CSS custom properties and ThemeContext without external styling dependencies.',
    priority: 'Medium',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task_sample_3',
    title: 'Prepare GitHub Repo & Live Deployment',
    description: 'Deploy project to Vercel/Netlify/GitHub Pages and attach screenshots to submission document.',
    priority: 'High',
    category: 'Urgent',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

function Dashboard() {
  // Task collection synchronized with localStorage via custom hook
  const [tasks, setTasks] = useLocalStorage('task_manager_tasks', INITIAL_TASKS);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Activity Logger state (fed to legacy Class Component)
  const [latestActivity, setLatestActivity] = useState(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [logCount, setLogCount] = useState(0);

  // Metrics calculation optimized with useMemo
  const metrics = useTaskMetrics(tasks);

  // Helper to record an activity event
  const logAction = useCallback((type, message) => {
    const activity = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLatestActivity(activity);
  }, []);

  /**
   * useEffect: Dynamically update document title based on pending tasks count.
   * Requirement from Task 5.
   */
  useEffect(() => {
    if (metrics.pending > 0) {
      document.title = `Tasks (${metrics.pending} pending) - Task Dashboard`;
    } else {
      document.title = `Tasks (All Done! 🎉) - Task Dashboard`;
    }
  }, [metrics.pending]);

  /**
   * useCallback: Optimize task creation callback passed down to TaskForm
   */
  const handleAddTask = useCallback(
    (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
      logAction('TASK_ADD', `Added task: "${newTask.title}"`);
    },
    [setTasks, logAction]
  );

  /**
   * useCallback: Optimize task status toggle callback passed to TaskCard
   */
  const handleToggleTask = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            const nextStatus = !task.completed;
            logAction(
              'STATUS_CHANGE',
              `Marked "${task.title}" as ${nextStatus ? 'Completed' : 'Pending'}`
            );
            return { ...task, completed: nextStatus };
          }
          return task;
        })
      );
    },
    [setTasks, logAction]
  );

  /**
   * useCallback: Optimize task deletion callback passed to TaskCard
   */
  const handleDeleteTask = useCallback(
    (id, title) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      logAction('TASK_DELETE', `Deleted task: "${title}"`);
    },
    [setTasks, logAction]
  );

  // Filter change handlers that record activity
  const handleStatusFilterChange = useCallback(
    (status) => {
      setStatusFilter(status);
      logAction('FILTER_CHANGE', `Filtered status by: ${status.toUpperCase()}`);
    },
    [logAction]
  );

  const handlePriorityFilterChange = useCallback(
    (priority) => {
      setPriorityFilter(priority);
      logAction('FILTER_CHANGE', `Filtered priority by: ${priority}`);
    },
    [logAction]
  );

  const handleCategoryFilterChange = useCallback(
    (category) => {
      setCategoryFilter(category);
      logAction('FILTER_CHANGE', `Filtered category by: ${category}`);
    },
    [logAction]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    logAction('FILTER_CHANGE', 'Reset all search and filters');
  }, [logAction]);

  /**
   * useMemo: Optimize filtered task calculation to avoid re-computations
   * on unrelated state changes (like logger toggle, timer ticks, etc.)
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filtering
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Priority filtering
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Category filtering
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      // Search term matching
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchTerm]);

  return (
    <div className="app-container">
      {/* Header View */}
      <Header
        pendingCount={metrics.pending}
        onOpenLogger={() => setIsLoggerOpen(true)}
        logCount={logCount}
      />

      {/* Metrics Summary Cards */}
      <MetricsSummary metrics={metrics} />

      {/* Main Dashboard Layout (Grid with Form + List) */}
      <main className="dashboard-layout">
        {/* Left: Task Creation Form framed with CardWrapper (props.children) */}
        <CardWrapper title="Create New Task" badge="Form">
          <TaskForm onAddTask={handleAddTask} />
        </CardWrapper>

        {/* Right: Task Collection and Filters framed with CardWrapper */}
        <CardWrapper
          title="Task Management"
          badge={`${filteredTasks.length} of ${tasks.length}`}
          action={
            (searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )
          }
        >
          <TaskList
            tasks={filteredTasks}
            totalTaskCount={tasks.length}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={handlePriorityFilterChange}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={handleCategoryFilterChange}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onClearFilters={handleClearFilters}
          />
        </CardWrapper>
      </main>

      {/* Legacy Class Component with full lifecycle methods */}
      <ActivityLogger
        latestActivity={latestActivity}
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onLogCountChange={setLogCount}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
