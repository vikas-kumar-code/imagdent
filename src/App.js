import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Logout from "./views/Logout";
import FrontLayout from "./containers/DefaultLayout/FrontLayout";
import Login from "./views/Front/Login/Login";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  fab,
  faFacebook,
  faTwitterSquare,
  faGoogle,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import ForgotPassword from "./views/Front/Login/ForgotPassword";
import ChangePassword from "./views/Front/Login/ChangePassword";
import Page from "./views/Front/Page";
import "bootstrap/js/src/tooltip";
import "bootstrap/js/src/modal";
import "bootstrap/js/src/dropdown";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import {
  faAsterisk,
  faTachometerAlt,
  faUserFriends,
  faCommentDots,
  faBell,
  faLink,
  faCamera,
  faPaperclip,
  faMapMarkerAlt,
  faTag,
  faCheckCircle,
  faThumbsUp,
  faUsers,
  faNewspaper,
  faChartBar,
  faCheck,
  faUserPlus,
  faSearch,
  faUser,
  faUserMd,
  faSignOutAlt,
  faForward,
  faFrown,
  faEnvelopeOpen,
  faUserCircle,
  faTimes,
  faList,
  faEdit,
  faTrash,
  faSpinner,
  faImage,
  faEllipsisH,
  faMapMarker,
  faPlus,
  faCheckSquare,
  faGlobe,
  faBlog,
  faUndo,
  faBullhorn,
  faBookOpen,
  faShare,
  faReply,
  faArrowLeft,
  faLock,
  faCloudUploadAlt,
  faPencilAlt,
  faExclamation,
  faMinus,
  faPoll,
  faBookmark,
  faEllipsisV,
  faPaperPlane,
  faFilePdf,
  faCircle,
  faCrop,
  faTasks,
  faRetweet,
  faRss,
  faSync,
  faUserCog,
  faClinicMedical,
  faDollarSign,
  faHospital,
  faWheelchair,
  faBackward,
  faFileExcel,
  faFileWord,
  faFile,
  faFilePowerpoint,
  faClock,
  faCalendar,
  faCalendarCheck,
  faMedkit,
  faFileAlt,
  faHandHoldingUsd,
  faDiagnoses,
  faPhoneAlt,
  faEnvelope,
  faBars,
  faSlidersH,
  faFileDownload,
  faDownload
} from "@fortawesome/free-solid-svg-icons";

library.add(
  fab,
  faTwitterSquare,
  faFacebook,
  faGoogle,
  faInstagram,
  faPhoneAlt,
  faEnvelope,
  faAsterisk,
  faTachometerAlt,
  faUserFriends,
  faCommentDots,
  faBell,
  faLink,
  faCamera,
  faPaperclip,
  faMapMarkerAlt,
  faTag,
  faCheckCircle,
  faThumbsUp,
  faUsers,
  faUserMd,
  faNewspaper,
  faChartBar,
  faCheck,
  faUserPlus,
  faSearch,
  faUser,
  faSignOutAlt,
  faForward,
  faFrown,
  faEnvelopeOpen,
  faUserCircle,
  faTimes,
  faList,
  faEdit,
  faTrash,
  faSpinner,
  faImage,
  faEllipsisH,
  faMapMarker,
  faPlus,
  faCheckSquare,
  faGlobe,
  faBlog,
  faUndo,
  faBullhorn,
  faBookOpen,
  faShare,
  faReply,
  faArrowLeft,
  faLock,
  faCloudUploadAlt,
  faPencilAlt,
  faExclamation,
  faMinus,
  faPoll,
  faBookmark,
  faEllipsisV,
  faPaperPlane,
  faFilePdf,
  faCircle,
  faCrop,
  faTasks,
  faRetweet,
  faRss,
  faSync,
  faUserCog,
  faClinicMedical,
  faDollarSign,
  faHospital,
  faWheelchair,
  faBackward,
  faSignOutAlt,
  faFileExcel,
  faFileWord,
  faFile,
  faFilePowerpoint,
  faClock,
  faCalendar,
  faCalendarCheck,
  faMedkit,
  faFileAlt,
  faHandHoldingUsd,
  faDiagnoses,
  faBars,
  faSlidersH,
  faFileDownload,
  faDownload
);

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            {/* <Route
              exact
              path="/admin/logout"
              name="Logout Page"
              render={props => <Logout {...props} />}
            /> */}
            <Route
              exact
              path="/logout"
              name="Logout Page"
              render={props => <Logout {...props} />}
            />
            <Route
              path="/admin"
              name="Admin"
              render={props => <DefaultLayout {...props} />}
            />
            <Route
              path="/"
              name="FrontLayout"
              render={props => <FrontLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    userType: state.userType
  };
};
export default connect(mapStateToProps)(App);
