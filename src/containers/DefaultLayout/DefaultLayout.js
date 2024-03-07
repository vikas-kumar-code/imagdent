import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch, NavLink } from "react-router-dom";
import { Container } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";

// routes config
import routes from "../../routes";
import role from "../../services/role";
import { connect } from "react-redux";
import { updateNavigation } from "../../store/actions";
import SkeletonScreen from "../../views/Common/SkeletonScreen";
//import { Scrollbars } from "react-custom-scrollbars";



const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuLoader: true,
    };
  }
  loading = () => {
    return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
  };

  signOut(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }
  componentDidMount = () => {
    this.props.updateNavigation([]);
    role.getModulesByRole({ role_id: this.props.userType }).then(response => {
      if (response.data.success) {
        let navigation = [];
        response.data.modules.forEach((nav,index)=>{
          if(nav.children !== undefined && nav.children.length > 0 && nav.module_name === "Financial Reports" || nav.module_name === "Non-Financial Reports"){

            let childrenArr = []
            nav.children.map((ele,i)=>{
                let child = {
                  name:ele.name ? ele.name : ele.action_label_name,
                  url:ele.url,
                  icon:ele.icon
                }
                childrenArr.push(child);
            })

            navigation[index] = {
              name:nav.module_name,
              url:nav.url,
              icon:(nav.module_name === "Financial Reports" || nav.module_name === "Non-Financial Reports") ? 'fa fa-chart-bar' : nav.icon,
              children:childrenArr
            };
          }
          else{
            navigation[index] = {name:nav.module_name,url:nav.url,icon:nav.icon};
          }
        });
        this.props.updateNavigation({items:navigation});
        this.setState({ menuLoader: false });
      }
    });
  };
  
  render() {
    if (!localStorage.token) {
      this.props.history.push("/login");
    }
    return (
      <div className="app admin">
        <ToastContainer />
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              onLogout={e => this.signOut(e)}
              menuLoader={this.state.menuLoader}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            
              {this.state.menuLoader ? <SkeletonScreen type="bullet" />:<AppSidebarNav navConfig={this.props.navigation} {...this.props} />}
            </Suspense>
            {/* <div className="sidebar">
              <nav className="scrollbar-container sidebar-nav ps ps-container">
                <Scrollbars style={{ minHeight: 500 }} autoHide={true}>
                  {this.state.menuLoader ? (
                    <SkeletonScreen type="bullet" />
                  ) : (
                    <ul className="nav">
                      <li className="nav-item" key={99898}>
                        <NavLink
                          className="nav-link"
                          to={`/admin/dashboard`}
                          activeClassName="active"
                          exact={true}
                        >
                          <FontAwesomeIcon
                            icon="tachometer-alt"
                            className="ml-3 mr-2"
                          />
                          Dashboard
                        </NavLink>
                      </li>
                      {this.props.navigation.map((nav, ni) => (
                        <li className="nav-item" key={ni}>
                          <NavLink
                            className="nav-link"
                            to={`/admin/${nav.url}`}
                            activeClassName="active"
                          >
                            <FontAwesomeIcon
                              icon={nav.icon}
                              className="ml-3 mr-2"
                            />
                            {nav.module_name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </Scrollbars>
              </nav>
              <button className="sidebar-minimizer mt-auto" type="button" />
            </div> */}

            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => <route.component {...props} />}
                        />
                      ) : null;
                    })}
                    <Redirect to="/admin/dashboard" />
                  </Switch>
                </Suspense>
                
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userType: state.userType,
    navigation: state.navigation
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateNavigation: navigation => {
      dispatch(
        updateNavigation({
          navigation
        })
      );
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);
