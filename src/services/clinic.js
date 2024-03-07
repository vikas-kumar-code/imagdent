import http from "./http";

const clinic = {
  add: data => http.post("/clinic/add", data),
  getOne: param => http.get("/clinic/get-one", { params: param }),
  list: param => http.get("/clinic/list", { params: param }),
  delete: data => http.post("/clinic/delete", data),
  deleteDocument: data => http.post("/clinic/delete-document", data),
  getZipDetails: (param) => http.get("clinic/search-zipcode", { params: param })
};

export default clinic;
