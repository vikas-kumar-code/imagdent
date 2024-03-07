import http from "./http";

const category = {
  list: searchKey => http.get("/category/list", searchKey),
  get: id =>
    http.get("/category/get", {
      params: {
        id: id
      }
    }),
  save: category => http.post("/category/add", category),
  delete: id => http.post("/category/delete", id),
  saveUserIssues: issues => http.post("/category/save-user-issues", issues)
};

export default category;
