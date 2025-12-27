import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/todos" });

// GET all todos
export const fetchTodos = async () => {
  const res = await API.get("/");
  return res.data;
};

// CREATE new todo (title + description)
export const createTodo = async (todo) => {
  const res = await API.post("/", {
    title: todo.title,
    description: todo.description || "",
    completed: false,
  });
  return res.data;
};

// UPDATE todo by ID (PATCH)
export const updateTodo = async (id, data) => {
  const res = await API.patch(`/${id}`, data);
  return res.data;
};

// DELETE todo
export const removeTodo = async (id) => {
  await API.delete(`/${id}`);
  return id;
};

// Toggle complete (calls the correct backend toggle endpoint)
export const toggleTodo = async (id, currentStatus) => {
  const res = await API.patch(`/${id}/toggle`);
  return res.data;
};

export default API;
