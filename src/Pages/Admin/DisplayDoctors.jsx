import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { API, ROUTES } from "../../Common/Constants";
import { Link } from "react-router-dom";

function DisplayDoctors() {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    console.log("flag");
    axios.get(API.admin.getDoctors).then(({ data }) => {
      if (!data.success) {
        return alert(data.error);
      }
      setDoctors(data.doctors);
    });
    return () => {};
  }, []);

  const handleDelete = (user_id) => {
    axios.post(API.admin.deleteDoctor, { user_id }).then(({ data }) => {
      if (!data.success) {
        return alert(data.error);
      }
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-4">
        <Link to={ROUTES.admin.createDoctor} className="btn btn-success">
          Create Doctor
        </Link>
      </div>
      <h2 className="text-center mt-3">Doctors</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">User ID</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">License Number</th>
            <th scope="col">Salary</th>
            <th scope="col">Department</th>
            <th scope="col">Specialization</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => {
            return (
              <tr>
                <th scope="row">{doctor.user_id}</th>
                <td>{doctor.name}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.license_number}</td>
                <td>{doctor.salary}</td>
                <td>{doctor.department_name}</td>
                <td>{doctor.specialization_name}</td>
                <td>
                  {" "}
                  <button className="btn btn-warning">Update</button>{" "}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleDelete(doctor.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayDoctors;
