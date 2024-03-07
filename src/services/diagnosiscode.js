import http from "./http";

const diagnosis = {
  add: data => http.post("/diagnosis/add", data),
  getOne: param => http.get("/diagnosis/get-one", { params: param }),
  list: param => http.get("/diagnosis/list", { params: param }),
  deleteDiagnosisCode: data => http.post("/diagnosis/delete-diagnosis", data)
};

export default diagnosis;
