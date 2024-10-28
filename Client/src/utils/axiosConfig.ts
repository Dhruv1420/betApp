import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // backend API base URL
  withCredentials: true,
});

export default instance;
