import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  Leaf,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";

function ResultPanel({
  result,
  preview,
  reportLoading,
  onDownloadReport,
  onFeedbackSubmit,
}) {
  if (!result) {
    return (
      <div className="disease-panel result-panel empty-result-panel">
        <Leaf size={54} />
        <h2>Awaiting Analysis</h2>
        <p>Your AI disease detection result will appear here after upload.</p>
      </div>
    );
  }

  if (result.status === "poor_quality") {
    return (
      <div className="disease-panel result-panel">
        <div className="result-warning-icon">
          <AlertTriangle size={28} />
        </div>

        <h2>Image Quality Issue</h2>
        <p className="result-muted">{result.message}</p>

        <QualityGrid result={result} />

        <div className="retry-note">
          Retake the photo closer to the leaf with better focus and lighting.
        </div>
      </div>
    );
  }

  return (
    <div className="disease-panel result-panel">
      <div className="result-image-row">
        {preview ? <img src={preview} alt="Analyzed leaf" /> : <Leaf size={42} />}

        <div>
          <span>Analyzed Crop</span>
          <strong>{result.crop || "N/A"}</strong>
        </div>
      </div>

      <div className="result-heading-row">
        <div>
          <span className="severity-badge">{result.severity || "Unknown"} Severity</span>
          <h2>{result.disease || "Unknown Disease"}</h2>
          <p>{result.class_name || "N/A"}</p>
        </div>

        <CheckCircle className="success-icon" size={28} />
      </div>

      <div className={`result-message ${result.status}`}>
        {result.message}
      </div>

      <div className="confidence-card">
        <div>
          <span>Confidence</span>
          <strong>{result.confidence || 0}%</strong>
        </div>

        <small>Reliability: {result.confidence_level || "N/A"}</small>

        <div className="confidence-bar">
          <div style={{ width: `${result.confidence || 0}%` }} />
        </div>
      </div>

      <QualityGrid result={result} />

      <div className="feedback-card-mini">
        <p>Was this prediction correct?</p>

        <div>
          <button
            onClick={() => onFeedbackSubmit("correct")}
            disabled={Boolean(result.feedback)}
          >
            <ThumbsUp size={14} />
            Correct
          </button>

          <button
            onClick={() => onFeedbackSubmit("wrong")}
            disabled={Boolean(result.feedback)}
          >
            <ThumbsDown size={14} />
            Wrong
          </button>
        </div>

        {result.feedback && <small>Feedback saved: {result.feedback}</small>}
      </div>

      <button
        className="primary-action-btn report-download-btn"
        onClick={onDownloadReport}
        disabled={reportLoading}
      >
        <Download size={17} />
        {reportLoading ? "Generating Report..." : "Download PDF Report"}
      </button>
    </div>
  );
}

function QualityGrid({ result }) {
  return (
    <div className="quality-grid">
      <div>
        <span>Blur Score</span>
        <strong>{result.blur_score ?? "N/A"}</strong>
      </div>

      <div>
        <span>Brightness</span>
        <strong>{result.brightness_score ?? "N/A"}</strong>
      </div>
    </div>
  );
}

export default ResultPanel;