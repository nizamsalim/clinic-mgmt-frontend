import React from "react";
import { ClipLoader } from "react-spinners";

function DataLoader({ isFetchingData }) {
  return (
    <div>
      <div
        className={`d-flex justify-content-center ${
          isFetchingData ? "mt-3" : ""
        }`}
      >
        <ClipLoader loading={isFetchingData} />
      </div>
    </div>
  );
}

export default DataLoader;
