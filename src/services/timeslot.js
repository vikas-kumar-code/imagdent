import http from "./http";

const timeslot = {
    add: params => http.post("/slot/add", params),
    getSlots: param => http.get("/slot/list", { params: param }),
    getOne: param => http.get("/slot/get", { params: param }),
    deleteSlot: param => http.post("/slot/delete", param)
};

export default timeslot;
