import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Bug,
  Sprout,
  ThumbsUp,
  ThumbsDown,
  Target
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

function Home() {
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://127.0.0.1:8000/analytics"),
      axios.get("http://127.0.0.1:8000/analytics/charts")
    ])
      .then(([analyticsRes, chartsRes]) => {
        setAnalytics(analyticsRes.data);
        setCharts(chartsRes.data);
      })
      .catch((err) => {
        console.error("Dashboard analytics fetch failed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const correctFeedback = analytics?.feedback_correct || 0;
  const wrongFeedback = analytics?.feedback_wrong || 0;
  const totalFeedback = correctFeedback + wrongFeedback;

  const feedbackAccuracy =
    totalFeedback > 0
      ? ((correctFeedback / totalFeedback) * 100).toFixed(2)
      : 0;

  if (loading) {
    return (
      <div className="placeholder-page">
        <h1>Loading Dashboard...</h1>
        <p>Fetching analytics from MongoDB Atlas.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="page-hero">
        <div>
          <h1>AgriAI Dashboard</h1>
          <p>
            Real-time analytics generated from crop disease predictions,
            user feedback, and MongoDB Atlas history.
          </p>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <Activity size={28} />
          <span>Total Scans</span>
          <h2>{analytics?.total_scans || 0}</h2>
        </div>

        <div className="dashboard-card">
          <Bug size={28} />
          <span>Diseased Leaves</span>
          <h2>{analytics?.diseased_leaves || 0}</h2>
        </div>

        <div className="dashboard-card">
          <Leaf size={28} />
          <span>Healthy Leaves</span>
          <h2>{analytics?.healthy_leaves || 0}</h2>
        </div>

        <div className="dashboard-card">
          <ShieldCheck size={28} />
          <span>Avg Confidence</span>
          <h2>{analytics?.average_confidence || 0}%</h2>
        </div>

        <div className="dashboard-card">
          <ThumbsUp size={28} />
          <span>Correct Feedback</span>
          <h2>{correctFeedback}</h2>
        </div>

        <div className="dashboard-card">
          <ThumbsDown size={28} />
          <span>Wrong Feedback</span>
          <h2>{wrongFeedback}</h2>
        </div>

        <div className="dashboard-card">
          <Target size={28} />
          <span>Feedback Accuracy</span>
          <h2>{feedbackAccuracy}%</h2>
        </div>

        <div className="dashboard-card">
          <Activity size={28} />
          <span>Total Feedback</span>
          <h2>{totalFeedback}</h2>
        </div>

        <div className="dashboard-card wide-card">
          <TrendingUp size={28} />
          <span>Most Detected Disease</span>
          <h2>{analytics?.top_disease || "N/A"}</h2>
          <p>{analytics?.top_disease_count || 0} scans</p>
        </div>

        <div className="dashboard-card wide-card">
          <Sprout size={28} />
          <span>Most Scanned Crop</span>
          <h2>{analytics?.top_crop || "N/A"}</h2>
          <p>{analytics?.top_crop_count || 0} scans</p>
        </div>
      </div>

      <div className="dashboard-chart-grid">
        <div className="chart-card">
          <h3>Disease Distribution</h3>
          <p>Most frequently detected crop diseases.</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts?.disease_distribution || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#5eead4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Crop Distribution</h3>
          <p>Most scanned crops in the system.</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts?.crop_distribution || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#84cc16" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-chart">
          <h3>Confidence Trend</h3>
          <p>Confidence score trend across the latest predictions.</p>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={charts?.confidence_trend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="scan" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#5eead4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

           <div className="chart-card full-chart">
  <h3>Feedback Distribution</h3>
  <p>Correct vs wrong feedback submitted by users.</p>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={charts?.feedback_distribution || []}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
      <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
      <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
      <Tooltip />
      <Bar dataKey="count" fill="#5eead4" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

        </div>
      </div>
    </div>
  );
}

export default Home;