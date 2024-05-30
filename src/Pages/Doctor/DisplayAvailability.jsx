import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API, ROUTES } from "../../Common/Constants";
import axios from "axios";
import { useAlert } from "../../Common/AlertContext";
import { ClipLoader } from "react-spinners";
import DataLoader from "../../Components/DataLoader";

function DisplayAvailability() {
  const [availabilities, setAvailabilities] = useState([]);
  const auth_token = localStorage.getItem("auth_token");
  const { showAlert } = useAlert();
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsFetchingData(true);
    axios
      .get(API.doctor.getMyAvailability, { headers: { auth_token } })
      .then(({ data }) => {
        setIsFetchingData(false);
        if (!data.success) {
          return showAlert(data.error);
        }
        if (data.doctorAvailabilities.length === 0) {
          setError("No records found");
        }
        setAvailabilities(data.doctorAvailabilities);
      })
      .catch((err) => {
        setIsFetchingData(false);
        return showAlert("Something went wrong");
      });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (da_id) => {
    axios
      .delete(`${API.doctor.deleteAvailability}/${da_id}`, {
        headers: { auth_token },
      })
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setAvailabilities(
          availabilities.filter((av) => av.doctor_availability_id !== da_id)
        );
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-4">
        <Link to={ROUTES.doctor.createAvailability} className="btn btn-success">
          Create Availability
        </Link>
      </div>
      <DataLoader isFetchingData={isFetchingData} />
      {availabilities.length === 0 ? (
        <h4 className="text-center">{error}</h4>
      ) : (
        <div>
          <h2 className="text-center mt-3">My Availability</h2>
          <table className="table">
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
              {availabilities.map((av, ind) => {
                const d = new Date(av.da_date);
                return (
                  <tr
                    key={ind}
                    className={`${
                      av.status === "BOOKED" ? "table-danger" : ""
                    }`}
                  >
                    <th scope="row">{d.toDateString()}</th>
                    <td>{av.start_time}</td>
                    <td>{av.end_time}</td>
                    <td>{av.status}</td>
                    {av.status !== "BOOKED" ? (
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={(e) =>
                            handleDelete(av.doctor_availability_id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    ) : (
                      <td></td>
                    )}
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

export default DisplayAvailability;
