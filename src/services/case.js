import http from "./http";

const ccase = {
  add: data => http.post("/case/add", data),
  getCaseDetails: param =>
    http.get("/case/get-case-details", { params: param }),
  list: param => http.get("/case/list", { params: param }),
  delete: data => http.post("/case/delete", data),
  addTeam: data => http.post("/case/add-team", data),
  addDocuments: data => http.post("/case/add-documents", data),
  deleteDocument: data => http.post("/case/delete-document", data),
  getServiceDetails: param =>
    http.get("/case/get-selected-service-detail", { params: param }),
  changePayee: data => http.post("/case/change-payee", data),
  addService: data => http.post("/case/add-service", data),
  addDiscount: data => http.post("/case/add-discount", data),
  addNote: data => http.post("/case/add-note", data),
  getNotes: param => http.get("/case/get-notes", { params: param }),
  deleteNote: param => http.get("/case/delete-note", { params: param }),
  deleteService: param => http.get("/case/delete-service", { params: param }),
  receivePayment: data => http.post("/case/receive-payment", data),
  removePayment: data => http.post("/case/remove-payment", data),
  getPayments: param => http.get("/case/get-payments", { params: param }),
  getLogs: param => http.get("/case/get-logs", { params: param }),
  printActivities: param =>
    http.get("/case/print-activities", { params: param }),
  changeStatus: data => http.post("/case/change-status", data),
  sendInvoice: data => http.post("/case/send-invoice", data),
  rescheduleAppointment: data => http.post("/case/reschedule-appointment", data),
  cancelAppointment: data => http.post("/case/cancel-appointment", data),
  updateDocClinic: data => http.post("/case/update-clinic-doctor", data),
  fetchCaseDeliveredContent: param => http.get("/case/fetch-case-delivered-content", { params: param }),
  sendDeliveryEmail:data => http.post("/case/send-delivery-email", data),
};

export default ccase;

//As case is the reserved javascript word thats's why we used ccase
