import React from "react";

function Alert({ message, type, isVisible }) {
  return (
    <div>
      {isVisible ? (
        <div className={`alert alert-${type} mt-3`} role="alert">
          <strong>{message}</strong>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Alert;
