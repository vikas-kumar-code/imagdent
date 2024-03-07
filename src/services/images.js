import http from "./http";

const images = {
  addimages: data => http.post("common/upload-multiple-images", data),
  list: param => http.get("page/get-images", { params: param }),
  delete: data => http.post("page/delete-image", data),

};

export default images;
