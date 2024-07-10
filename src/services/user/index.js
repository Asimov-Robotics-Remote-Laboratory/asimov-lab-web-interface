import http from '../config';

const url = '/user';

export default {
  listUsersByPage: (page, quantityPerPage) => {
    const pageParam = '/page/' + page;
    const quantityPerPageParam = '/quantityPerPage/' + quantityPerPage;
    return http.get(url + pageParam + quantityPerPageParam);
  },
  findUsersByNameOrEmail: (page, quantityPerPage,search) => {
    const pageParam = '/page/' + page;
    const quantityPerPageParam = '/quantityPerPage/' + quantityPerPage;
    const searchParam= '/searchParam/'+search;
    return http.get(url + pageParam + quantityPerPageParam+searchParam);
  },
  createUser: (user) => {
    return http.post(url, user);
  },
  findUserById: (id) => {
    return http.get(url+"/id/"+id);
  },
  removeUser:(id) => {
    return http.delete(url+"/id/"+id);
  },
  updateUser:(user) => {
    return http.put(url, user);
  },
  redefinePassword: (user) => {
    return http.put(url+"/redefine-password",user);
  }
}
