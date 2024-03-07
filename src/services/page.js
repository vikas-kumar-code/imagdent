import http from "./http";

const page = {
  add: params => http.post("/page/add", params),
  list: param => http.get("/page/list", { params: param }),
  getOne: param => http.get("/page/get-one", { params: param }),
  getOneByName: param => http.get("/page/get-by-name", { params: param }),
  delete: param => http.post("/page/delete", param),
  getParent: param => http.get("page/get-parent-pages", { params: param }),
  updateSequence: data => http.post("page/update-sequence", data),


  addFaq: params => http.post("faq/add", params),
  listFaq: param => http.get("faq/list", { params: param }),
  getOneFaq: param => http.get("faq/get-one", { params: param }),
  deleteFaq: param => http.post("faq/delete", param),
};

export default page;
