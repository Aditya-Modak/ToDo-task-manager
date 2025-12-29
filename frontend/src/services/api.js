import axios from "axios";


const api = axios.create({
  baseURL: "https://todo-backend-euoz.onrender.com/api/todos",
  timeout: 15000,
});

const  API = axios.create({ baseURL: "http://localhost:3000/api/todos" });


export const getTodos = () => API.get("/");
export const addTodo = (todo) => API.post("/", todo);
export const editTodo = (id, data) => API.patch(`/${id}`, data);
export const deleteTodo = (id) => API.delete(`/${id}`);
export const toggleTodo = (id) => API.patch(`/${id}/toggle`);

export default API;
