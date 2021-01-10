import React, { Fragment, useState } from "react";
import ConfirmationModal from "../ConfirmationModal";

const RemoveButton = ({ children, onRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const toggleRemoveModal = () => setShowModal(!showModal);

  return (
    <Fragment>
      <ConfirmationModal
        onCancel={toggleRemoveModal}
        onConfirm={() => {
          onRemove();
          toggleRemoveModal();
        }}
        show={showModal}
      >
        {children}
      </ConfirmationModal>
      <i
        className="fas fa-minus"
        onClick={toggleRemoveModal}
        onKeyPress={(e) => {
          e.key === "Enter" && toggleRemoveModal();
        }}
        tabIndex="0"
      />
    </Fragment>
  );
};

export default RemoveButton;
