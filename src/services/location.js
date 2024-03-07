import http from "./http";

const location = {
    add: data => http.post("/location/add", data),
    getOne: param => http.get("/location/get-one", { params: param }),
    list: param => http.get("/location/list", { params: param }),
    deleteLocation: data => http.post("/location/delete-location", data),
    getZipDetails: (param) => http.get("patient/search-zipcode", { params: param }),//have to change into location

};

export default location;
