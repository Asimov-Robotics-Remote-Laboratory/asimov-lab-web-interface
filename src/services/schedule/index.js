import http from '../config';

const url = '/schedule';

export default {
    listAllSchedules: () => {
        return http.get(url+'/all');
    },
    listUserSchedules: () => {
      return http.get(url);
    },
    listLaboratorySchedules: (laboratoryId) => {
      return http.get(url+"/laboratoryId/"+laboratoryId);
    },
    createSchedule: (schedule) => {
        return http.post(url, schedule);
    },
    updateSchedule: (schedule) => {
        return http.put(url, schedule);
    },
    removeSchedule(id) {
        return http.delete(url+"/id/"+id);
    },
    removeAllSchedules() {
      return http.delete(url);
    }
}
