import React, { useState } from "react";
import { API } from "../../Common/Constants";
import axios from "axios";

function CreateAvailability() {
  const [date, setDate] = useState("");
  const [timeslots, setTimeslots] = useState([]);
  const auth_token = localStorage.getItem("auth_token");
  const handleDateChange = (e) => {
    e.preventDefault();
    setDate(e.target.value);
    // console.log(e.target.value);
    const selectedDate = new Date(e.target.value);
    const d = new Date();
    if (selectedDate < d) {
      setTimeslots([]);
      return alert("Select valid date");
    }
    axios
      .post(
        API.doctor.getTimeSlotsByDate,
        { da_date: e.target.value },
        { headers: { auth_token } }
      )
      .then(({ data }) => {
        if (!data.success) {
          return alert(data.error);
        }
        setTimeslots(data.timeslots);
      })
      .catch((err) => {
        return alert("Something went wrong");
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
          return alert(data.error);
        }
        setTimeslots(timeslots.filter((ts) => ts.timeslot_id !== ts_id));
        alert("Availability added");
      })
      .catch((err) => {
        return alert("Something went wrong");
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
