import { LOGIN, LOGOUT } from "./constants";

export function doLogin(payload) {
  return { type: LOGIN, payload };
}
export function doLogout(payload) {
  return { type: LOGOUT, payload };
}
export function updateNavigation(payload) {
  return { type: "GET-NAVIGATIONS", payload };
}
export function updateSearchPatientData(payload) {
  return { type: "SEARCH-PATIENT-DATA", payload };
}
export function updateLastSearchedPatient(payload) {
  return { type: "LAST-SEARCHED-PATIENT", payload };
}
export function getReasons(payload) {
  return { type: "GET-REASONS", payload };
}
export function getDocTypes(payload) {
  return { type: "GET-DOC-TYPES", payload };
}
export function updateSelectedReason(payload) {
  return { type: "UPDATE-SELECTED-REASON", payload };
}
export function updateSelectedNodes(payload) {
  return { type: "UPDATE-SELECTED-NODES", payload };
}
export function changeLocation(payload) {
  return { type: "UPDATE-SELECTED-LOCATION", payload };
}
export function updateNewMessagesCount(payload) {
  return { type: "UPDATE-NEW-MESSAGES-COUNT", payload };
}
