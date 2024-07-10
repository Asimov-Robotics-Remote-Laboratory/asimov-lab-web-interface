import http from '../config'

const url = "user/reset-password"

export default async (email) =>{
    const data = {
        email : email
    };
    return http.put(url,data);
}

