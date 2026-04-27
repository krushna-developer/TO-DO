import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskFilter = "all" | "active" | "completed";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TaskStore {
  tasks: Task[];
  filter: TaskFilter;
  editingId: string | null;

  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, text: string) => void;
  setFilter: (filter: TaskFilter) => void;
  setEditingId: (id: string | null) => void;

  filteredTasks: () => Task[];
  activeCount: () => number;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: "all",
      editingId: null,

      addTask: (text) => {
        if (!text.trim()) return;
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              text: text.trim(),
              completed: false,
              createdAt: Date.now(),
            },
          ],
        }));
      },

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      updateTask: (id, text) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, text: text.trim() } : t
          ),
          editingId: null,
        })),

      setFilter: (filter) => set({ filter }),
      setEditingId: (id) => set({ editingId: id }),

      filteredTasks: () => {
        const { tasks, filter } = get();
        if (filter === "active") return tasks.filter((t) => !t.completed);
        if (filter === "completed") return tasks.filter((t) => t.completed);
        return tasks;
      },

      activeCount: () => get().tasks.filter((t) => !t.completed).length,
    }),
    {
      name: "task-store",
    }
  )
);
