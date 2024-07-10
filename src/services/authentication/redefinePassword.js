import http from '../config'

const url = "user/redefine-password"

export default async (password) =>{
    const data = {
        password : password
    };
    return http.put(url,data);
}

