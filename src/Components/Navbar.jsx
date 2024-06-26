import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Common/AuthContext";
import { ROUTES, USER_ROLES } from "../Common/Constants";
import Alert from "./Alert";
import { useAlert } from "../Common/AlertContext";

function Navbar() {
  const { logout, user } = useAuth();
  const { alert, isAlertVisible } = useAlert();
  const navigate = useNavigate();
  let links;
  if (user.userRole === USER_ROLES.admin) {
    links = [
      {
        name: "Doctors",
        path: ROUTES.admin.getDoctors,
      },
      {
        name: "Patients",
        path: ROUTES.admin.getPatients,
      },
      {
        name: "Appointments",
        path: ROUTES.admin.getAppointments,
      },
      {
        name: "Departments & Specializations",
        path: ROUTES.admin.departmentsAndSpecializations,
      },
    ];
  } else if (user.userRole === USER_ROLES.doctor) {
    links = [
      {
        name: "My Appointments",
        path: ROUTES.doctor.getAppointments,
      },
      {
        name: "My Availabilities",
        path: ROUTES.doctor.getAvailability,
      },
    ];
  } else if (user.userRole === USER_ROLES.patient) {
    links = [
      {
        name: "Book appointments",
        path: ROUTES.patientHome,
      },
      {
        name: "My appointments",
        path: ROUTES.patient.getAppointments,
      },
    ];
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={`/${user.userRole.toLowerCase()}`}>
            Welcome, <strong>{user && user.username}</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {links.map((link, ind) => {
                return (
                  <li className="nav-item" key={ind}>
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={link.path}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <form className="d-flex" role="search">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={(e) => {
                  logout();
                  navigate(ROUTES.login);
                }}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={isAlertVisible}
      />
      <div className="detail">
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;
