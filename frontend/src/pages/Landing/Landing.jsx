import React from "react";

function Landing({ setActivePage }) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <div className="brand-icon">🌿</div>
          <div>
            <h2>AgriAI</h2>
            <p>Farm Intelligence Platform</p>
          </div>
        </div>

        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#policies">Policies</a>
          <button onClick={() => setActivePage("home")}>Open App</button>
        </nav>
      </header>

      <section className="landing-hero">
        <p className="eyebrow">SMART AGRICULTURE PLATFORM</p>
        <h1>AI-powered crop health, disease detection and farm advisory.</h1>
        <p>
          AgriAI helps farmers detect crop diseases from leaf images, understand
          symptoms, get prevention guidance and make better crop decisions.
        </p>

        <div className="landing-actions">
          <button onClick={() => setActivePage("disease")}>
            Start Disease Detection
          </button>
          <button className="secondary-btn" onClick={() => setActivePage("home")}>
            View Dashboard
          </button>
        </div>
      </section>

      <section id="features" className="landing-section">
        <h2>Platform Features</h2>

        <div className="landing-grid">
          <div className="landing-card">
            <h3>🌿 Disease Detection</h3>
            <p>Upload a leaf image and detect plant disease using an AI model.</p>
          </div>

          <div className="landing-card">
            <h3>📚 Treatment Advisory</h3>
            <p>Get cause, symptoms, treatment and prevention guidance.</p>
          </div>

          <div className="landing-card">
            <h3>📈 Yield Prediction</h3>
            <p>Future module for crop production forecasting.</p>
          </div>

          <div className="landing-card">
            <h3>🤖 Farmer Chatbot</h3>
            <p>Future conversational assistant for farmer questions.</p>
          </div>
        </div>
      </section>

      <section id="about" className="landing-section">
        <h2>About AgriAI</h2>
        <p>
          AgriAI is a modular agriculture intelligence system designed to support
          farmers with AI-based decision assistance. The current module focuses on
          crop disease detection and recommendation.
        </p>
      </section>

      <section id="policies" className="landing-section">
        <h2>Policies</h2>
        <p>
          This system provides AI-based advisory support. It should be used as a
          decision-support tool and not as a replacement for certified agriculture experts.
        </p>
      </section>
    </div>
  );
}

export default Landing;