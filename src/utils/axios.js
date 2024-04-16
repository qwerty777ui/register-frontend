import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const appAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default appAxios;
