import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API, ROUTES } from "../../Common/Constants";
import axios from "axios";

function DisplayAvailability() {
  const [availabilities, setAvailabilities] = useState([]);
  const auth_token = localStorage.getItem("auth_token");
  useEffect(() => {
    axios
      .get(API.doctor.getMyAvailability, { headers: { auth_token } })
      .then(({ data }) => {
        if (!data.success) {
          return alert(data.error);
        }
        setAvailabilities(data.doctorAvailabilities);
      });

    return () => {};
  }, [auth_token]);

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-4">
        <Link to={ROUTES.doctor.createAvailability} className="btn btn-success">
          Create Availability
        </Link>
      </div>
      <h2 className="text-center mt-3">My Availability</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Start time</th>
            <th scope="col">Stop time</th>
            <th scope="col">Status</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map((av) => {
            const d = new Date(av.da_date);
            return (
              <tr>
                <th scope="row">{d.toDateString()}</th>
                <td>{av.start_time}</td>
                <td>{av.end_time}</td>
                <td>{av.status}</td>
                <td>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayAvailability;
