import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";
import { useAuth } from "../../Common/AuthContext";

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [appointmentNumber, setAppointmentNumber] = useState("");

  const getAge = (db) => {
    const d = new Date();
    const dob = new Date(db);
    const age = d.getFullYear() - dob.getFullYear();
    return age;
  };
  useEffect(() => {
    getAppointments();

    return () => {};
  }, []);

  const getAppointments = () => {
    axios.get(API.admin.getAllAppointments).then(({ data }) => {
      if (data.success) {
        if (data.appointments.length === 0) {
          setError("No appointments");
        }
        setAppointments(data.appointments);
      }
    });
  };

  const getAppointment = (ap_id) => {
    axios.get(`${API.admin.getAppointmentById}/${ap_id}`).then(({ data }) => {
      if (!data.success) {
        return alert(data.error);
      }
      setAppointments(data.appointments);
    });
  };

  const handleSearch = (val) => {
    setAppointmentNumber(val);
    if (val.trim().length === 0) {
      getAppointments();
    } else {
      getAppointment(val);
    }
  };

  const { generateToken } = useAuth();

  //   const generateTokenNumber = () => {
  //     let token = JSON.parse(localStorage.getItem("token"));
  //     token++;
  //     localStorage.setItem("token", JSON.stringify(token));
  //   };

  const handleGenerateToken = (ap) => {
    const tokenNumber = generateToken();
    axios
      .post(API.admin.generateToken, {
        appointment_id: ap.appointmentDetails.appointment_id,
      })
      .then(({ data }) => {
        if (!data.success) {
          return alert(data.error);
        }
        alert(`Token number - ${tokenNumber}`);
        getAppointments();
      });
  };

  return (
    <div className="container">
      <h3 className="text-center mt-3">All Appointments</h3>
      <div className="d-flex">
        <input
          type="text"
          className="form-control w-25 "
          placeholder="Search appointment number"
          id="inputEmail4"
          value={appointmentNumber}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {error !== "" ? (
        <h4 className="text-center">{error}</h4>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Appointment Number</th>
              <th scope="col">Date</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Status</th>
              <th scope="col">Doctor Name</th>
              <th scope="col">Doctor Phone</th>
              <th scope="col">Department</th>
              <th scope="col">Specialization</th>
              <th scope="col">Patient Name</th>
              <th scope="col">Patient Phone</th>
              <th scope="col">Age</th>
              <th scope="col">Insurance Number</th>
              <th scope="col">Visits</th>
              <th scope="col">Generate Token</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((ap, ind) => {
              let a = ap.appointmentDetails;
              let d = ap.doctorDetails;
              let p = ap.patientDetails;
              let status;
              switch (a.status) {
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
                  <th scope="row">{a.appointment_id}</th>
                  <td>{new Date(a.date).toDateString()}</td>
                  <td>{a.start_time}</td>
                  <td>{a.end_time}</td>
                  <th scope="row">{a.status}</th>
                  <th scope="row">{d.name}</th>
                  <td>{d.phone}</td>
                  <td>{d.department_name}</td>
                  <td>{d.specialization_name}</td>
                  <th scope="row">{p.name}</th>
                  <td>{p.phone}</td>
                  <td>{getAge(p.dob)}</td>
                  <td>{p.insurance_number}</td>
                  <td>{p.visits}</td>
                  <td>
                    {a.status === "BOOKED" ? (
                      <button
                        className="btn btn-info"
                        onClick={(e) => handleGenerateToken(ap)}
                      >
                        Generate token
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewAppointments;
