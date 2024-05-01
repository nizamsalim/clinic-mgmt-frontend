import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";

function DisplayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("all");
  const getAge = (db) => {
    const d = new Date();
    const dob = new Date(db);
    const age = d.getFullYear() - dob.getFullYear();
    return age;
  };
  const getAppointments = () => {
    axios
      .get(API.doctor.getMyAppointments, { headers: { auth_token } })
      .then(({ data }) => {
        if (data.success) {
          if (data.appointments.length === 0) {
            setError("You have no upcoming appointments");
          }
          setAppointments(data.appointments);
        }
      });
  };
  const auth_token = localStorage.getItem("auth_token");
  useEffect(() => {
    getAppointments();
    return () => {};
  }, []);

  const handleFilterChange = (val) => {
    setSelected(val);
    if (val === "all") {
      getAppointments();
    } else {
      setAppointments(appointments.filter((app) => app.status === "BOOKED"));
    }
  };

  return (
    <div className="container">
      <h3 className="text-center mt-3">My Appointments</h3>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault1"
          value={"all"}
          onClick={(e) => handleFilterChange("all")}
          checked={selected === "all"}
        />
        <label class="form-check-label" for="flexRadioDefault1">
          All
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          value="booked"
          checked={selected === "booked"}
          name="flexRadioDefault"
          id="flexRadioDefault2"
          onClick={(e) => handleFilterChange("booked")}
        />
        <label class="form-check-label" for="flexRadioDefault2">
          Booked
        </label>
      </div>
      {error !== "" ? (
        <h4 className="text-center">{error}</h4>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Appointment Number</th>
              <th scope="col">Patient Name</th>
              <th scope="col">Age</th>
              <th scope="col">Date</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((ap, ind) => {
              let status;
              switch (ap.status) {
                case "BOOKED":
                  status = "table-warning";
                  break;
                case "COMPLETED":
                  status = "table-success";
                  break;
                case "CANCELLED":
                  status = "table-danger";
                  break;
                default:
                  break;
              }
              return (
                <tr key={ind} className={status}>
                  <th scope="row">{ap.appointment_id}</th>
                  <td>{ap.name}</td>
                  <td>{getAge(ap.dob)}</td>
                  <td>{new Date(ap.date).toDateString()}</td>
                  <td>{ap.start_time}</td>
                  <td>{ap.end_time}</td>
                  <td>{ap.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DisplayAppointments;
