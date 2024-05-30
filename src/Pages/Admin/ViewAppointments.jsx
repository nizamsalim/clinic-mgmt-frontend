import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";
import { useAuth } from "../../Common/AuthContext";
import { useAlert } from "../../Common/AlertContext";
import ModalComponent from "../../Components/ModalComponent";
import DataLoader from "../../Components/DataLoader";

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentNumber, setAppointmentNumber] = useState("");

  const [error, setError] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);

  const { showAlert } = useAlert();

  const [show, setShow] = useState(false);
  const [modalBody, setModalBody] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getAge = (db) => {
    const d = new Date();
    const dob = new Date(db);
    const age = d.getFullYear() - dob.getFullYear();
    return age;
  };
  useEffect(() => {
    getAppointments();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAppointments = () => {
    setIsFetchingData(true);
    axios
      .get(API.admin.getAllAppointments)
      .then(({ data }) => {
        setIsFetchingData(false);
        if (data.success) {
          if (data.appointments.length === 0) {
            setError("No appointments found");
          }
          setAppointments(data.appointments);
        }
      })
      .catch((err) => {
        setIsFetchingData(false);
        showAlert("Something went wrong");
      });
  };

  const getAppointment = (ap_id) => {
    axios
      .get(`${API.admin.getAppointmentById}/${ap_id}`)
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setAppointments(data.appointments);
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  const handleSearch = () => {
    getAppointment(appointmentNumber);
  };

  const { generateToken } = useAuth();

  const handleGenerateToken = (ap) => {
    const tokenNumber = generateToken();
    axios
      .post(API.admin.generateToken, {
        appointment_id: ap.appointmentDetails[0].appointment_id,
      })
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setModalBody(`Token number : ${tokenNumber}`);
        handleShow();
        getAppointments();
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  return (
    <div className="container">
      <ModalComponent
        body={modalBody}
        title={"Token number"}
        handleClose={handleClose}
        handleShow={handleShow}
        show={show}
      />
      <h2 className="text-center mt-3">Appointments</h2>
      <div className="d-flex">
        <input
          type="text"
          className="form-control w-25 "
          placeholder="Search appointment number"
          id="inputEmail4"
          value={appointmentNumber}
          onChange={(e) => {
            setAppointmentNumber(e.target.value);
            if (e.target.value.trim().length === 0) {
              getAppointments();
              return;
            }
          }}
        />
        <button className="btn btn-success ms-3" onClick={handleSearch}>
          Search
        </button>
      </div>
      <DataLoader isFetchingData={isFetchingData} />
      {appointments.length === 0 ? (
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
              let a = ap.appointmentDetails[0];
              let d = ap.doctorDetails[0];
              let p = ap.patientDetails[0];
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
