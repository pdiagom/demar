import React from "react";
import "../styles/modal.css";

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`modal-backdrop show`}>
      <div className="modal-content">
        <button className="modal-close btn-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
