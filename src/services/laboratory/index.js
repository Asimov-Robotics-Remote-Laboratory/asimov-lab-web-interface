import http from '../config';

const url = '/laboratory';

export default {
    listLaboratoriesByPage: (page, quantityPerPage) => {
        const pageParam = '/page/' + page;
        const quantityPerPageParam = '/quantityPerPage/' + quantityPerPage;
        return http.get(url + pageParam + quantityPerPageParam);
    },
    createLaboratory: (laboratory) => {
        return http.post(url, laboratory);
    },
    updateLaboratory: (laboratory) => {
        return http.put(url, laboratory);
    },
    findLaboratoryById: (id) => {
        return http.get(url + "/id/"+id);
    },
    useLaboratory: (id) => {
        return http.get(url + "/use/id/"+id);
    },
    releaseLaboratory: (id) => {
        return http.get(url + "/release/id/"+id);
    },
    removeLaboratory(id) {
        return http.delete(url+"/id/"+id);
    }
}
