import http from "./http";

const tmtsummarytemplate = {
    add: params => http.post("/tmt-summary-template/add", params),
    list: param => http.get("/tmt-summary-template/list", { params: param }),
    getOne: param => http.get("/tmt-summary-template/get", { params: param }),
    delete: param => http.post("/tmt-summary-template/delete", param)
};

export default tmtsummarytemplate;
