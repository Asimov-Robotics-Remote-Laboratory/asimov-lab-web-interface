import http from '../config'

const url = "user/authenticate"
export default async (user) => {
  return http.post(url, user);
}
