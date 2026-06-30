import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Activity,
  Bot,
  Bug,
  CloudSun,
  Eye,
  FileText,
  Leaf,
  Server,
  ShieldCheck,
  Sparkles,
  Sprout,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { getFullDashboard } from "../../services/dashboardService";
import StatCard from "../../components/Cards/StatCard";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFullDashboard()
      .then(setDashboard)
      .catch((error) => console.error("Dashboard fetch failed", error))
      .finally(() => setLoading(false));
  }, []);

  const analytics = dashboard?.analytics || {};
  const charts = dashboard?.charts || {};
  const recent = dashboard?.recent_predictions || [];
  const system = dashboard?.system || {};

  const feedbackAccuracy = useMemo(() => {
    const correct = analytics.feedback_correct || 0;
    const wrong = analytics.feedback_wrong || 0;
    const total = correct + wrong;

    return total > 0 ? ((correct / total) * 100).toFixed(1) : 0;
  }, [analytics]);

  if (loading) {
    return (
      <div className="placeholder-page">
        <h1>Loading Dashboard...</h1>
        <p>Fetching complete dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page premium-dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">AGRI INTELLIGENCE CENTER</p>
          <h1> Hi , {currentUser?.name || "User"} 👋</h1>
          <p>
            Monitor crop health, disease scans, AI prediction confidence and advisory performance.
          </p>
        </div>

        <div className="dashboard-status">
          <Server size={16} />
          {system.api_status || "active"} · MongoDB {system.database_status || "connected"}
        </div>
      </section>

      <section className="module-launch-grid">
        <button className="module-launch-card active" onClick={() => navigate("/disease")}>
          <Leaf size={24} />
          <h3>Disease Detection</h3>
          <p>Upload leaf image and get AI diagnosis.</p>
          <span>Available</span>
        </button>

        <button className="module-launch-card disabled">
          <Sprout size={24} />
          <h3>Crop Recommendation</h3>
          <p>Recommend crop based on soil and weather.</p>
          <span>Coming Soon</span>
        </button>

        <button className="module-launch-card disabled">
          <CloudSun size={24} />
          <h3>Weather Risk</h3>
          <p>Forecast crop risk from weather conditions.</p>
          <span>Coming Soon</span>
        </button>

        <button className="module-launch-card disabled">
          <Bot size={24} />
          <h3>Farmer Chatbot</h3>
          <p>Ask farming questions in simple language.</p>
          <span>Coming Soon</span>
        </button>
      </section>

      <section className="dashboard-kpi-grid">
        <StatCard icon={<Activity size={22} />} title="Total Scans" value={analytics.total_scans || 0} note="Saved predictions" />
        <StatCard icon={<Leaf size={22} />} title="Healthy Leaves" value={analytics.healthy_leaves || 0} note="Healthy crop samples" variant="teal" />
        <StatCard icon={<Bug size={22} />} title="Diseased Leaves" value={analytics.diseased_leaves || 0} note="Needs attention" variant="orange" />
        <StatCard icon={<ShieldCheck size={22} />} title="Avg Confidence" value={`${analytics.average_confidence || 0}%`} note="Model reliability" variant="purple" />
        <StatCard icon={<FileText size={22} />} title="Reports" value={analytics.total_scans || 0} note="PDF-ready scans" variant="blue" />
      </section>

      <section className="dashboard-premium-grid">
        <div className="dashboard-card chart-wide">
          <CardTitle title="Disease Distribution" subtitle="Top diseases detected by the model" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.disease_distribution || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={135} tick={{ fill: "#cbd5e1", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#5eead4" radius={[0, 8, 8, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <CardTitle title="Feedback Summary" subtitle="Correct vs wrong feedback" />

          <div className="feedback-summary-big">
            <h2>{feedbackAccuracy}%</h2>
            <p>Feedback Accuracy</p>
          </div>

          <div className="feedback-list">
            <span><ThumbsUp size={14} /> Correct {analytics.feedback_correct || 0}</span>
            <span><ThumbsDown size={14} /> Wrong {analytics.feedback_wrong || 0}</span>
          </div>
        </div>

        <div className="dashboard-card chart-wide">
          <CardTitle title="Confidence Trend" subtitle="Latest prediction confidence movement" />
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={charts.confidence_trend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="scan" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="confidence" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card quick-actions-card">
          <CardTitle title="Quick Actions" subtitle="Common workflows" />

          <button onClick={() => navigate("/disease")}><Leaf size={16} /> Detect Disease</button>
          <button onClick={() => navigate("/history")}><Eye size={16} /> View History</button>
          <button><FileText size={16} /> Export Reports</button>
          <button><Sparkles size={16} /> AI Insights</button>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-card">
          <CardTitle title="Recent Scans" subtitle="Latest predictions" />

          <div className="recent-scan-list">
            {recent.length === 0 ? (
              <p className="muted">No recent scans available.</p>
            ) : (
              recent.map((item) => (
                <div className="recent-scan-row" key={item._id}>
                  <div>
                    <strong>{item.disease || "Unknown"}</strong>
                    <span>{item.crop || "N/A"} · {item.status || "N/A"}</span>
                  </div>
                  <b>{item.confidence || 0}%</b>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <CardTitle title="System Status" subtitle="Platform health" />

          <div className="system-status-list">
            <div><span>API</span><strong>{system.api_status || "active"}</strong></div>
            <div><span>Database</span><strong>{system.database_status || "connected"}</strong></div>
            <div><span>Storage</span><strong>{system.storage_status || "healthy"}</strong></div>
            <div><span>AI Model</span><strong>{system.ai_model_status || "running"}</strong></div>
          </div>
        </div>

        <div className="dashboard-card">
          <CardTitle title="Top Insights" subtitle="Highest frequency records" />

          <div className="insight-row">
            <span>Most Detected Disease</span>
            <strong>{analytics.top_disease || "N/A"}</strong>
          </div>

          <div className="insight-row">
            <span>Most Scanned Crop</span>
            <strong>{analytics.top_crop || "N/A"}</strong>
          </div>

          <div className="insight-row">
            <span>Top Disease Count</span>
            <strong>{analytics.top_disease_count || 0}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

function CardTitle({ title, subtitle }) {
  return (
    <div className="dashboard-card-title">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export default Dashboard;