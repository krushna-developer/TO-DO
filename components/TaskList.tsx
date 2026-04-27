"use client";

import { useTaskStore } from "@/store/useTaskStore";
import TaskItem from "@/components/TaskItem";
import EmptyState from "@/components/EmptyState";

export default function TaskList() {
  // Select raw tasks + filter separately so Zustand re-renders on every change
  const tasks = useTaskStore((s) => s.tasks);
  const filter = useTaskStore((s) => s.filter);

  const visibleTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  if (visibleTasks.length === 0) {
    return <EmptyState hasFilter={filter !== "all"} />;
  }

  return (
    <div className="flex flex-col w-full">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
