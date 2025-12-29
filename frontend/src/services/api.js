import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-backend-euoz.onrender.com/api/todos", // direct deployed backend
  timeout: 15000,
});

export const fetchTodos = () => API.get(""); 
export const createTodo = (todo) => API.post("", todo);
export const updateTodo = (id, data) => API.patch(`/${id}`, data);
export const removeTodo = (id) => API.delete(`/${id}`);
export const toggleTodo = (id) => API.patch(`/${id}/toggle`);

export default API;