import React from "react";
import { updateTodo, deleteTodo } from "../services/api";

export default function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = async () => {
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed });
      onToggle(updated);
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo._id);
      onDelete(todo._id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <article
      className={`border p-4 rounded-2xl shadow-sm transition-all hover:shadow-md ${
        todo.completed ? "opacity-60 bg-gray-100 line-through" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{todo.title}</h3>
          {todo.description && (
            <p className="text-gray-600 text-sm mt-1 max-h-40 overflow-auto">
              {todo.description}
            </p>
          )}
        </div>

        <span className="text-xs text-gray-400">
          {new Date(todo.createdAt).toDateString()}
        </span>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleToggle}
          className="flex-1 py-2 text-sm font-medium rounded-xl border border-gray-800 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.97]"
        >
          {todo.completed ? "Undo" : "Complete"}
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 py-2 text-sm font-medium rounded-xl border border-gray-800 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.97]"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
