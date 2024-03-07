import http from "./http";

const patient = {
    add: data => http.post("/patient/add", data),
    getOne: param => http.get("/patient/get", { params: param }),
    list: param => http.get("/patient/list", { params: param }),
    search: param => http.get("/patient/search", { params: param }),
    delete: data => http.post("/patient/delete", data),
    deleteDocument: data => http.post("/patient/delete-document", data),
    addImage: data => http.post("/common/upload-patient-image", data),

    addDocumentType: data => http.post("/documenttype/add", data),
    getDocumentType: param => http.get("/documenttype/get", { params: param }),
    getDocumentTypes: param => http.get("/documenttype/list", { params: param }),
    deleteDocumentType: data => http.post("/documenttype/delete", data),
    savePatientDocument: data => http.post("/common/save-patient-document", data),
    doRefer: data => http.post("/patient/do-refer", data),
    getReferral: param => http.get("/patient/get-referral", { params: param }),
    getReferrals: param => http.get("/referral/list", { params: param }),
    getDayReferral: param => http.get("/schedule/get-day-referral", { params: param }),
    getZipDetails: (param) => http.get("patient/search-zipcode", { params: param }),
};

export default patient;
