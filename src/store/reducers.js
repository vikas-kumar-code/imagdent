import { LOGIN, LOGOUT } from "./constants";

let apiUrl;
let baseUrl;
if (
  document.URL.indexOf("mitiztechnologies") >= 0 ||
  document.URL.indexOf("localhost") >= 0
) {
  // apiUrl = "http://imagdent.mitiztechnologies.in/api";
  // baseUrl = "http://imagdent.mitiztechnologies.in";
  apiUrl = "http://localhost/imag-dent";
  baseUrl = "http://localhost/imag-dent";
  if (document.URL.indexOf("https") === 0) {
    apiUrl = "https://imagdent.mitiztechnologies.in/api";
    baseUrl = "https://imagdent.mitiztechnologies.in";
  }
} else {
  apiUrl = "http://imagdent.com/api";
  if (document.URL.indexOf("https") === 0) {
    apiUrl = "https://imagdent.com/api";
    apiUrl = "https://imagdent.com";
  }
  else {
    apiUrl = "http://imagdent.com/api";
    apiUrl = "http://imagdent.com";
  }
}

let initialState = {
  apiUrl: apiUrl,
  baseUrl: baseUrl,
  friendRequests: [],
  notifications: [],
  navigation: [],
  searchPatientData: {
    searchFields: {},
    searchResult: [],
  },
};
if (localStorage.getItem("token")) {
  initialState = { ...initialState, token: localStorage.getItem("token") };
}
if (localStorage.getItem("userName")) {
  initialState = {
    ...initialState,
    userName: localStorage.getItem("userName"),
  };
}
if (localStorage.getItem("name")) {
  initialState = {
    ...initialState,
    name: localStorage.getItem("name"),
  };
}
if (localStorage.getItem("userId")) {
  initialState = { ...initialState, userId: localStorage.getItem("userId") };
}
if (localStorage.getItem("userType")) {
  initialState = {
    ...initialState,
    userType: localStorage.getItem("userType"),
  };
}
if (localStorage.getItem("userImage")) {
  initialState = {
    ...initialState,
    userImage: localStorage.getItem("userImage"),
  };
}

if (localStorage.getItem("userImageThumb")) {
  initialState = {
    ...initialState,
    userImageThumb: localStorage.getItem("userImageThumb"),
  };
}
if (localStorage.getItem("defaultLocation")) {
  initialState = {
    ...initialState,
    defaultLocation: localStorage.getItem("defaultLocation"),
  };
}

function rootReducer(state = initialState, action) {
  let payload = action.payload;
  switch (action.type) {
    case LOGIN:
      return { ...state, ...payload };
    case LOGOUT:
      const initialState = {
        apiUrl: apiUrl,
        baseUrl: baseUrl,
      };
      return (state = initialState);
    case "GET-NAVIGATIONS":
      let navigation = payload.navigation;
      return { ...state, navigation };
    case "SEARCH-PATIENT-DATA":
      let searchPatientData = payload.searchPatientData;
      return { ...state, searchPatientData };
    case "LAST-SEARCHED-PATIENT":
      let lastSearchedPatient = payload.lastSearchedPatient;
      return { ...state, lastSearchedPatient };
    case "GET-REASONS":
      let reasons = payload.reasons;
      return { ...state, reasons };
    case "GET-DOC-TYPES":
      let documentTypes = payload.documentTypes;
      return { ...state, documentTypes };
    case "UPDATE-SELECTED-REASON":
      let selectedReason = payload;
      return { ...state, selectedReason };
    case "UPDATE-SELECTED-NODES":
      let selectedNodes = payload;
      return { ...state, selectedNodes };
    case "UPDATE-SELECTED-LOCATION":
      let defaultLocation = payload.defaultLocation;
      return { ...state, defaultLocation };
    case "UPDATE-NEW-MESSAGES-COUNT":
      let totalNewMessages = payload.totalNewMessages;
      return { ...state, totalNewMessages };
    default:
      return state;
  }
}
export default rootReducer;
