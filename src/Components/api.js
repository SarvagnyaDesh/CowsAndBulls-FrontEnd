import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cowsandbullswebgame.onrender.com', // Replace with your backend URL
});

export default api;
