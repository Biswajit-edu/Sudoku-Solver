// Modal.js
import React from "react";
import Img_upload from "../Img_upload/Img_upload.js"; // Updated import to point to Demo component
import "./Modal.css";

function Modal({ isOpen, setIsOpen, onCrop,isDarkMode }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          X
        </button>
        <Img_upload
         onCrop={onCrop}
         isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default Modal;
