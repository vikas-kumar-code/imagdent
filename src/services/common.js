import http from "./http";
import moment from "moment";

const common = {
  timeSince: (timeStamp) => {
    let rawTimeStamp = new Date(timeStamp);
    let now = new Date(),
      secondsPast = (now.getTime() - rawTimeStamp.getTime()) / 1000;
    if (secondsPast < 60) {
      let seconds = parseInt(secondsPast);
      if (seconds < 60) {
        return " Just now";
      }
    }
    if (secondsPast < 3600) {
      let minutes = parseInt(secondsPast / 60);
      if (minutes === 1) {
        return minutes + " minute ago";
      } else {
        return minutes + " minutes ago";
      }
    }
    if (secondsPast <= 86400) {
      let hours = parseInt(secondsPast / 3600);
      if (hours === 1) {
        return hours + " hr ago";
      } else {
        return hours + " hrs ago";
      }
    }
    if (secondsPast > 86400) {
      let day = rawTimeStamp.getDate();
      let month = rawTimeStamp
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(" ", "");
      let year =
        rawTimeStamp.getFullYear() === now.getFullYear()
          ? ""
          : " " + rawTimeStamp.getFullYear();
      let hour = rawTimeStamp.getHours();

      let minutes = rawTimeStamp.getMinutes();
      let ampm = hour >= 12 ? "pm" : "am";
      hour = hour % 12;
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return (
        "<strong>On</strong> " +
        day +
        " " +
        month +
        year +
        " <strong>At</strong> " +
        hour +
        ":" +
        minutes +
        " " +
        ampm
      );
    }
  },
  ucwords: (txt) => {
    let str = txt.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, (s) => {
      return s.toUpperCase();
    });
  },
  mySqlFormat: (date) => {
    let d = new Date(date);
    return d.getFullYear() + "-" + Number(d.getMonth() + 1) + "-" + d.getDate();
  },
  customeFormat: (date, format, time = false) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    //let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",]
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let d = new Date(date);
    if (format === "dd-mm-yyyy") {
      let month = Number(d.getMonth() + 1);
      if (month <= 9) {
        month = "0" + month;
      }
      var date_format = d.getDate() + "-" + month + "-" + d.getFullYear();
    } else if (format === "dd MM, yyyy") {
      let month = d.getMonth();

      var date_format =
        d.getDate() + " " + months[month] + ", " + d.getFullYear();
    } else if (format === "MM dd, yyyy") {
      let month = d.getMonth();

      var date_format =
        months[month] + " " + d.getDate() + ", " + d.getFullYear();
    } else if (format === "d, MM dd, yyyy") {
      let month = d.getMonth();
      let day = d.getDay();
      var date_format =
        days[day] +
        ", " +
        months[month] +
        " " +
        d.getDate() +
        " ," +
        d.getFullYear();
    } else if (format === "d, dd MM yyyy") {
      let month = d.getMonth();
      let day = d.getDay();
      var date_format =
        days[day] +
        ", " +
        d.getDate() +
        " " +
        months[month] +
        " " +
        d.getFullYear();
    } else if (format === "yyyy-mm-dd") {
      let month = Number(d.getMonth() + 1);
      if (month <= 9) {
        month = "0" + month;
      }
      if (d.getDate() <= 9) {
        date = "0" + d.getDate();
      } else {
        date = d.getDate();
      }
      var date_format = d.getFullYear() + "-" + month + "-" + date;
    }
    if (time) {
      if (d.getMinutes() <= 9) {
        date_format =
          date_format +
          " at " +
          d.get +
          ":0" +
          d.getMinutes() +
          moment(d).format("A");
      } else {
        date_format =
          date_format +
          " at " +
          // d.getHours() +
          // ":" +
          // d.getMinutes() +
          moment(d).format("hh:mm A");
      }
      //date_format = moment(d).format("YYYY-MM-DD h:mm A").replace(" ", " at ");
    }
    return date_format;
  },
  randomNumber: () => {
    return Math.random();
  },
  isValidEmail: (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  },
  isEmptyObject(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  },
  dateDiff(date) {
    let today = new Date();
    date = new Date(date);
    let difference = date.getTime() - today.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  },
  getBuild: param => http.get("/common/get-build", { params: param }),
  getClinics: (param) => http.get("/common/get-clinics", { params: param }),
  searchClinic: (param) => http.get("/common/search-clinic", { params: param }),
  searchLocation: (param) =>
    http.get("/common/search-location", { params: param }),
  searchUser: (param) => http.get("/common/search-user", { params: param }),
  getRoles: (param) => http.get("/common/get-roles", { params: param }),
  getMembershipPlans: (param) =>
    http.get("/common/get-plans", { params: param }),
  getUsersByLocation: (param) =>
    http.get("/common/get-users-by-location", { params: param }),
  getLocation: (param) => http.get("/common/get-locations", { params: param }),
  getLocationsByUser: (param) =>
    http.get("/common/get-locations-by-user", { params: param }),
  getAvailableSlots: (param) =>
    http.get("/common/get-available-slots", { params: param }),
  getDashboardData: (param) =>
    http.get("/common/get-dashboard-data", { params: param }),
  getSelectedSlot: (availableSlots, appointment_date, slot_id) => {
    let availableSlot = availableSlots.filter((s) => {
      let date1 = new Date(moment(s.appointment_date));
      let date2 = new Date(moment(appointment_date));
      if (date1.toDateString() === date2.toDateString()) {
        return s;
      }
    });
    let selectedSlot = availableSlot[0].slots.filter(
      (s) => parseInt(s.id) === parseInt(slot_id)
    );

    return (
      moment(selectedSlot[0].from_time, "hh:mm").format("hh:mm A") +
      " - " +
      moment(selectedSlot[0].to_time, "hh:mm").format("hh:mm A")
    );
  },
  getUnavailableSlots: (data) => http.post("/common/get-unavail-slots", data),
  getTreatmentSummaryTemplates: (param) =>
    http.get("/common/get-tmt-summary-templates", { params: param }),
  parepareSummary: (param) =>
    http.get("/common/prepare-summary", { params: param }),
  getUserLocations: (param) =>
    http.get("/common/get-user-locations", { params: param }),
  getLocations: (param) => http.get("/common/get-locations", { params: param }),
  getUsers: (param) => http.get("/common/get-users", { params: param }),
  getPatients: (param) => http.get("/common/get-patients", { params: param }),
  getClinicsByDoc: (param) =>
    http.get("/common/get-clinics-by-doctor", { params: param }),
  getUsersByLocation: (param) =>
    http.get("/common/get-users-by-location", { params: param }),
  getClinicsByUser: (param) =>
    http.get("/common/get-clinics-by-user", { params: param }),
  getClinics: (param) => http.get("/common/get-clinics", { params: param }),
  getUserByClinic: (param) =>
    http.get("common/get-users-by-clinic", { params: param }),
  getAssociatedUsers: (param) => http.get("/common/get-associated-users", { params: param }),
  getServices: (param) => http.get("/common/get-services", { params: param }),
  getParentServices: (param) =>
    http.get("/common/get-parent-services", { params: param }),
  getDiagnosisCodes: (param) =>
    http.get("/common/get-diagnosis-codes", { params: param }),
  getSelectedDiagnosisCodes: (param) =>
    http.get("/common/case-diagnosis-codes", { params: param }),
  digitMasking(data) {
    return data.replace(/.(?=\d{4})/g, "*");
  },
  getCountries: (param) => http.get("/common/get-countries", { params: param }),
  saveDocument: (data) => http.post("/common/save-document", data),
  getTreatmentTeam: (param) => http.get("/common/get-team", { params: param }),
  getSelectedServices: (param) =>
    http.get("/common/get-selected-services", { params: param }),
  getDocumentTypes: () => {
    let documentTypes = {
      0: [
        "State licence",
        "NPI Number",
        "Hippa compliance",
        "Service Agreement",
        "Appointment Reciept",
      ],
      1: [
        "Sign-in form",
        "HIPAA Release",
        "Pregnancy Release",
        "Receipt",
        "Records Release",
        "Referral form",
        "Other",
      ],
      2: [
        "Panoramic Xray",
        "CBCT",
        "Radiology Report",
        "DICOM",
        "Digital Impressions",
        "Cephalometric Xray",
        "Photos",
        "Additional Reports",
        "Cephalometric Analysis",
        "Composite 8 Photos",
        "Model Pictures",
        "3D Model",
        "TMJ Series",
        "Carpal Wrist",
        "Cross-sectional Report",
      ],
    };
    return documentTypes;
  },
  getContactRoles: () => {
    let contactRoles = [
      "Clinical Assistant",
      "Clinical Lead",
      "Office Assistant",
      "Office Manager",
      "Implant Coordinator",
      "Treatment Coordinator",
    ];
    return contactRoles;
  },
  getLanguages: () => {
    let languages = ["English", "Spanish","Other"];
    return languages;
  },
  getFullName(data) {
    let name = "";
    if (data.prefix && data.prefix !== null) {
      name += data.prefix + ` `;
    }
    if (data.first_name !== null) {
      name += data.first_name + ` `;
    }
    if (data.middle_name !== null) {
      name += data.middle_name + ` `;
    }
    if (data.last_name !== null) {
      name += data.last_name + ` `;
    }
    if (data.suffix && data.suffix !== null) {
      name += data.suffix;
    }
    return name;
  },
  calculatePrice: (data) => {
    return data
      .reduce((a, c) => {
        return c !== undefined ? Number(a) + Number(c) : Number(a);
      }, 0)
      .toFixed(2);
  },
  modeArr: ["Cash", "Check", "Visa", "MasterCard", "Amex", "Discover","Adjustments"],
  getDuePayments: (param) =>
    http.get("/common/get-due-payments", { params: param }),
  getBanners: (param) => http.get("/common/get-banners", { params: param }),
  receivePayment: (params) => http.post("/common/receive-payment", params),
  getPage: (params) => http.post("page/get-pages", params),
  caseStatusArr: [
    "New",
    "Patient Checked-in",
    "Patient Paper work uploaded",
    "Payment Accepted",
    "Records captured",
    "Re-formatted files uploaded",
    "Ready for Radiologist",
    "Rad Report Completed",
    "Case Completed",
    "Canceled Appointment",
  ],
  referral: [
    "Direct Contact by iMagDent",
    "Peer Referral",
    "CE Course/Webinar",
    " Implant/Supply Rep",
    " Social Media",
    "Other",
  ],
  contactUs: (params) => http.post("/common/contact-us", params),
  numberFormat: (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  imd_roles : [1,2,3,4,5,6,12,13]
};

export default common;
