import http from '../config'

const url = '/code';

export default {
    listUserCodes: () => {
        return http.get(url);
    },
    createCode: (code) => {
        return http.post(url, code);
    },
    findCodeById: (id) => {
        return http.get(url + "/id/"+id);
    },
    getLastUserCode: (laboratoryId) => {
        return http.get(url + "/last/laboratoryId/"+laboratoryId);
    },
    updateCode:(code) =>{
        return http.put(url, code);
    },
    removerCode:(id) =>{
        return http.delete(url + "/id/"+id);
    }
}
