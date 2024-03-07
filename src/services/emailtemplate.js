import http from "./http";

const emailtemplate = {
    add: params => http.post("/template/add", params),
    list: param => http.get("/template/list", { params: param }),
    getOne: param => http.get("/template/get", { params: param }),
    delete: param => http.post("/template/delete", param)
};

export default emailtemplate;
