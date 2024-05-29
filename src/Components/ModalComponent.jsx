import React from "react";
import { Button, Modal } from "react-bootstrap";

function ModalComponent({ title, body, show, handleClose }) {
  return (
    <div>
      <Modal
        show={show}
        // onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalComponent;
