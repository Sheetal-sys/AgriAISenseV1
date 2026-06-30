import React, { useState } from "react";

import { predictDisease } from "../../services/predictionService";
import { generateReport } from "../../services/reportService";
import { submitFeedback } from "../../services/feedbackService";

import UploadPanel from "../../components/Disease/UploadPanel";
import ResultPanel from "../../components/Disease/ResultPanel";
import AdvisoryPanel from "../../components/Disease/AdvisoryPanel";

function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setResult(null);
    setErrorMessage("");
    setPreview(URL.createObjectURL(selected));
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setErrorMessage("");
  };

  const analyzeDisease = async () => {
    if (!file) {
      setErrorMessage("Please upload a leaf image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await predictDisease(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.detail || "Backend unavailable or prediction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;

    try {
      setReportLoading(true);

      const reportBlob = await generateReport(result);
      const pdfBlob = new Blob([reportBlob], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `AgriAI_Report_${result.crop || "crop"}_${result.disease || "disease"}.pdf`
        .replaceAll(" ", "_")
        .replaceAll("/", "_");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Report download failed", error);
      setErrorMessage("Unable to download report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackValue) => {
    if (!result?._id) {
      setErrorMessage("Feedback can be submitted only after saved prediction.");
      return;
    }

    try {
      await submitFeedback(result._id, feedbackValue);

      setResult((previous) => ({
        ...previous,
        feedback: feedbackValue,
      }));
    } catch (error) {
      console.error("Feedback failed", error);
      setErrorMessage("Unable to submit feedback. Please try again.");
    }
  };

  return (
    <div className="disease-page premium-disease-page">
      <section className="disease-hero premium-disease-hero">
        <div>
          <p className="eyebrow">AI CROP HEALTH SCAN</p>
          <h1>Detect Crop Disease</h1>
          <p>
            Upload a leaf image to detect crop disease, check image quality,
            receive AI recommendations and download a PDF report.
          </p>
        </div>

        <div className="disease-hero-badge">
          Disease Detection · Active
        </div>
      </section>

      <section className="premium-disease-grid">
        <UploadPanel
          file={file}
          preview={preview}
          loading={loading}
          errorMessage={errorMessage}
          onFileChange={handleFileChange}
          onAnalyze={analyzeDisease}
          onClearFile={clearFile}
        />

        <ResultPanel
          result={result}
          preview={preview}
          reportLoading={reportLoading}
          onDownloadReport={downloadReport}
          onFeedbackSubmit={handleFeedbackSubmit}
        />

        <AdvisoryPanel result={result} />
      </section>
    </div>
  );
}

export default DiseaseDetection;