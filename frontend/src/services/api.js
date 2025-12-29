import axios from "axios";

const API = axios.create({ baseURL: "https://todo-backend-euoz.onrender.com" });


// GET all todos
export const fetchTodos = async () => {
  const res = await API.get("/");
  return res.data;
};

// CREATE new todo
export const createTodo = async (todo) => {
  const res = await API.post("/", {
    title: todo.title,
    description: todo.description || "",
    completed: false,
  });
  return res.data;
};

// UPDATE todo
export const updateTodo = async (id, data) => {
  const res = await API.patch(`/${id}`, data);
  return res.data;
};

// DELETE todo
export const removeTodo = async (id) => {
  await API.delete(`/${id}`);
  return id;
};

// TOGGLE complete/incomplete
export const toggleTodo = async (id, currentStatus) => {
  const res = await API.patch(`/${id}`, { completed: !currentStatus });
  return res.data;
};

export default API;
