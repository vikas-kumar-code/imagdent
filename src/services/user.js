import http from "./http";

const user = {
  add: data => http.post("/user/add", data),
  addRefferingUser: data => http.post("/user/signup",data),
  getOne: param => http.get("/user/get", { params: param }),
  getZipDetails: param => http.get("user/search-zipcode", { params: param }),
  list: param => http.get("/user/list", { params: param }),
  delete: data => http.post("/user/delete", data),
  deleteDocument: data => http.post("/user/delete-document", data),
  changeDefaultLocation: data => http.post("user/change-default-location",data),
  logOut: data => http.post('user/logout',data)
};

export default user;
