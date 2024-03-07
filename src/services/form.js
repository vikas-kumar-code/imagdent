import http from "./http";

const form = {
  addForm: (data) => http.post("/forms/add", data),
  list: (param) => http.get("/forms/list", { params: param }),
  getOne: param => http.get("/forms/get", { params: param }),
  delete: (data) => http.post("/forms/delete", data),
};

export default form;