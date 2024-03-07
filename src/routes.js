import React from "react";
const CaseSummary = React.lazy(() =>  import ("./views/Admin/Cases/CaseSummary"));

const Dashboard = React.lazy(() => import("./views/Admin/Dashboard"));

const Cases = React.lazy(() => import("./views/Admin/Cases/"));
const Payments = React.lazy(() => import("./views/Admin/Payments/"));
const AddEditCase = React.lazy(() => import("./views/Admin/Cases/AddEditCase"));
const CaseDetails = React.lazy(() => import("./views/Admin/Cases/CaseDetails"));

const Locations = React.lazy(() => import("./views/Admin/Locations"));
const Services = React.lazy(() => import("./views/Admin/Services/"));
const Roles = React.lazy(() => import("./views/Admin/Roles/"));

const Users = React.lazy(() => import("./views/Admin/Users/"));
const AddEditUser = React.lazy(() => import("./views/Admin/Users/AddEditUser"));
const UserDetails = React.lazy(() => import("./views/Admin/Users/UserDetails"));

const DiagnosisCode = React.lazy(() => import("./views/Admin/DiagnosisCode/"));
const Clinics = React.lazy(() => import("./views/Admin/Clinics"));
const AddEditClinic = React.lazy(() =>
  import("./views/Admin/Clinics/AddEditClinic")
);
const ClinicDetails = React.lazy(() =>
  import("./views/Admin/Clinics/ClinicDetails")
);
const Patients = React.lazy(() => import("./views/Admin/Patients"));
const PatientDetails = React.lazy(() =>
  import("./views/Admin/Patients/PatientDetails")
);
const AddEditPatient = React.lazy(() =>
  import("./views/Admin/Patients/AddEditPatient")
);
const Scheduler = React.lazy(() => import("./views/Admin/Scheduler"));
const TimeSlots = React.lazy(() => import("./views/Admin/TimeSlots"));

const EmailTemplates = React.lazy(() => import("./views/Admin/EmailTemplates"));
const AddEditTemplate = React.lazy(() =>
  import("./views/Admin/EmailTemplates/AddEditTemplate")
);

const Forms = React.lazy(() => import("./views/Admin/Forms"));
const AddEditForm = React.lazy(() => import("./views/Admin/Forms/AddEditForm"));

const Messages = React.lazy(() => import("./views/Admin/Messages"));
const FrontEndSettings = React.lazy(() => import("./views/Admin/FrontEndSettings"));
/* const Sent = React.lazy(() => import("./views/Admin/Messages/Sent"));
const Trash = React.lazy(() => import("./views/Admin/Messages/Trash"));
const Read = React.lazy(() => import("./views/Admin/Messages/Read")); */
const EndOfDay = React.lazy(() => import("./views/Admin/FinancialReport/EndOfDay"));
const OnlineTransactions = React.lazy(() => import("./views/Admin/FinancialReport/OnlineTransactions"));
const DoctorAr = React.lazy(() => import("./views/Admin/FinancialReport/DoctorAr"));
const PatientAr = React.lazy(() => import("./views/Admin/FinancialReport/PatientAr"));
const ArCollected = React.lazy(() => import("./views/Admin/FinancialReport/ArCollected"));

const NewUsers = React.lazy(() => import("./views/Admin/NonFinancialReport/NewUsers"));
const Doctors = React.lazy(() => import("./views/Admin/NonFinancialReport/Doctors"));
const NewPatients = React.lazy(() => import("./views/Admin/NonFinancialReport/NewPatients"));
const ExistingPatients = React.lazy(() => import("./views/Admin/NonFinancialReport/ExistingPatients"));
const TopDoctors = React.lazy(() => import("./views/Admin/NonFinancialReport/TopDoctors"));
const TopClinics = React.lazy(() => import("./views/Admin/NonFinancialReport/TopClinics"));
const TopServices = React.lazy(() => import("./views/Admin/NonFinancialReport/TopServices"));
const CancelledAppointments = React.lazy(() => import("./views/Admin/NonFinancialReport/CancelledAppointments"));
const Production = React.lazy(() => import("./views/Admin/FinancialReport/Production"));
const CreditCard = React.lazy(() => import("./views/Admin/NonFinancialReport/CreditCard"));



const routes = [
  { path: "/admin", exact: true, name: "Home" },
  { path: "/admin/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/admin/cases", exact: true, name: "Cases", component: Cases },
  { path: "/admin/payments", exact: true, name: "Payments", component: Payments },
  {
    path: "/admin/cases/create",
    exact: true,
    name: "Create New Case",
    component: AddEditCase
  },{
    path: "/admin/cases/print-confirmation/:id",
    exact: true,
    name: "Create New Case",
    component: CaseSummary
  },
  {
    path: "/admin/cases/edit/:id",
    exact: true,
    name: "Update",
    component: AddEditCase
  },
  {
    path: "/admin/cases/details/:id",
    exact: true,
    name: "Details",
    component: CaseDetails
  },
  {
    path: "/admin/locations",
    exact: true,
    name: "Locations",
    component: Locations
  },
  {
    path: "/admin/services",
    exact: true,
    name: "Services",
    component: Services
  },
  { path: "/admin/roles", exact: true, name: "User Roles", component: Roles },
  { path: "/admin/users", exact: true, name: "Users", component: Users },
  {
    path: "/admin/users/add",
    exact: true,
    name: "Add",
    component: AddEditUser
  },
  {
    path: "/admin/users/edit/:id",
    exact: true,
    name: "Update",
    component: AddEditUser
  },
  {
    path: "/admin/users/details/:id",
    exact: true,
    name: "Details",
    component: UserDetails
  },
  { path: "/admin/clinics", exact: true, name: "Clinics", component: Clinics },
  {
    path: "/admin/clinics/add",
    exact: true,
    name: "Add",
    component: AddEditClinic
  },
  {
    path: "/admin/clinics/edit/:id",
    exact: true,
    name: "Update",
    component: AddEditClinic
  },
  {
    path: "/admin/clinics/details/:id",
    exact: true,
    name: "Details",
    component: ClinicDetails
  },
  {
    path: "/admin/diagnosis",
    exact: true,
    name: "Diagnosis Code",
    component: DiagnosisCode
  },
  {
    path: "/admin/patients",
    exact: true,
    name: "Patients",
    component: Patients
  },
  {
    path: "/admin/patients/add",
    exact: true,
    name: "Add",
    component: AddEditPatient
  },
  {
    path: "/admin/patients/edit/:id",
    exact: true,
    name: "Update",
    component: AddEditPatient
  },
  {
    path: "/admin/patients/details/:id",
    exact: true,
    name: "Details",
    component: PatientDetails
  },
  {
    path: "/admin/scheduler",
    exact: true,
    name: "Scheduler",
    component: Scheduler
  },
  {
    path: "/admin/time-slots",
    exact: true,
    name: "Time Slots",
    component: TimeSlots
  },
  {
    path: "/admin/email-templates",
    exact: true,
    name: "Email Templates",
    component: EmailTemplates
  },
  {
    path: "/admin/email-templates/add",
    exact: true,
    name: "Add Email Template",
    component: AddEditTemplate
  },

  {
    path: "/admin/email-templates/edit/:id",
    exact: true,
    name: "Update Email Template",
    component: AddEditTemplate
  },
  {
    path: "/admin/forms",
    exact: true,
    name: "Forms",
    component: Forms
  },
  {
    path: "/admin/forms/add",
    exact: true,
    name: "Add Form",
    component: AddEditForm
  },

  {
    path: "/admin/forms/edit/:id",
    exact: true,
    name: "Update Form",
    component: AddEditForm
  },
  {
    path: "/admin/messages/",
    exact: true,
    name: "Inbox",
    component: Messages
  },
  {
    path: "/admin/messages/sent",
    exact: true,
    name: "Sent",
    component: Messages
  },
  {
    path: "/admin/messages/trash",
    exact: true,
    name: "Trash",
    component: Messages
  },
  {
    path: "/admin/messages/read/:id/:folder",
    exact: true,
    name: "Read",
    component: Messages
  },
  { 
    path: "/admin/front-end-settings",
    exact: true,
    name: "Front End Settings",
    component: FrontEndSettings
  },
  { 
    path: "/admin/front-end-settings/banners",
    exact: true,
    name: "Banners",
    component: FrontEndSettings
  },
  { 
    path: "/admin/front-end-settings/pages",
    exact: true,
    name: "Pages",
    component: FrontEndSettings
  },
  { 
    path: "/admin/front-end-settings/pages/add",
    exact: true,
    name: "Pages",
    component: FrontEndSettings
  },
  { 
    path: "/admin/front-end-settings/pages/add/:id",
    exact: true,
    name: "Pages",
    component: FrontEndSettings
  },
  { 
    path: "/admin/front-end-settings/faq",
    exact: true,
    name: "Faq",
    component: FrontEndSettings
  },

  { 
    path: "/admin/front-end-settings/faq/add",
    exact: true,
    name: "Faq",
    component: FrontEndSettings
  },
  { 
    path: "/admin/front-end-settings/faq/add/:id",
    exact: true,
    name: "Faq",
    component: FrontEndSettings
  },
  { 
    path: "/admin/financial-report/end-of-day",
    exact: true,
    name: "Financial Report / End Of Day",
    component: EndOfDay
  },
  { 
    path: "/admin/financial-report/online-transactions",
    exact: true,
    name: "Financial Report / Online Transactions",
    component: OnlineTransactions
  },
  { 
    path: "/admin/financial-report/doctor-ar",
    exact: true,
    name: "Financial Report / Doctor A/R",
    component: DoctorAr
  },
  { 
    path: "/admin/financial-report/patient-ar",
    exact: true,
    name: "Financial Report / Patient A/R",
    component: PatientAr
  },
  { 
    path: "/admin/financial-report/production",
    exact: true,
    name: "Non Financial Report / Production",
    component: Production
  },
  { 
    path: "/admin/financial-report/ar-collected",
    exact: true,
    name: "Financial Report / A/R Collected",
    component: ArCollected
  },
  { 
    path: "/admin/non-financial-report/new-users",
    exact: true,
    name: "Non Financial Report / New Users",
    component: NewUsers
  },
  { 
    path: "/admin/non-financial-report/doctors",
    exact: true,
    name: "Non Financial Report / Doctors",
    component: Doctors
  },
  { 
    path: "/admin/non-financial-report/new-patients",
    exact: true,
    name: "Non Financial Report / New Patients",
    component: NewPatients
  },
  { 
    path: "/admin/non-financial-report/existing-patients",
    exact: true,
    name: "Non Financial Report / Existing Patients",
    component: ExistingPatients
  },
  { 
    path: "/admin/non-financial-report/top-doctors",
    exact: true,
    name: "Non Financial Report / Top Doctors",
    component: TopDoctors
  },
  { 
    path: "/admin/non-financial-report/top-clinics",
    exact: true,
    name: "Non Financial Report / Top Clinics",
    component: TopClinics
  },
  { 
    path: "/admin/non-financial-report/top-services",
    exact: true,
    name: "Non Financial Report / Top Services",
    component: TopServices
  },
  { 
    path: "/admin/non-financial-report/cancelled-appointments",
    exact: true,
    name: "Non Financial Report / Cancelled Appointments",
    component: CancelledAppointments
  },
  { 
    path: "/admin/non-financial-report/credit-card",
    exact: true,
    name: "Non Financial Report / Credit Card",
    component: CreditCard
  },
];

export default routes;
