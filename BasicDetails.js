import React, { useState, useEffect } from "react";
import axios from "axios";

const BasicDetails = ({ reportId }) => {
  const [basicDetails, setBasicDetails] = useState(null);

  useEffect(() => {
    const fetchBasicDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/report/${reportId}`);
        setBasicDetails(response.data.basicDetails);
      } catch (error) {
        console.error("Error fetching basic details:", error);
      }
    };

    if (reportId) fetchBasicDetails();
  }, [reportId]);

  if (!basicDetails) return <p>Loading...</p>;

  return (
    <div>
      <h3>Basic Details</h3>
      <p><strong>Name:</strong> {basicDetails.name}</p>
      <p><strong>Mobile:</strong> {basicDetails.mobile_phone}</p>
      <p><strong>Email:</strong> {basicDetails.email}</p>
      <p><strong>PAN:</strong> {basicDetails.pan}</p>
      <p><strong>Date of Birth:</strong> {basicDetails.date_of_birth}</p>
      <p><strong>Gender:</strong> {basicDetails.gender}</p>
      <p><strong>Address:</strong> {basicDetails.address}</p>
    </div>
  );
};

export default BasicDetails;
