import React, { useEffect, useMemo, useState } from "react";
import {
  getAnalytics,
  getAnalyticsCharts
} from "../services/analyticsService";

import {
  Activity,
  Leaf,
  ShieldCheck,
  Bug,
  FileText,
  Eye,
  Download,
  Server,
  ThumbsUp,
  ThumbsDown
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
    Promise.all([getAnalytics(), getAnalyticsCharts()])
      .then(([analyticsData, chartsData]) => {
        setAnalytics(analyticsData);
        setCharts(chartsData);
      })
      .catch((err) => console.error("Dashboard analytics fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const correctFeedback = analytics?.feedback_correct || 0;
  const wrongFeedback = analytics?.feedback_wrong || 0;
  const totalFeedback = correctFeedback + wrongFeedback;

  const feedbackAccuracy =
    totalFeedback > 0
      ? ((correctFeedback / totalFeedback) * 100).toFixed(1)
      : 0;

  const diseaseData = charts?.disease_distribution || [];
  const confidenceData = charts?.confidence_trend || [];

  const cropPieData = useMemo(() => {
    const cropData = charts?.crop_distribution || [];
    const total = cropData.reduce((sum, item) => sum + item.count, 0);

    return cropData.map((item) => ({
      ...item,
      percent: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0
    }));
  }, [charts]);

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
      <section className="dashboard-hero">
        <div>
          <h1>Good Evening, Rajesh 👋</h1>
          <p>Here is your farm intelligence overview for today.</p>
        </div>

        <div className="dashboard-hero-pill">
          <Server size={16} />
          MongoDB Atlas Connected
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <DashboardKpi
          icon={<Activity size={22} />}
          title="Total Scans"
          value={analytics?.total_scans || 0}
          note="+12 Today"
          variant="green"
        />

        <DashboardKpi
          icon={<Leaf size={22} />}
          title="Healthy Leaves"
          value={analytics?.healthy_leaves || 0}
          note="Healthy crop samples"
          variant="teal"
        />

        <DashboardKpi
          icon={<Bug size={22} />}
          title="Diseased Leaves"
          value={analytics?.diseased_leaves || 0}
          note="Needs attention"
          variant="orange"
        />

        <DashboardKpi
          icon={<ShieldCheck size={22} />}
          title="Avg Confidence"
          value={`${analytics?.average_confidence || 0}%`}
          note="Model reliability"
          variant="purple"
        />

        <DashboardKpi
          icon={<FileText size={22} />}
          title="Reports Generated"
          value={totalFeedback || 0}
          note="Feedback records"
          variant="blue"
        />
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-card disease-chart-card">
          <CardTitle title="Disease Distribution" subtitle="Top detected diseases" />

          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={diseaseData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#5eead4" radius={[0, 8, 8, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card confidence-chart-card">
          <CardTitle title="Confidence Trend" subtitle="Latest 20 scans" />

          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="scan" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 3, fill: "#07111f", stroke: "#5eead4", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card feedback-card">
          <CardTitle title="Feedback Summary" subtitle="Correct vs wrong predictions" />

          <div className="feedback-donut-row">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Correct", value: correctFeedback },
                    { name: "Wrong", value: wrongFeedback }
                  ]}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={4}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="feedback-score">
              <h2>{feedbackAccuracy}%</h2>
              <p>Accuracy</p>
            </div>
          </div>

          <div className="feedback-list">
            <span><ThumbsUp size={14} /> Correct {correctFeedback}</span>
            <span><ThumbsDown size={14} /> Wrong {wrongFeedback}</span>
          </div>
        </div>

        <div className="dashboard-card quick-actions-card">
          <CardTitle title="Quick Actions" subtitle="Common workflows" />

          <button className="quick-action-btn">
            <Leaf size={16} />
            Detect Disease
          </button>

          <button className="quick-action-btn">
            <Eye size={16} />
            View History
          </button>

          <button className="quick-action-btn">
            <Download size={16} />
            Generate Report
          </button>

          <button className="quick-action-btn">
            <Server size={16} />
            System Status
          </button>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-card">
          <CardTitle title="Most Detected Disease" subtitle="Highest frequency" />
          <h2 className="highlight-value">{analytics?.top_disease || "N/A"}</h2>
          <p className="highlight-note">{analytics?.top_disease_count || 0} scans</p>
        </div>

        <div className="dashboard-card">
          <CardTitle title="Most Scanned Crop" subtitle="Most uploaded crop" />
          <h2 className="highlight-value">{analytics?.top_crop || "N/A"}</h2>
          <p className="highlight-note">{analytics?.top_crop_count || 0} scans</p>
        </div>

        <div className="dashboard-card">
          <CardTitle title="Crop Distribution" subtitle="Scan share by crop" />

          <div className="mini-crop-list">
            {cropPieData.map((item, index) => (
              <div key={item.name}>
                <span>{item.name}</span>
                <strong>{item.percent}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardKpi({ icon, title, value, note, variant }) {
  return (
    <div className={`dashboard-kpi-card ${variant}`}>
      <div className="dashboard-kpi-icon">{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{note}</span>
    </div>
  );
}

function CardTitle({ title, subtitle }) {
  return (
    <div className="dashboard-card-title">
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