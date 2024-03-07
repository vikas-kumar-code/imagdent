import http from "./http";

const company = {
    add: data => http.post("/company/add", data),
    getOne: param => http.get("/company/get", { params: param }),
    list: param => http.get("/company/list", { params: param }),
    delete: data => http.post("/company/delete", data)
};

export default company;
