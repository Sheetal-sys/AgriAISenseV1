import React from "react";
import { Image, UploadCloud, X } from "lucide-react";

function UploadPanel({
  file,
  preview,
  loading,
  errorMessage,
  onFileChange,
  onAnalyze,
  onClearFile,
}) {
  return (
    <div className="disease-panel upload-panel">
      <div className="panel-title-row">
        <div>
          <h2>Upload Leaf Image</h2>
          <p>Use a clear crop leaf photo for accurate AI diagnosis.</p>
        </div>
      </div>

      <label className="premium-upload-zone">
        <input type="file" accept="image/*" onChange={onFileChange} />

        {preview ? (
          <div className="premium-preview">
            <img src={preview} alt="Uploaded leaf preview" />

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onClearFile();
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-empty">
            <div className="upload-icon">
              <UploadCloud size={34} />
            </div>

            <h3>Drop leaf image here</h3>
            <p>or click to browse from your device</p>
            <span>JPG, JPEG, PNG · Max 8 MB</span>
          </div>
        )}
      </label>

      {file && (
        <div className="selected-file-card">
          <Image size={18} />
          <div>
            <strong>{file.name}</strong>
            <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        </div>
      )}

      {errorMessage && <div className="disease-error">{errorMessage}</div>}

      <button className="primary-action-btn" onClick={onAnalyze} disabled={loading}>
        {loading ? "Analyzing Leaf..." : "Analyze Disease"}
      </button>

      <div className="scan-tips-card">
        <h4>Tips for better results</h4>
        <ul>
          <li>Capture one leaf clearly</li>
          <li>Use natural lighting</li>
          <li>Avoid blurry or dark photos</li>
          <li>Keep infected area visible</li>
        </ul>
      </div>
    </div>
  );
}

export default UploadPanel;