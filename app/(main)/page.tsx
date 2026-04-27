"use client";

import AddTaskInput from "@/components/AddTaskInput";
import FilterTabs from "@/components/FilterTabs";
import TaskList from "@/components/TaskList";
import { useTaskStore } from "@/store/useTaskStore";
export default function TasksPage() {
  const hasTasks = useTaskStore((s) => s.tasks.length > 0);

  return (
    <main className="flex-1 bg-white dark:bg-[#101828] flex flex-col px-4 py-1 w-full transition-colors duration-300">
      
      <h1 className="text-3xl font-medium text-slate-900 dark:text-white mb-8 tracking-tight text-center">
        My Tasks
      </h1>

      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto">
        <AddTaskInput />

        {hasTasks && <FilterTabs />}

        <TaskList />
      </div>

      {/* Footer */}
      <p className="text-[#6A7282] text-xs text-center py-4">
    © 2025
  </p>
    </main>
  );}
  