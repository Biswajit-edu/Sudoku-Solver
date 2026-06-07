// Demo.js
import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Img_upload.css";


// set the sudoku.jpg image present in the curent directory as defaultSrc
const defaultImage = require('./sudoku.jpg');

  const Img_upload = ({ onCrop, isDarkMode}) => {
    const [image, setImage] = useState(defaultImage);
    const [cropper, setCropper] = useState(null);
  
    const onChange = (e) => {
      e.preventDefault();
      const files = e.target.files;
      if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    };
  
    const getCropData = () => {
      if (cropper) {
        const croppedData = cropper.getCroppedCanvas().toDataURL();  // Get the cropped image as a data URL
        onCrop(croppedData); // Pass cropped data to parent component
      }
    };
  
    return (
      <div className={`cont ${isDarkMode ? 'dark_comp' : 'light_comp'}`}>
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <button style={{ marginBottom: '8px' }} onClick={() => setImage(defaultImage)}>Use default image</button>
          <Cropper
            zoomTo={0.2}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => setCropper(instance)}
            guides={true}
            style={{ height: 400, maxWidth: '100%' }}
            dragMode="move"
            scalable={true}
          />
          <div className="box">
            <input type="file" id="upload" hidden onChange={onChange} accept="image/*" />
            <label htmlFor="upload" className="file-upload-label">
              Choose file
            </label>
            <button style={{ marginTop: '14px' }} onClick={getCropData}>
              Crop Image
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default Img_upload