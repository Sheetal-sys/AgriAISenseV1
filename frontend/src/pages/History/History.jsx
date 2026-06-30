import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Calendar,
  Download,
  Leaf,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";

import { getHistory } from "../../services/historyService";
import { submitFeedback } from "../../services/feedbackService";
import { generateReport } from "../../services/reportService";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [feedbackLoadingId, setFeedbackLoadingId] = useState(null);
  const [reportLoadingId, setReportLoadingId] = useState(null);

  const loadHistory = async (pageNumber = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const data = await getHistory(pageNumber, 10);
      const items = data.items || [];

      setHistory((previous) => (append ? [...previous, ...items] : items));
      setHasMore(Boolean(data.has_more));
      setTotalRecords(data.total || 0);
      setPage(data.page || pageNumber);
    } catch (error) {
      console.error("History fetch failed", error);
      if (!append) setHistory([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadHistory(1, false);
  }, []);

  const summary = useMemo(() => {
    const total = history.length;

    const healthy = history.filter((item) =>
      item.disease?.toLowerCase().includes("healthy")
    ).length;

    const diseased = total - healthy;

    const avgConfidence =
      total > 0
        ? (
            history.reduce((sum, item) => sum + Number(item.confidence || 0), 0) /
            total
          ).toFixed(2)
        : 0;

    return {
      total,
      healthy,
      diseased,
      avgConfidence,
    };
  }, [history]);

  const filteredHistory = history.filter((item) => {
    const keyword = searchText.toLowerCase();

    return (
      item.crop?.toLowerCase().includes(keyword) ||
      item.disease?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword) ||
      item.severity?.toLowerCase().includes(keyword)
    );
  });

  const formatDate = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleFeedbackSubmit = async (item, feedbackValue) => {
    if (!item?._id) return;

    try {
      setFeedbackLoadingId(item._id);
      await submitFeedback(item._id, feedbackValue);

      setHistory((previous) =>
        previous.map((record) =>
          record._id === item._id
            ? { ...record, feedback: feedbackValue }
            : record
        )
      );
    } catch (error) {
      console.error("Feedback failed", error);
      alert("Unable to submit feedback.");
    } finally {
      setFeedbackLoadingId(null);
    }
  };

  const downloadReport = async (item) => {
    try {
      setReportLoadingId(item._id);

      const reportBlob = await generateReport(item);
      const pdfBlob = new Blob([reportBlob], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `AgriAI_Report_${item.crop}_${item.disease}.pdf`
        .replaceAll(" ", "_")
        .replaceAll("/", "_");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Report download failed", error);
      alert("Unable to download report.");
    } finally {
      setReportLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="placeholder-page">
        <h1>Loading History...</h1>
        <p>Fetching prediction records from backend.</p>
      </div>
    );
  }

  return (
    <div className="history-page premium-history-page">
      <section className="history-hero">
        <div>
          <p className="eyebrow">SCAN RECORDS</p>
          <h1>Prediction History</h1>
          <p>
            Review saved crop disease scans, confidence levels, feedback and downloadable AI reports.
          </p>
        </div>

        <div className="history-total-pill">
          {totalRecords} Total Records
        </div>
      </section>

      <section className="history-summary-grid">
        <SummaryCard
          icon={<Activity size={20} />}
          label="Loaded Scans"
          value={summary.total}
          note={`Showing ${summary.total} of ${totalRecords}`}
        />

        <SummaryCard
          icon={<Leaf size={20} />}
          label="Healthy Leaves"
          value={summary.healthy}
          note="Healthy samples"
        />

        <SummaryCard
          icon={<ShieldCheck size={20} />}
          label="Diseased Leaves"
          value={summary.diseased}
          note="Requires attention"
        />

        <SummaryCard
          icon={<Activity size={20} />}
          label="Avg Confidence"
          value={`${summary.avgConfidence}%`}
          note="Prediction reliability"
        />
      </section>

      <section className="history-toolbar">
        <div className="history-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by crop, disease, status or severity..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
      </section>

      {history.length === 0 ? (
        <div className="placeholder-page">
          <h2>No predictions found</h2>
          <p>Run a disease scan first. Saved predictions will appear here.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="placeholder-page">
          <h2>No matching scans</h2>
          <p>Try searching with another crop, disease or status.</p>
        </div>
      ) : (
        <section className="history-records-list">
          {filteredHistory.map((item) => (
            <article className="history-record-card" key={item._id}>
              <div className="record-left">
                <div className={`record-status-dot ${item.status || "unknown"}`} />

                <div>
                  <div className="record-title-row">
                    <h2>{item.disease || "Unknown Disease"}</h2>
                    <span className={`record-status ${item.status || "unknown"}`}>
                      {item.status || "unknown"}
                    </span>
                  </div>

                  <p>{item.class_name || "N/A"}</p>

                  <div className="record-meta-row">
                    <span>
                      <Leaf size={14} />
                      {item.crop || "N/A"}
                    </span>

                    <span>
                      <Calendar size={14} />
                      {formatDate(item.created_at)}
                    </span>

                    <span>
                      Severity: {item.severity || "Unknown"}
                    </span>
                  </div>

                  <div className="record-treatment">
                    {item.treatment
                      ? `${item.treatment.substring(0, 150)}...`
                      : "No treatment recommendation available."}
                  </div>
                </div>
              </div>

              <div className="record-right">
                <div className="record-confidence">
                  <strong>{item.confidence || 0}%</strong>
                  <span>{item.confidence_level || "N/A"}</span>
                  <div className="confidence-bar">
                    <div style={{ width: `${item.confidence || 0}%` }} />
                  </div>
                </div>

                <div className="record-actions">
                  <button
                    onClick={() => handleFeedbackSubmit(item, "correct")}
                    disabled={Boolean(item.feedback) || feedbackLoadingId === item._id}
                  >
                    <ThumbsUp size={14} />
                    Correct
                  </button>

                  <button
                    onClick={() => handleFeedbackSubmit(item, "wrong")}
                    disabled={Boolean(item.feedback) || feedbackLoadingId === item._id}
                  >
                    <ThumbsDown size={14} />
                    Wrong
                  </button>
                </div>

                {item.feedback && (
                  <small className="feedback-saved">
                    Feedback saved: {item.feedback}
                  </small>
                )}

                <button
                  className="history-report-btn"
                  onClick={() => downloadReport(item)}
                  disabled={reportLoadingId === item._id}
                >
                  <Download size={15} />
                  {reportLoadingId === item._id ? "Generating..." : "Download Report"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {hasMore && (
        <button
          className="history-load-more-btn"
          onClick={() => loadHistory(page + 1, true)}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading More..." : "Load More Scans"}
        </button>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, note }) {
  return (
    <div className="history-summary-card">
      <div className="history-summary-icon">{icon}</div>
      <span>{label}</span>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

export default History;