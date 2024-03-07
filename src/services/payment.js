import http from "./http";

const payment = {
  list: param => http.get("/payment/list", { params: param }),
};

export default payment;
