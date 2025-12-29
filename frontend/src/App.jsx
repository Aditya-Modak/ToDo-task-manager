import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCheck, FaUndo, FaSearch, FaSyncAlt, FaEdit, FaCalendarAlt, FaFlag } from "react-icons/fa";
import { fetchTodos,createTodo, removeTodo, updateTodo, toggleTodo } from "./services/api.js";
import "./App.css";
import axios from "axios";

//const API_URL = "http://localhost:3000/api/todos";
const BACKUP_KEY = "todo_backup";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

 const loadTodos = async () => {
  setLoading(true);
  try {
    const res = await fetchTodos();
    setTodos(res.data ?? []); // safe unpack
    setError("");
  } catch {
    setError("Failed to load todos");
    setTodos([]);
  } finally {
    setLoading(false);
  }
};
;

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Title is required!");
      return;
    }

    setError("");
    const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);

    try {
      const newTodo = await createTodo({ title, description, dueDate, priority, category, tags: tagList, completed: false });
      setTodos([newTodo, ...todos]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setCategory("general");
      setTags("");
    } catch {
      setError("Failed to create todo.");
    }

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
    await removeTodo(id);
    setTodos(todos.filter(t => t._id !== id));
    setError("");
  } catch {
    setError("Delete failed");
  }

  };

  const openEdit = (todo) => {
    setEditData({ ...todo });
  };

  const submitEdit = async () => {
    try {
      const updated = await updateTodo(editData._id, editData);
      setTodos(todos.map(t => t._id === updated._id ? updated : t));
      setEditData(null);
    } catch {
      setError("Failed to update todo.");
    }

    try {
      const res = await axios.patch(`${API_URL}/${editData._id}`, { completed: !editData.completed });
      setTodos(todos.map(t => t._id === editData._id ? res.data : t));
    } catch {
      setError("Update failed");
    }
  };

  const handleToggle = async (todoId) => {
  if (!todoId) {
    console.error("Toggle received invalid ID:", todoId);
    setError("Invalid task ID");
    return;
  }

  try {
    const res = await toggleTodo(todoId);
    setTodos(todos.map(t => t._id === todoId ? res.data : t));
  } catch (err) {
    console.error("Toggle failed:", err.response?.data || err.message);
    setError("Failed to update status");
  }
};

  const filteredTodos = (todos ?? []).filter(todo => {
  const t = todo?.title ?? "";
  const d = todo?.description ?? "";

  const matchText = 
    t.toLowerCase().includes(query.toLowerCase()) ||
    d.toLowerCase().includes(query.toLowerCase());

  const matchStatus =
    filter === "all" ? true :
    filter === "active" ? !todo.completed :
    todo.completed;

  return matchText && matchStatus;
});

  if (loading) return <div className="container text-gray-500 text-lg font-semibold">Loading tasks…</div>;

  return (
    <div className="container">

      {/* TITLE */}
      <motion.h1 className="appTitle" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}>
        Todo Task Manager
      </motion.h1>

      {/* ERROR */}
      {error && <motion.div className="errorBanner" initial={{opacity:0}} animate={{opacity:1}}>
        <FaFlag className="mr-1"/> {error}
      </motion.div>}

      {/* SEARCH */}
      <div className="inputBox">
        <FaSearch className="text-blue-500 text-sm"/>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." />
        <button onClick={loadTodos}><FaSyncAlt/></button>
      </div>

      {/* ADD FORM */}
      <div className="formCard">
        <input className="inputMain" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter todo title..." maxLength={200}/>
        <textarea className="inputMain descBox" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." maxLength={2000}/>
        <div className="flex gap-2 items-center">
          <FaCalendarAlt className="text-gray-500 text-xs"/>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="inputMain text-xs"/>
        </div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="inputMain text-xs font-semibold">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="inputMain text-xs font-semibold">
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="urgent">Urgent</option>
        </select>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Add tags (comma separated)" className="inputMain text-xs"/>
        <button onClick={handleAdd} className="btnMain"><FaCheck/> Add Task</button>
      </div>

      {/* FILTER PANEL */}
      <div className="filterPanel">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "filterBtn activeFilter" : "filterBtn"}
          >
            {f === "all" && "All Tasks"}
            {f === "active" && "Active Tasks"}
            {f === "completed" && "Completed Tasks"}
          </button>
        ))}
      </div>

      {/* LIST */}
      <main className="todoGrid">
        <AnimatePresence>
          {filteredTodos.map(todo => (
            <motion.section
              key={todo._id}
              className={`todoCard ${todo.priority}`}
              initial={{opacity:0,scale:0.97,y:8}}
              animate={{opacity:1,scale:1,y:0}}
              transition={{duration:0.15}}
            >
              <div className="cardHead">
                <h3 className={todo.completed ? "doneText" : ""}>{todo.title}</h3>
                <span className="dateText">{new Date(todo.createdAt).toLocaleDateString()}</span>
              </div>

              {todo.description && <p className="descText">{todo.description}</p>}

              {/* TAGS */}
              {todo.tags && todo.tags.length > 0 && (
                <div className="tagRow">
                  {todo.tags.map((tag,i)=>(<span key={i} className="tagBadge">{tag}</span>))}
                </div>
              )}

              {/* CATEGORY + DUE */}
              <div className="categoryRow">
                <span className="categoryBadge">{todo.category}</span>
                {todo.dueDate && <span className="dueBadge"><FaCalendarAlt/> {new Date(todo.dueDate).toLocaleDateString()}</span>}
              </div>

              {/* ACTIONS */}
              <div className="cardActions">
                <button onClick={() => openEdit(todo)} className="cardBtn"><FaEdit/> Edit</button>
                <button onClick={() => handleToggle(todo._id)} className="cardBtn">
                  {todo.completed ? <FaUndo/> : <FaCheck/>} {todo.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => handleDelete(todo._id)} className="cardBtn delete"><FaTrash/> Delete</button>
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && <div className="emptyState">No matching todos</div>}
      </main>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editData && (
          <motion.div className="modalBackdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div className="modalCard" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}>
              <h2 className="modalTitle">Edit Todo</h2>
              <input className="inputMain" value={editData.title} onChange={(e)=>setEditData({...editData,title:e.target.value})}/>
              <textarea className="inputMain descBox" value={editData.description} onChange={(e)=>setEditData({...editData,description:e.target.value})}/>
              <div className="modalActions">
                <button onClick={()=>setEditData(null)} className="cardBtn delete">Cancel</button>
                <button onClick={submitEdit} className="cardBtn">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
