// Demo.js
import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Img_upload.css";

const defaultSrc =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg/1200px-Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg.png";

  const Img_upload = ({ onCrop, isDarkMode}) => {
    const [image, setImage] = useState(defaultSrc);
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
      <div className={` cont ${isDarkMode ? 'dark_comp' : 'light_comp'}`}>
        <div style={{ width: "100%" }}>
          <button onClick={() => setImage(defaultSrc)}>Use default image</button>
          <br />
          <br />
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
            onInitialized={(instance) => setCropper(instance)}  // Initialize cropper
            guides={true}
          />
          <div className="box" style={{ height: "80px", width: "70vh" }}>
            <input type="file" id="upload" hidden onChange={onChange} />
            <label htmlFor="upload" className="file-upload-label">
              Choose file
            </label>
            <button style={{ display: "flex" }} onClick={getCropData}>
              Crop Image
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default Img_upload