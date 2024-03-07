import http from "./http";

const message = {
  sendMessage: data => http.post("/messages/send", data),
  getInbox: param => http.get("/messages/inbox", { params: param }),
  getSent: param => http.get("/messages/sent", { params: param }),
  getTrash: param => http.get("/messages/trash", { params: param }),
  getMessage: param => http.get("/messages/get", { params: param }),
  getNewMessagesCount: param =>
    http.get("/messages/get-new-messages-count", { params: param }),
  deleteMessage: data => http.post("/messages/delete", data)
};

export default message;
