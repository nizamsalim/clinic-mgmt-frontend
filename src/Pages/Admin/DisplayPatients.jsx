import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";
import axios from "axios";
import { useAlert } from "../../Common/AlertContext";

function DisplayPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const { showAlert } = useAlert();

  const getAge = (db) => {
    const d = new Date();
    const dob = new Date(db);
    const age = d.getFullYear() - dob.getFullYear();
    return age;
  };

  const getAllPatients = () => {
    axios
      .get(API.admin.getAllPatients)
      .then(({ data }) => {
        setPatients(data.patients);
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  useEffect(() => {
    getAllPatients();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPatient = (name) => {
    axios
      .get(`${API.admin.getPatientByName}/${name}`)
      .then(({ data }) => {
        setPatients(data.patients);
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  const handleSearch = (val) => {
    setSearch(val);
    if (val.trim().length === 0) {
      getAllPatients();
    } else {
      getPatient(val);
    }
  };

  return (
    <div className="container">
      <div className="d-flex mt-5">
        <input
          type="text"
          className="form-control w-25 "
          placeholder="Search name"
          id="inputEmail4"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {patients.length === 0 ? (
        <h4 className="text-center mt-3">No patients found</h4>
      ) : (
        <div>
          <h2 className="text-center mt-3">Patients</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Age</th>
                <th scope="col">Insurance number</th>
                <th scope="col">Address</th>
                <th scope="col">Visists</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((pat, ind) => {
                return (
                  <tr key={ind}>
                    <th scope="row">{pat.user_id}</th>
                    <td>{pat.name}</td>
                    <td>{pat.phone}</td>
                    <td>{getAge(pat.dob)}</td>
                    <td>{pat.insurance_number}</td>
                    <td>{pat.address}</td>
                    <td>{pat.visits}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DisplayPatients;
