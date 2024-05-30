import React, { useState } from "react";
import { API } from "../../Common/Constants";
import axios from "axios";
import { useAlert } from "../../Common/AlertContext";
import DataLoader from "../../Components/DataLoader";

function CreateAvailability() {
  const [date, setDate] = useState("");
  const [timeslots, setTimeslots] = useState([]);
  const [isFetchingData, setisFetchingData] = useState(false);
  const auth_token = localStorage.getItem("auth_token");
  const { showAlert } = useAlert();
  const handleDateChange = (e) => {
    e.preventDefault();

    setDate(e.target.value);
    const selectedDate = new Date(e.target.value);
    const d = new Date();
    if (selectedDate < d) {
      setTimeslots([]);
      return showAlert("Select valid date");
    }
    setTimeslots([]);
    setisFetchingData(true);
    axios
      .post(
        API.doctor.getTimeSlotsByDate,
        { da_date: e.target.value },
        { headers: { auth_token } }
      )
      .then(({ data }) => {
        setisFetchingData(false);
        if (!data.success) {
          return showAlert(data.error);
        }
        setTimeslots(data.timeslots);
      })
      .catch((err) => {
        setisFetchingData(false);
        return showAlert("Something went wrong");
      });
  };

  const handleAddAvailability = (ts_id) => {
    axios
      .post(
        API.doctor.createAvailability,
        { da_date: date, timeslot_id: ts_id },
        { headers: { auth_token } }
      )
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setTimeslots(timeslots.filter((ts) => ts.timeslot_id !== ts_id));
        showAlert("Availability added");
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Create Availability</h2>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-center flex-column mt-4 w-25">
          <input
            type="date"
            name=""
            id=""
            value={date}
            onChange={handleDateChange}
          />
          <div className="d-flex align-items-center flex-column mt-3">
            <DataLoader isFetchingData={isFetchingData} />
            {timeslots.map((ts, ind) => {
              return (
                <div key={ind}>
                  <button
                    className="btn btn-light mb-2"
                    onClick={(e) => handleAddAvailability(ts.timeslot_id)}
                  >
                    {ts.start_time} - {ts.end_time}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAvailability;
