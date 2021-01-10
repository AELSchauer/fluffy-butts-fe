import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmationModal = ({ children, onCancel, onConfirm, show, title }) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <p>{title}</p>
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
