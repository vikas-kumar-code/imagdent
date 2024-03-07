import http from "./http";

const account = {
  saveProfile: data => http.post("/account/save-profile", data),
  getProfile: param => http.get("/account/get-profile", { params: param }),
  getIssues: () => http.get("/category/list"),
  cropAvtar: data => http.post("/account/crop-avtar", data),
  changePassword: data => http.post("/user/change-password", data),
  getNotificationSettings: data =>
    http.post("/account/get-notification-settings", data),
  saveNotificationSettings: data =>
    http.post("/account/save-notification-settings", data)
};

export default account;
