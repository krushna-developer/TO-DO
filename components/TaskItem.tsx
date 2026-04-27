"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskStore, type Task } from "@/store/useTaskStore";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const editingId = useTaskStore((s) => s.editingId);
  const setEditingId = useTaskStore((s) => s.setEditingId);

  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingId === task.id;
  // track whether mouse is down on the save button to prevent onBlur cancel
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      setEditText(task.text);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditText(task.text);
    setEditingId(task.id);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) updateTask(task.id, editText.trim());
    else setEditingId(null);
    isSavingRef.current = false;
  };

  // Only cancel via blur if the save button didn't trigger it
  const handleBlur = () => {
    if (!isSavingRef.current) {
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <div
      className={cn(
        "group flex max-w-xl w-full mx-auto items-center gap-6 px-4 py-3.5 rounded-xl",
        "bg-white dark:bg-[#1E2939] border border-slate-200 dark:border-white/5",
        "transition-colors duration-300 mt-4 hover:border-slate-300 dark:hover:border-white/10",
        task.completed && "opacity-70"
      )}
    >
      {/* Checkbox — always has a visible border */}
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className={cn(
          "w-4 h-41 rounded-sm shrink-0 dark:border-[#FFFFFF] border-2 transition-colors",
          task.completed
            ? "bg-slate-900 border-slate-900 text-white dark:bg-black dark:border-white dark:text-white data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-black dark:data-[state=checked]:border-black"
            : "border-slate-300 dark:border-[#FFFFFF] bg-transparent"
        )}
      />

      {/* Task text / edit input */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="h-8 bg-transparent border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm px-2 py-0 focus-visible:ring-sky-500"
          />
        ) : (
          <span
            className={cn(
              "text-sm text-slate-900 dark:text-white truncate block transition-colors duration-300",
              task.completed && "line-through text-slate-500 dark:text-slate-400"
            )}
          >
            {task.text}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 transition-opacity shrink-0">
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => (isSavingRef.current = true)}
            onClick={handleSaveEdit}
            className="w-7 h-7 text-green-400 hover:text-green-300 hover:bg-green-400/10"
          >
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStartEdit}
            className="w-7 h-7 text-slate-400 dark:text-[#FFFFFF] hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="w-7 h-7 text-slate-400 dark:text-[#FFFFFF] hover:text-red-400 hover:bg-red-400/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
