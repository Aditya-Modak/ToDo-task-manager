import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // added import
import { FaTrash, FaCheck, FaUndo, FaFlag, FaCalendarAlt } from "react-icons/fa";
import "./App.css";

const API_URL = "http://localhost:3000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Title is required!");
      return;
    }
    setError("");
    try {
      const res = await axios.post(API_URL, { title, description, priority, dueDate: dueDate || null });
      setTodos([res.data, ...todos]);
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
    } catch {
      setError("Could not add task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  const handleToggle = async (todo) => {
    try {
      const res = await axios.patch(`${API_URL}/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
    } catch {
      setError("Update failed");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (loading) {
    return <p className="statusMsg">Loading tasks…</p>;
  }

  return (
    <div id="root">

      {/* ===== HEADER PANEL ===== */}
      <motion.h1 className="appTitle" initial={{opacity:0}} animate={{opacity:1}}>
        Todo Task Manager
      </motion.h1>

      {/* ===== FILTER PANEL ===== */}
      <div className="filterPanel">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "filterBtn activeFilter" : "filterBtn"}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {error && (
        <motion.div className="errorBanner" initial={{opacity:0}} animate={{opacity:1}}>
          <FaFlag className="mr-1"/> {error}
        </motion.div>
      )}

      {/* ===== INPUT FORM ===== */}
      <section className="formCard">

        <input
          className="inputMain"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter professional task title..."
        />

        <textarea
          className="inputMain descBox"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a clear task description..."
        />

        {/* Priority + Due Date */}
        <div className="formRow">

          {/* Priority Selector */}
          <div className="priorityBox">
            <FaFlag/>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="dateBox">
            <FaCalendarAlt/>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

        </div>

        <button onClick={handleAdd} className="btnMain">Add Task</button>

      </section>

      {/* ===== TODO LIST GRID ===== */}
      <main className="todoGrid">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.article
              key={todo._id}
              className={`todoCard ${todo.priority}`}
              initial={{opacity:0,y:10}}
              animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-10}}
            >

              <header className="cardHead">
                <h3 className={todo.completed ? "doneText" : ""}>{todo.title}</h3>
                {todo.dueDate && <span className="badge due"><FaCalendarAlt/> {new Date(todo.dueDate).toLocaleDateString()}</span>}
              </header>

              <p className="descText">{todo.description}</p>

              {/* Priority Badge */}
              <div className="badgeRow">
                {todo.priority === "high" && <span className="badge high"><FaFlag/> High</span>}
                {todo.priority === "medium" && <span className="badge medium"><FaFlag/> Medium</span>}
                {todo.priority === "low" && <span className="badge low"><FaFlag/> Low</span>}
              </div>

              {/* ACTION BUTTONS */}
              <div className="cardActions">
                <button onClick={() => handleToggle(todo)} className="cardBtn">
                  {todo.completed ? <FaUndo/> : <FaCheck/>} {todo.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => handleDelete(todo._id)} className="cardBtn delete">
                  <FaTrash/> Delete
                </button>
              </div>

            </motion.article>
          ))}
        </AnimatePresence>
      </main>

      {/* Footer text removed as requested */}

    </div>
  );
}
