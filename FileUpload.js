import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message for successful uploads

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Check file extension manually (not only MIME type)
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    // Allow only XML files by extension
    if (selectedFile && fileExtension !== "xml") {
      setErrorMessage("Please select a valid XML file.");
      setFile(null); // Clear the file selection if not XML
    } else {
      setErrorMessage(""); // Clear error message if XML file is selected
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select an XML file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3008/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("File uploaded successfully!"); // Success message
      setErrorMessage(""); // Clear any error message
      onUploadSuccess(); // Trigger the success callback if provided
    } catch (error) {
      setErrorMessage("Failed to upload file. Please try again.");
      setSuccessMessage(""); // Clear success message on error
    }
  };

  return (
    <div>
      <h3>Upload XML File</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xml" // Restrict to XML files
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default FileUpload;
