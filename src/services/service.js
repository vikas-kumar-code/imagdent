import http from "./http";

const service = {
  add: data => http.post("/service/add", data),
  getOne: param => http.get("/service/get-one", { params: param }),
  list: param => http.get("/service/list", { params: param }),
  delete: data => http.post("/service/delete", data),
  addLocationPrice: data => http.post("/service/add-price", data),
  getLocationPrice: param => http.get("/service/get-price", { params: param }),
  updateAppearance: data => http.post("/service/update-appearance", data),
};

export default service;
