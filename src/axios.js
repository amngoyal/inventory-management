import axios from 'axios';

const baseURL = "https://inventorybackend0.herokuapp.com/";

const instance = axios.create({
    baseURL: baseURL
});

export default instance;
