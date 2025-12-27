import { useState } from "react";
import { addTodo } from "../services/api";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const MAX_TITLE = 200;
  const MAX_DESC = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (cleanTitle.length === 0) {
      setError("A title is required to create a todo item.");
      return;
    }

    if (cleanTitle.length > MAX_TITLE) {
      setError(`Title must be under ${MAX_TITLE} characters.`);
      return;
    }

    if (cleanDesc.length > MAX_DESC) {
      setError(`Description must be under ${MAX_DESC} characters.`);
      return;
    }

    setLoading(true);
    try {
      const newTodo = await addTodo({
        title: cleanTitle,
        description: cleanDesc,
        completed: false,
      });

      onAdd(newTodo);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Unable to save the todo item. Please check your connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center py-8">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-gray-300">
        
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create a New Todo</h2>
          <p className="text-gray-600 text-sm mt-1">
            Fill out the details below to add a task to your list. Titles are mandatory.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-medium text-gray-800 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Learn React"
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              disabled={loading}
              maxLength={MAX_TITLE}
            />
            <small className="text-gray-500 text-xs mt-1">
              {cleanTitle.length}/{MAX_TITLE} characters
            </small>
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-800 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context about your task..."
              className="border border-gray-300 p-3 rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              disabled={loading}
              maxLength={MAX_DESC}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <small className="text-gray-500 text-xs mt-1">
              {description.length}/{MAX_DESC} characters
            </small>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving task..." : "Save Todo"}
            </button>
          </div>

        </form>

        <footer className="text-gray-500 text-xs text-center mt-4">
          Your data is stored securely in the database and will persist across sessions.
        </footer>

      </div>
    </section>
  );
}
