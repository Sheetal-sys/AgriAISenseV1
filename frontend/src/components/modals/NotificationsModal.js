import React, { useEffect, useState } from "react";
import { getSystemStatus } from "../../services/systemService";

function NotificationsModal() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <h2>Notifications</h2>
        <p>Loading system status...</p>
      </>
    );
  }

  if (!status) {
    return (
      <>
        <h2>Notifications</h2>
        <p>⚠️ Unable to fetch system status.</p>
      </>
    );
  }

  return (
    <>
      <h2>Notifications</h2>
      <p>✅ API Status: {status.api_status}</p>
      <p>✅ Database: {status.database_status}</p>
      <p>🌿 Active Module: {status.active_module}</p>
      <p>📊 Total Scans: {status.total_scans}</p>
      <p>🎯 Average Confidence: {status.average_confidence}%</p>
      <p>👍 Correct Feedback: {status.feedback_correct}</p>
      <p>👎 Wrong Feedback: {status.feedback_wrong}</p>
    </>
  );
}

export default NotificationsModal;