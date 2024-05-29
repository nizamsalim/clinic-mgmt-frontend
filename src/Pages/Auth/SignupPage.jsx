import axios from "axios";
import React, { useState } from "react";
import { API, ROUTES, USER_ROLES } from "../../Common/Constants";
import { useAuth } from "../../Common/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import Alert from "../../Components/Alert";
import { useAlert } from "../../Common/AlertContext";

// name: string;
//   phone: string;
//   username: string;
//   password: string;
//   insurance_number: string;
//   address: string;
//   dob: Date;

function SignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { alert, isAlertVisible, showAlert } = useAlert();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    setIsLoading(true);
    e.preventDefault();
    const data = {
      name,
      phone,
      username,
      password,
      insurance_number: insuranceNumber,
      address,
      dob,
    };
    axios
      .post(API.auth.patientSignup, data)
      .then(({ data }) => {
        setIsLoading(false);
        if (!data.success) {
          return showAlert(data.error);
        }
        login(data.user.username, USER_ROLES.patient, data.auth_token);
        navigate(ROUTES.patientHome, { replace: true });
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  return (
    <div className="container w-25 mt-5">
      <Alert
        isVisible={isAlertVisible}
        message={alert.message}
        type={alert.type}
      />
      <h2 className="text-center mb-3">Signup</h2>
      <form className="row g-3" onSubmit={handleSignup}>
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputPassword4" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">
            Insurance number
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            value={insuranceNumber}
            maxLength={7}
            onChange={(e) => setInsuranceNumber(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputPassword4" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputPassword4" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            className="form-control"
            id="inputPassword4"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="col-12 d-flex align-items-center flex-column mt-4 mb-5">
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={
              !(name && phone && username && password && insuranceNumber && dob)
            }
          >
            <Loader isLoading={isLoading} label={"Signup"} />
          </button>
          <Link to={ROUTES.login}>Login</Link>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
