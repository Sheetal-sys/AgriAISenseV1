function Home() {
  return (
    <div className="placeholder-page">
      <h1>Welcome to AgriAI 🌱</h1>

      <p>
        AI-powered agriculture platform helping farmers detect diseases,
        improve crop yield, receive recommendations and manage farm health.
      </p>

      <div className="home-cards">
        <div className="stat-card">
          <h3>Disease Detection</h3>
          <p>Upload leaf images and identify plant diseases instantly.</p>
        </div>

        <div className="stat-card">
          <h3>Crop Recommendation</h3>
          <p>Suggest best crops based on soil and climate.</p>
        </div>

        <div className="stat-card">
          <h3>Yield Prediction</h3>
          <p>Forecast crop production using AI models.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;