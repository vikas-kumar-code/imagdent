import http from "./http";

const plan = {
  add: data => http.post("/plan/add", data),
  getOne: param => http.get("/plan/get", { params: param }),
  list: param => http.get("/plan/list", { params: param }),
  delete: data => http.post("/plan/delete", data)
};

export default plan;
