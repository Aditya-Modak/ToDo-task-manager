import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-backend-euoz.onrender.com/api/todos",
  timeout: 15000,
});

export const getTodos = () => API.get("/");
export const addTodo = (todo) => API.post("/", todo);
export const editTodo = (id, data) => API.patch(`/${id}`, data);
export const deleteTodo = (id) => API.delete(`/${id}`);
export const toggleTodo = (id) => API.patch(`/${id}/toggle`);

export default API;
