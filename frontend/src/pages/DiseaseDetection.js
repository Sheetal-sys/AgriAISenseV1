import React, { useState } from "react";
import { predictDisease } from "../services/predictionService";
import { generateReport } from "../services/reportService";
import { submitFeedback } from "../services/feedbackService";
import {
  UploadCloud,
  ShieldCheck,
  Bug,
  Activity,
  Pill,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Info,
  Download
} from "lucide-react";

function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    setFile(selected);
    setResult(null);
    setErrorMessage("");

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
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

      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Backend unavailable or prediction failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;

    try {
      setReportLoading(true);

      const reportBlob = await generateReport(result);

      const pdfBlob = new Blob([reportBlob], {
        type: "application/pdf"
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      const crop = result.crop || "crop";
      const disease = result.disease || "disease";

      link.href = url;
      link.download = `AgriAI_Report_${crop}_${disease}.pdf`
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
    setErrorMessage(
      "Feedback can be submitted only after saved prediction."
    );
    return;
  }

  try {
    await submitFeedback(
      result._id,
      feedbackValue
    );

    setResult((prev) => ({
      ...prev,
      feedback: feedbackValue
    }));
  } catch (error) {
    console.error("Feedback failed", error);
    setErrorMessage(
      "Unable to submit feedback. Please try again."
    );
  }
};

  const getStatusIcon = () => {
    if (!result) return <Info size={18} />;
    if (result.status === "success") return <CheckCircle size={18} />;
    if (result.status === "uncertain") return <AlertTriangle size={18} />;
    if (result.status === "poor_quality") return <AlertTriangle size={18} />;
    return <Info size={18} />;
  };

  const getLightingLabel = (score) => {
    if (score === undefined || score === null) return "Unknown";
    if (score < 60) return "Too Dark";
    if (score > 220) return "Too Bright";
    return "Good";
  };

  const getFocusLabel = (score) => {
    if (score === undefined || score === null) return "Unknown";
    if (score < 50) return "Blurry";
    return "Sharp";
  };

  const getFocusCategory = (score) => {
    if (score === undefined || score === null) return "Unknown";
    if (score < 50) return "Very blurry";
    if (score < 150) return "Slightly blurry";
    if (score < 500) return "Acceptable";
    if (score < 2000) return "Good";
    return "Very sharp";
  };

  const getBrightnessCategory = (score) => {
    if (score === undefined || score === null) return "Unknown";
    if (score < 50) return "Very dark";
    if (score < 90) return "Dark";
    if (score < 180) return "Good lighting";
    if (score < 220) return "Bright";
    return "Overexposed";
  };

  const renderAdvancedDetails = () => (
    <details className="advanced-details">
      <summary>Advanced details</summary>

      <p>
        <strong>Blur score:</strong> {result.blur_score} —{" "}
        {getFocusCategory(result.blur_score)}
      </p>

      <p>
        <strong>Brightness score:</strong> {result.brightness_score} —{" "}
        {getBrightnessCategory(result.brightness_score)}
      </p>
    </details>
  );

  return (
    <div className="disease-page">
      <section className="page-hero">
        <div>
          <h1>Detect Crop Disease</h1>
          <p>
            Upload a crop leaf image and get disease prediction, confidence
            score, severity, symptoms, treatment and prevention guidance.
          </p>
        </div>
      </section>

      <section className="module-grid">
        <div className="glass-card upload-panel">
          <div className="card-header">
            <h2>Upload Leaf Image</h2>
            <p>Supported formats: JPG, JPEG, PNG</p>
          </div>

          <div className="upload-guidelines">
            <h4>For best result:</h4>
            <ul>
              <li>Capture one leaf clearly</li>
              <li>Use daylight or good lighting</li>
              <li>Avoid blurry images</li>
              <li>Avoid too much soil or background</li>
              <li>Keep the disease region visible</li>
            </ul>
          </div>

          <label className="dropzone">
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {preview ? (
              <img src={preview} alt="Uploaded leaf" />
            ) : (
              <div className="drop-content">
                <UploadCloud size={56} />
                <h3>Drag or click to upload</h3>
                <p>Upload clear leaf image for better prediction</p>
              </div>
            )}
          </label>

          {errorMessage && (
            <div className="status-box poor_quality">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            className="primary-btn"
            onClick={analyzeDisease}
            disabled={loading}
          >
            {loading ? "Analyzing Leaf..." : "Analyze Disease"}
          </button>
        </div>

        <div className="glass-card result-panel">
          {!result ? (
            <div className="empty-state">
              <Leaf size={54} />
              <h2>Awaiting Analysis</h2>
              <p>Your disease detection result will appear here.</p>
            </div>
          ) : result.status === "poor_quality" ? (
            <div className="quality-warning-panel">
              <AlertTriangle size={58} />
              <h2>Image Quality Issue</h2>
              <p>{result.message}</p>

              <div className="quality-grid">
                <div>
                  <p>Image Focus</p>
                  <h3>{getFocusLabel(result.blur_score)}</h3>
                </div>
                <div>
                  <p>Lighting</p>
                  <h3>{getLightingLabel(result.brightness_score)}</h3>
                </div>
              </div>

              {renderAdvancedDetails()}

              <div className="upload-guidelines compact">
                <h4>Try again with:</h4>
                <ul>
                  <li>Better focus</li>
                  <li>Closer leaf image</li>
                  <li>Good lighting</li>
                  <li>Less background noise</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="result-top">
                <span className="severity-badge">
                  {result.severity} Severity
                </span>

                <h2>{result.disease}</h2>
                <p className="class-name">{result.class_name}</p>

                <div className={`status-box ${result.status}`}>
                  {getStatusIcon()}
                  <span>{result.message}</span>
                </div>
              </div>

              <div className="result-stats">
                <div>
                  <p>Crop</p>
                  <h3>{result.crop}</h3>
                </div>

                <div>
                  <p>Confidence</p>
                  <h3>{result.confidence}%</h3>
                  <small
                    className={`confidence-level ${result.confidence_level?.toLowerCase()}`}
                  >
                    Reliability: {result.confidence_level}
                  </small>
                </div>
              </div>

              <div className="confidence-bar">
                <div style={{ width: `${result.confidence}%` }}></div>
              </div>

              <div className="quality-grid">
                <div>
                  <p>Image Focus</p>
                  <h3>{getFocusLabel(result.blur_score)}</h3>
                </div>
                <div>
                  <p>Lighting</p>
                  <h3>{getLightingLabel(result.brightness_score)}</h3>
                </div>
              </div>

              {renderAdvancedDetails()}

              <div className="feedback-box">
                <p>Was this prediction correct?</p>

                <div className="feedback-actions">
                  <button
                    className={
                      result.feedback === "correct"
                        ? "feedback-btn active"
                        : "feedback-btn"
                    }
                    onClick={() => handleFeedbackSubmit("correct")}
                    disabled={Boolean(result.feedback)}
                  >
                    👍 Correct
                  </button>

                  <button
                    className={
                      result.feedback === "wrong"
                        ? "feedback-btn active wrong"
                        : "feedback-btn wrong"
                    }
                    onClick={() => handleFeedbackSubmit("wrong")}
                    disabled={Boolean(result.feedback)}
                  >
                    👎 Wrong
                  </button>
                </div>

                {result.feedback && (
                  <small>Feedback saved: {result.feedback}</small>
                )}
              </div>

              <button
                className="report-btn"
                onClick={downloadReport}
                disabled={reportLoading}
              >
                <Download size={18} />
                {reportLoading ? "Generating Report..." : "Download PDF Report"}
              </button>

              <div className="advisory-list">
                <div className="advisory-card">
                  <Bug size={20} />
                  <div>
                    <h4>Cause</h4>
                    <p>{result.cause}</p>
                  </div>
                </div>

                <div className="advisory-card">
                  <Activity size={20} />
                  <div>
                    <h4>Symptoms</h4>
                    <p>{result.symptoms}</p>
                  </div>
                </div>

                <div className="advisory-card">
                  <Pill size={20} />
                  <div>
                    <h4>Treatment</h4>
                    <p>{result.treatment}</p>
                  </div>
                </div>

                <div className="advisory-card">
                  <ShieldCheck size={20} />
                  <div>
                    <h4>Prevention</h4>
                    <p>{result.prevention}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default DiseaseDetection;