import Home from "./views/Front/Home/Home";
import StaticContent from "./views/Front/StaticContent";
import AboutUs from "./views/Front/AboutUs";
import Login from "./views/Front/Login/Login";
import ForgotPassword from "./views/Front/Login/ForgotPassword";
import ChangePassword from "./views/Front/Login/ChangePassword";
import Patients from "./views/Front/Patients";
import Doctors from "./views/Front/Doctors";
import Education from "./views/Front/Education";
import Locations from "./views/Front/Locations";
import Software from "./views/Front/Software";
import Testimonials from "./views/Front/Testimonials";
import Faq from "./views/Front/Faq";
import Contacts from "./views/Front/Contacts";

const commonMenu = [];

const routes = [
  {
    path: "/",
    exact: true,
    name: "Home",
    component: StaticContent,
    protected: true,
    leftMenu: commonMenu
  },
  {
    path: "/about-us",
    exact: true,
    name: "About Us",
    component: AboutUs,
    leftMenu: commonMenu
  },
  {
    path: "/patients",
    exact: true,
    name: "Patients",
    component: Patients,
    leftMenu: commonMenu
  },
  {
    path: "/doctors",
    exact: true,
    name: "Doctors",
    component: Doctors,
    leftMenu: commonMenu
  },
  {
    path: "/education",
    exact: true,
    name: "Education",
    component: Education,
    leftMenu: commonMenu
  },
  {
    path: "/locations",
    exact: true,
    name: "Locations",
    component: Locations,
    leftMenu: commonMenu
  },
  {
    path: "/software",
    exact: true,
    name: "Software",
    component: Software,
    leftMenu: commonMenu
  },
  {
    path: "/testimonials",
    exact: true,
    name: "Testimonials",
    component: Testimonials,
    leftMenu: commonMenu
  },
  {
    path: "/faq",
    exact: true,
    name: "Faq",
    component: Faq,
    leftMenu: commonMenu
  },
  {
    path: "/contacts",
    exact: true,
    name: "Contacts",
    component: Contacts,
    leftMenu: commonMenu
  },
  {
    path: "/login",
    exact: true,
    name: "Login",
    component: Login,
    leftMenu: commonMenu
  },
  {
    path: "/forgot-password",
    exact: true,
    name: "ForgotPassword",
    component: ForgotPassword,
    leftMenu: commonMenu
  },
  {
    path: "/reset-password/:token",
    exact: true,
    name: "ChangePassword",
    component: ChangePassword,
    leftMenu: commonMenu
  },
  {
    path: "/dashboard",
    exact: true,
    name: "Home",
    component: Home,
    leftMenu: commonMenu
  },
  {
    path: "/page/:url",
    exact: true,
    name: "Static Content",
    component: StaticContent,
    protected: true,
    leftMenu: commonMenu
  },
  { path: "/admin/dashboard", exact: true, name: "Admin" }
];

export default routes;
