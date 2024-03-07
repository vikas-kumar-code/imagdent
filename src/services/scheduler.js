import http from "./http";

const scheduler = {
  add: (data) => http.post("/scheduler/save-un-availability", data),
  list: (param) => http.get("/scheduler/get-un-availability", { params: param }),
  getCaseList: (param) => http.get("/scheduler/get-case-list", { params: param }),
  getOne: (param) => http.get("/scheduler/get-blocked-list", { params: param }),
  delete: (data) => http.post("/scheduler/delete-un-availability", data),
};

export default scheduler;
