import React, { useState } from "react";
import { useAuth } from "../../Common/AuthContext";
import { API, ROUTES, USER_ROLES } from "../../Common/Constants";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/Loader";
import Alert from "../../Components/Alert";
import { useAlert } from "../../Common/AlertContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { alert, isAlertVisible, showAlert } = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    const data = { username, password };

    let url, role, redirect;

    if (userRole === USER_ROLES.admin) {
      url = API.auth.adminLogin;
      role = USER_ROLES.admin;
      redirect = ROUTES.adminHome;
    } else if (userRole === USER_ROLES.patient) {
      url = API.auth.patientLogin;
      role = USER_ROLES.patient;
      redirect = ROUTES.patientHome;
    } else if (userRole === USER_ROLES.doctor) {
      url = API.auth.doctorLogin;
      role = USER_ROLES.doctor;
      redirect = ROUTES.doctorHome;
    }

    axios
      .post(url, data)
      .then(({ data }) => {
        setIsLoading(false);
        if (data.success) {
          login(data.user.username, role, data.auth_token);
          navigate(redirect, { replace: true });
        } else {
          showAlert(data.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        return showAlert("Something went wrong");
      });
  };

  return (
    <div>
      <div className="container mt-2">
        <Alert
          isVisible={isAlertVisible}
          message={alert.message}
          type={alert.type}
        />
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "150px" }}
        >
          <div className="w-25">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3 form-check d-flex">
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userRole"
                    id="flexRadioDefault1"
                    onChange={(e) => setUserRole(USER_ROLES.admin)}
                    style={{ border: "solid black 1px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    ADMIN
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userRole"
                    id="flexRadioDefault2"
                    onChange={(e) => setUserRole(USER_ROLES.doctor)}
                    style={{ border: "solid black 1px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    DOCTOR
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userRole"
                    id="flexRadioDefault2"
                    onChange={(e) => setUserRole(USER_ROLES.patient)}
                    style={{ border: "solid black 1px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    PATIENT
                  </label>
                </div>
              </div>
              <div className="d-flex align-items-center flex-column">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={
                    !(
                      username.trim().length !== 0 &&
                      password.length !== 0 &&
                      userRole &&
                      password.length > 6
                    )
                  }
                >
                  <Loader isLoading={isLoading} label={"Login"} />
                </button>
                <Link to={ROUTES.signup}>Signup</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
