// Modal.js
import React, { useEffect, useCallback } from "react";
import Img_upload from "../Img_upload/Img_upload.js";
import "./Modal.css";

function Modal({ isOpen, setIsOpen, onCrop, isDarkMode }) {
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  // Close on overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <button 
          className="close-btn" 
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        <div id="modal-title" className="sr-only">Image Upload Modal</div>
        <Img_upload
          onCrop={onCrop}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default Modal;
