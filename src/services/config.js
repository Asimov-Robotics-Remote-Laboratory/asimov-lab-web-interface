import axios from 'axios'
import {authenticationStore} from "@/store/authentication";

const http = axios.create({
    baseURL: "http://localhost:5000/ws/"
});

http.interceptors.request.use(config => {
    const store =  authenticationStore();
    const user = store.authenticatedUser;
    if (user && user.token) {
        config.headers['x-auth-token'] = user.token;
    }
    return config;
});

http.interceptors.response.use(response => {
    return response.data;
}, config => {
    throw config.response;
});
export default http;
