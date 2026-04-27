"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";

export default function AddTaskInput() {
  const [inputValue, setInputValue] = useState("");
  const addTask = useTaskStore((s) => s.addTask);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addTask(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex gap-3 w-full max-w-xl mx-auto">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your task here.."
        className="
          bg-white dark:bg-[#364153]
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-[#A9A9A9]
          border border-slate-200 dark:border-transparent
          focus-visible:ring-0 focus-visible:ring-offset-0
          focus-visible:border-slate-300 dark:focus-visible:border-transparent
          h-11 transition-colors duration-300
        "
      />
      <Button
        onClick={handleAdd}
        disabled={!inputValue.trim()}
        style={{ backgroundColor: "#4A5565" }}
        className="text-white h-11 px-5 gap-2 font-medium shrink-0 hover:opacity-90 disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        Add
      </Button>
    </div>
  );
}
