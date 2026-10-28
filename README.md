# Task Management & Activity Dashboard

> **Course:** Web Engineering / Frontend Development (CLO1 & CLO2)  
> **Assignment:** Advanced React Component Architecture & State Management  
> **Topic:** Task Management & Activity Dashboard (Integrating Legacy Class Components & Modern Functional Components with Hooks)

---

## 📌 Project Overview

This application is a responsive, single-page **Task Management & Activity Dashboard** built with **React** and styled using **pure Vanilla CSS** (no Tailwind CSS, no external icon libraries).

It cleanly integrates:
- **Legacy React Component Patterns**: Class Component (`ActivityLogger`) utilizing lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) and explicit `this.state` / `this.setState`.
- **Modern React Functional Patterns**: Functional Components powered by core React Hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`).
- **Flexible UI Architecture**: Reusable container components leveraging React Children (`props.children`).
- **Design System**: Dual-theme (Light & Dark) architecture using CSS Custom Properties and a persistent `ThemeContext`.

---

## 📂 Project Directory Structure

Adheres strictly to the mandated assignment specification:

```
src/
├── components/
│   ├── class/
│   │   └── ActivityLogger.jsx       <-- Legacy Class Component with full lifecycle methods
│   └── functional/
│       ├── CardWrapper.jsx          <-- Reusable container using props.children
│       ├── Header.jsx               <-- Application header with theme toggle & activity drawer
│       ├── MetricsSummary.jsx       <-- Real-time analytics cards & completion progress bar
│       ├── TaskCard.jsx             <-- Memoized task item (React.memo) with badges
│       ├── TaskForm.jsx             <-- Controlled form with useRef auto-focus
│       ├── TaskList.jsx             <-- Dynamic list with search, filter chips & empty states
│       └── ThemeToggle.jsx          <-- SVG theme toggle consuming ThemeContext
├── context/
│   └── ThemeContext.jsx             <-- Light/Dark theme provider (useContext)
├── hooks/
│   ├── useLocalStorage.js           <-- Custom hook for browser localStorage synchronization
│   └── useTaskMetrics.js            <-- Custom hook for calculating summary stats with useMemo
├── index.css                        <-- Pure Vanilla CSS with CSS custom properties
├── App.jsx                          <-- Root state manager & coordinator
└── main.jsx                         <-- React entry point
```

---

## 🎯 Detailed Requirement Coverage

### Task 1: Component-Based Architecture
- Modular breakdown into high-cohesion, low-coupling components (`Header`, `TaskCard`, `TaskList`, `TaskForm`, `MetricsSummary`, `ThemeToggle`, `CardWrapper`, `ActivityLogger`).
- Reusable and composable UI design.

### Task 2: Functional Components & Props
- **Primary Views**: `TaskForm`, `TaskList`, `TaskCard`, `Header` built as Functional Components.
- **Props & Callbacks**: Parent-to-child data flow and child-to-parent notification via callback props (`onAddTask`, `onToggleTask`, `onDeleteTask`, `onSearchChange`, etc.).
- **React Children (`props.children`)**: Reusable `CardWrapper` container wraps form, task list, and metrics with customizable headers, badges, and actions.

### Task 3: Class Components & Lifecycle Methods
- **`ActivityLogger` Component** (`src/components/class/ActivityLogger.jsx`):
  - Tracks user operations: Task additions, deletions, status toggles, and filter updates.
  - **`constructor(props)`**: Initializes `this.state = { logs: [], toast: null, filter: 'all' }` and binds event methods explicitly.
  - **`componentDidMount()`**:
    - Retrieves initial activity log history stored in browser `localStorage`.
    - Binds global keyboard event listener (`Escape` key to close drawer).
  - **`componentDidUpdate(prevProps, prevState)`**:
    - Compares `prevProps.latestActivity` with `this.props.latestActivity`.
    - Updates local state using `this.setState()`.
    - Persists newly added logs to `localStorage`.
    - Dispatches a temporary visual toast notification with a clean auto-dismiss timer.
  - **`componentWillUnmount()`**:
    - Cleans up active toast timeout timers to prevent memory leaks.
    - Unsubscribes from window keyboard listeners.
  - **Explicit State Management**: Uses `this.state` and `this.setState()` exclusively.

### Task 4: JSX vs. JavaScript Logic
- **Dynamic JavaScript Expressions (`{ ... }`)**: Embedded throughout JSX for timestamps, computed counts, progress percentages, and labels.
- **Conditional Rendering**:
  - Ternary operators (`{task.completed ? ... : ...}`, `{theme === 'light' ? ... : ...}`).
  - Logical short-circuiting (`&&`) for empty states, overdue badges, error hints, and action buttons.
- **Array Rendering**: Rendered using `Array.prototype.map()` with unique keys (`task.id`).
- **Synthetic Events**: Handled via `onClick`, `onChange`, `onSubmit`, and `onKeyDown`.

### Task 5: React Hooks Mastery
| Hook | Implementation in Project |
| :--- | :--- |
| **`useState`** | Manages task collection, input form fields (`title`, `description`, `priority`, `category`, `dueDate`), and search/status/priority filters. |
| **`useEffect`** | Synchronizes state with `localStorage` and dynamically updates `document.title` to reflect pending tasks (`Tasks (2 pending) - Task Dashboard`). |
| **`useContext`** | `ThemeContext` provides global light/dark theme toggling across components without prop-drilling. |
| **`useRef`** | Automatically shifts focus to the title input upon component mount and immediately after submitting task data. |
| **`useMemo`** | Optimizes task filtering & searching calculations and metric statistics to prevent redundant computations. |
| **`useCallback`** | Optimizes callback references (`handleAddTask`, `handleToggleTask`, `handleDeleteTask`) passed to children wrapped in `React.memo`. |

---
