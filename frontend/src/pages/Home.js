import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Activity,
  Leaf,
  ShieldCheck,
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
  CartesianGrid,
  PieChart,
  Pie,
  Cell
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
      .catch((err) => console.error("Dashboard analytics fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const correctFeedback = analytics?.feedback_correct || 0;
  const wrongFeedback = analytics?.feedback_wrong || 0;
  const totalFeedback = correctFeedback + wrongFeedback;

  const feedbackAccuracy =
    totalFeedback > 0 ? ((correctFeedback / totalFeedback) * 100).toFixed(2) : 0;

  const diseaseData = charts?.disease_distribution || [];
  const cropData = charts?.crop_distribution || [];
  const confidenceData = charts?.confidence_trend || [];

  const cropPieData = useMemo(() => {
    const total = cropData.reduce((sum, item) => sum + item.count, 0);

    return cropData.map((item) => ({
      ...item,
      percent: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0
    }));
  }, [cropData]);

  if (loading) {
    return (
      <div className="placeholder-page">
        <h1>Loading Dashboard...</h1>
        <p>Fetching analytics from MongoDB Atlas.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page pro-dashboard">
      <section className="dashboard-title-row">
        <div>
          <h1>AgriAI Dashboard</h1>
          <p>Real-time analytics and insights from your farm intelligence platform.</p>
        </div>
      </section>

      <div className="pro-kpi-grid">
        <KpiCard icon={<Activity />} label="Total Scans" value={analytics?.total_scans || 0} />
        <KpiCard icon={<Bug />} label="Diseased Leaves" value={analytics?.diseased_leaves || 0} />
        <KpiCard icon={<Leaf />} label="Healthy Leaves" value={analytics?.healthy_leaves || 0} />
        <KpiCard icon={<ShieldCheck />} label="Avg Confidence" value={`${analytics?.average_confidence || 0}%`} />
        <KpiCard icon={<Target />} label="Feedback Accuracy" value={`${feedbackAccuracy}%`} />
      </div>

      <div className="pro-highlight-grid">
        <div className="pro-highlight-card">
          <Sprout size={26} />
          <span>Most Detected Disease</span>
          <h2>{analytics?.top_disease || "N/A"}</h2>
          <p>{analytics?.top_disease_count || 0} scans</p>
        </div>

        <div className="pro-highlight-card">
          <Leaf size={26} />
          <span>Most Scanned Crop</span>
          <h2>{analytics?.top_crop || "N/A"}</h2>
          <p>{analytics?.top_crop_count || 0} scans</p>
        </div>
      </div>

      <div className="pro-chart-grid">
        <div className="pro-chart-card">
          <ChartHeader title="Disease Distribution" subtitle="Top detected diseases" />

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={diseaseData} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#5eead4" radius={[0, 8, 8, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pro-chart-card">
          <ChartHeader title="Crop Distribution" subtitle="Most scanned crops" />

          <div className="donut-layout">
            <ResponsiveContainer width="48%" height={230}>
              <PieChart>
                <Pie
                  data={cropPieData}
                  dataKey="count"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {cropPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#5eead4", "#60a5fa", "#a78bfa", "#84cc16"][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-legend">
              {cropPieData.map((item, index) => (
                <div key={item.name} className="donut-legend-row">
                  <span
                    className="legend-dot"
                    style={{
                      background: ["#5eead4", "#60a5fa", "#a78bfa", "#84cc16"][index % 4]
                    }}
                  />
                  <span>{item.name}</span>
                  <strong>{item.percent}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pro-chart-card full-chart">
          <ChartHeader title="Confidence Trend" subtitle="Confidence score across latest predictions" />

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="scan" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#5eead4"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0f172a", stroke: "#5eead4", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pro-chart-card full-chart">
          <ChartHeader title="Feedback Distribution" subtitle="Correct vs wrong feedback submitted by users" />

          <div className="feedback-progress">
            <div
              className="feedback-correct"
              style={{ width: `${feedbackAccuracy}%` }}
            >
              Correct {correctFeedback}
            </div>
            <div className="feedback-wrong">
              Wrong {wrongFeedback}
            </div>
          </div>

          <div className="feedback-mini-stats">
            <span><ThumbsUp size={16} /> Correct: {correctFeedback}</span>
            <span><ThumbsDown size={16} /> Wrong: {wrongFeedback}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value }) {
  return (
    <div className="pro-kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function ChartHeader({ title, subtitle }) {
  return (
    <div className="pro-chart-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <strong>{label || payload[0].name}</strong>
      <p>{payload[0].value}</p>
    </div>
  );
}

export default Home;