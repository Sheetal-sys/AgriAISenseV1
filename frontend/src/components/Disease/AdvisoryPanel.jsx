import React from "react";
import { Activity, Bug, Pill, ShieldCheck, Sparkles } from "lucide-react";

function AdvisoryPanel({ result }) {
  if (!result || result.status === "poor_quality") {
    return (
      <div className="disease-panel advisory-panel empty-advisory-panel">
        <Sparkles size={46} />
        <h2>AI Advisory</h2>
        <p>
          Cause, symptoms, treatment and prevention guidance will appear after a successful scan.
        </p>
      </div>
    );
  }

  const items = [
    {
      icon: <Bug size={18} />,
      title: "Cause",
      value: result.cause,
    },
    {
      icon: <Activity size={18} />,
      title: "Symptoms",
      value: result.symptoms,
    },
    {
      icon: <Pill size={18} />,
      title: "Treatment",
      value: result.treatment,
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Prevention",
      value: result.prevention,
    },
  ];

  return (
    <div className="disease-panel advisory-panel">
      <div className="panel-title-row">
        <div>
          <h2>AI Advisory</h2>
          <p>Recommended next actions for the detected condition.</p>
        </div>
      </div>

      <div className="advisory-list">
        {items.map((item) => (
          <div className="advisory-item" key={item.title}>
            <div className="advisory-icon">{item.icon}</div>

            <div>
              <h4>{item.title}</h4>
              <p>{item.value || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="expert-warning">
        <strong>Important:</strong> This is AI-based decision support. For field-level treatment,
        verify with a local agriculture expert.
      </div>
    </div>
  );
}

export default AdvisoryPanel;