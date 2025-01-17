import React, { useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import "./Image_show.css";
import Modal from "./Modal";
import axios from 'axios';

const Image_show = ({ matrix, setMatrix, setPredictedMatrix, isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  };

  const handleCrop = (image) => {
    setCroppedImage(image);
    setIsModalOpen(false);
  };

  const sendImg = async () => {
    if (!croppedImage) {
      alert("Please select and crop an image first.");
      return;
    }

    try {
      const imageFile = dataURLtoFile(croppedImage, 'sudoku.png');
      const formData = new FormData();
      formData.append('img', imageFile);

      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.grid) {
        const gridData = response.data.grid;
        if (Array.isArray(gridData) && gridData.length === 9 && gridData.every(row => Array.isArray(row) && row.length === 9)) {
          setMatrix(gridData);
          // Store the predicted matrix
          setPredictedMatrix(JSON.parse(JSON.stringify(gridData)));
          console.log('Grid updated successfully:', gridData);
        } else {
          throw new Error('Invalid grid format received from server');
        }
      } else {
        throw new Error('No grid data in response');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Error processing image. Please try again.');
    }
  };

  return (
    <div className={`left_cont ${isDarkMode?'dark_comp':'light_comp'}`}>
      <div className="imagebox">
        {croppedImage ? (
          <img src={croppedImage} alt="Cropped" className="cropped-image" />
        ) : (
          "Uploaded Image will show Here"
        )}
      </div>
      <div className="btn_class">
        <button className="upload-btn" onClick={() => setIsModalOpen(true)}>
          <HiOutlineUpload className="upload-icon" />
          Upload
        </button>
        <button className="upload-btn2" onClick={sendImg}>Proceed</button>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onCrop={handleCrop} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Image_show;