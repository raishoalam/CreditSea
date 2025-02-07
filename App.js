import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import BasicDetails from "./components/BasicDetails";
import CreditReport from "./components/CreditReport";
import './App.css'

const App = () => {
  const [reportId, setReportId] = useState(null);

  const handleUploadSuccess = () => {
    // Assuming the server provides a report ID after successful upload
    setReportId(1); // Replace with the actual ID returned by the server
  };

  return (
    <div>
      <h1>Credit Report Viewer</h1>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      
      {reportId && (
        <>
          <BasicDetails reportId={reportId} />
          <CreditReport reportId={reportId} />
        </>
      )}
    </div>
  );
};

export default App;
