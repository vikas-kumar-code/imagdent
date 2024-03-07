import http from "./http";

const referral = {
    getOne: param => http.get("/referral/get", { params: param }),
    list: param => http.get("/referral/list", { params: param }),
    delete: data => http.post("/referral/delete", data),
    getRejectedReferrals: param => http.get("/referral/rejected-referrals", { params: param }),
    getPendingApprovals: param => http.get("/referral/pending-approvals", { params: param }),
    approve: data => http.post("/referral/approve", data),
    reject: data => http.post("/referral/reject", data),
    discard: data => http.post("/referral/discard", data),
    changeStatus: data => http.post("/referral/change-status", data),
};

export default referral;
