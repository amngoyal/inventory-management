import axios from 'axios';

const instance = axios({
    baseURL: 'http://localhost:5000'
})

export default instance;