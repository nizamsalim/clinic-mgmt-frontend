import React from "react";

function Alert({ message, type, isVisible }) {
  return (
    <div>
      {isVisible ? (
        <div className={`alert alert-${type}`} role="alert">
          {message}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Alert;
