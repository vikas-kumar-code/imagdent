import http from "./http";

const setting = {
  addBanner: (params) => http.post("/settings/add-banner", params),
  listBanners: (param) => http.get("/settings/list-banners", { params: param }),
  getBanner: (param) => http.get("/settings/get-banner", { params: param }),
  deleteBanner: (param) => http.post("/settings/delete-banner", param),
  updateSequence: (param) => http.post("/settings/update-sequence", param),
};

export default setting;
