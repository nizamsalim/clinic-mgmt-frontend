import React from "react";
import { ClipLoader } from "react-spinners";

function Loader({ isLoading, label }) {
  return (
    <div>
      {isLoading ? <ClipLoader size={20} loading={isLoading} /> : `${label}`}
    </div>
  );
}

export default Loader;
