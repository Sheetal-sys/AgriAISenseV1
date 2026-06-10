import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, ShieldCheck, Bug, Activity, Pill, Leaf } from "lucide-react";
import StatCard from "../components/StatCard";

function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setResult(null);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const analyzeDisease = async () => {
    if (!file) {
      alert("Please upload a leaf image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setResult(response.data);
    } catch (error) {
      alert("Prediction failed. Check backend server or CORS.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Find what's wrong with your crop</p>
          <h1>Detect Crop Disease </h1>
          <p>
            Upload a crop leaf image and get disease prediction, confidence score,
            severity, symptoms, treatment and prevention guidance.
          </p>
        </div>

       
      </section>

      
      <section className="module-grid">
        <div className="glass-card upload-panel">
          <div className="card-header">
            <h2>Upload Leaf Image</h2>
            <p>Supported formats: JPG, JPEG, PNG</p>
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

          <button className="primary-btn" onClick={analyzeDisease}>
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
          ) : (
            <>
              <div className="result-top">
                <span className="severity-badge">{result.severity} Severity</span>
                <h2>{result.disease}</h2>
                <p className="class-name">{result.class_name}</p>
              </div>

              <div className="result-stats">
                <div>
                  <p>Crop</p>
                  <h3>{result.crop}</h3>
                </div>
                <div>
                  <p>Confidence</p>
                  <h3>{result.confidence}%</h3>
                </div>
              </div>

              <div className="confidence-bar">
                <div style={{ width: `${result.confidence}%` }}></div>
              </div>

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