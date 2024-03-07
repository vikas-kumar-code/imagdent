import http from "./http";

const role = {
    add: data => http.post("/role/add", data),
    getOne: param => http.get("/role/get", { params: param }),
    list: param => http.get("/role/list", { params: param }),
    delete: data => http.post("/role/delete", data),
    getModules: param => http.get("/role/get-modules", { params: param }),
    getModulesByRole: param => http.get("/role/get-modules-by-role", { params: param }),
    getActions: param => http.get("/role/get-actions", { params: param }),
    assignPermission: data => http.post("/role/assign-permission", data),
    getPermission: param => http.get("/role/get-permission", { params: param }),
};

export default role;
