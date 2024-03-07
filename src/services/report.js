import http from "./http";

const report = {
  endOfDay: param => http.get("/report/end-of-day", { params: param },{responseType:'blob'}),
  invoice: param => http.get("/report/invoice", { params: param },{responseType:'blob'}),
  onlineTransactions: param => http.get("/report/online-transactions", { params: param },{responseType:'blob'}),
  doctorAr: param => http.get("/report/doctor-ar", { params: param },{responseType:'blob'}),
  patientAr: param => http.get("/report/patient-ar", { params: param },{responseType:'blob'}),
  arCollected: param => http.get("/report/ar-collected", { params: param },{responseType:'blob'}),
  users: param => http.get("/report/users", { params: param },{responseType:'blob'}),
  doctors: param => http.get("/report/doctors", { params: param },{responseType:'blob'}),
  topDoctors: param => http.get("/report/top-doctors", { params: param },{responseType:'blob'}),
  topClinics: param => http.get("/report/top-clinics", { params: param },{responseType:'blob'}),
  topServices: param => http.get("/report/top-services", { params: param },{responseType:'blob'}),
  newPatients: param => http.get("/report/new-patients", { params: param },{responseType:'blob'}),
  existingPatients: param => http.get("/report/existing-patients", { params: param },{responseType:'blob'}),
  cancelledAppointments: param => http.get("/report/cancelled-appointments", { params: param },{responseType:'blob'}),
  production: param => http.get("/report/production", { params: param },{responseType:'blob'}),
  creditCardPayments: param => http.get("/report/credit-card", { params: param },{responseType:'blob'}),
};

export default report;
