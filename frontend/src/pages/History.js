import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Clock,
  Leaf,
  Activity,
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle,
  Download
} from "lucide-react";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [reportLoadingId, setReportLoadingId] = useState(null);
  const [feedbackLoadingId, setFeedbackLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const loadHistory = async (pageNumber = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/history?page=${pageNumber}&limit=10`
      );

      const data = response.data;
      const items = data.items || [];

      setHistory((prev) => (append ? [...prev, ...items] : items));
      setHasMore(data.has_more);
      setTotalRecords(data.total);
      setPage(data.page);
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

  const parseDate = (dateValue) => {
    if (!dateValue) return null;

    const dateString =
      typeof dateValue === "string" && !dateValue.endsWith("Z")
        ? `${dateValue}Z`
        : dateValue;

    return new Date(dateString);
  };

  const formatDate = (dateValue) => {
    const date = parseDate(dateValue);
    if (!date) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    });
  };

  const formatTime = (dateValue) => {
    const date = parseDate(dateValue);
    if (!date) return "N/A";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  const submitFeedback = async (item, feedbackValue) => {
    if (!item?._id) return;

    try {
      setFeedbackLoadingId(item._id);

      await axios.post("http://127.0.0.1:8000/feedback", {
        prediction_id: item._id,
        feedback: feedbackValue
      });

      setHistory((prev) =>
        prev.map((record) =>
          record._id === item._id
            ? { ...record, feedback: feedbackValue }
            : record
        )
      );
    } catch (error) {
      console.error("Feedback failed", error);
      alert("Unable to submit feedback. Please try again.");
    } finally {
      setFeedbackLoadingId(null);
    }
  };

  const downloadReport = async (item) => {
    if (!item) return;

    try {
      setReportLoadingId(item._id);

      const response = await axios.post(
        "http://127.0.0.1:8000/generate-report",
        item,
        { responseType: "blob" }
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf"
      });

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
      alert("Unable to download report. Please try again.");
    } finally {
      setReportLoadingId(null);
    }
  };

  const filteredHistory = history.filter((item) => {
    const keyword = searchText.toLowerCase();

    return (
      item.crop?.toLowerCase().includes(keyword) ||
      item.disease?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword)
    );
  });

  const summary = useMemo(() => {
    const total = history.length;
    const healthy = history.filter((x) =>
      x.disease?.toLowerCase().includes("healthy")
    ).length;
    const diseased = total - healthy;
    const avgConfidence =
      total > 0
        ? (
            history.reduce((sum, item) => sum + Number(item.confidence || 0), 0) /
            total
          ).toFixed(2)
        : 0;

    return { total, healthy, diseased, avgConfidence };
  }, [history]);

  const getStatusIcon = (status) => {
    if (status === "success") return <CheckCircle size={18} />;
    if (status === "uncertain") return <AlertTriangle size={18} />;
    return <Activity size={18} />;
  };

  return (
    <div className="history-page">
      <section className="page-hero history-hero">
        <div>
          <h1>Prediction History</h1>
          <p>
            Showing {history.length} of {totalRecords} saved crop disease scans.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="placeholder-page">
          <h2>Loading history...</h2>
        </div>
      ) : history.length === 0 ? (
        <div className="placeholder-page">
          <h2>No predictions found</h2>
          <p>Run a disease scan first. Saved predictions will appear here.</p>
        </div>
      ) : (
        <>
          <div className="history-summary-grid">
            <div className="history-summary-card">
              <span>Loaded Scans</span>
              <h2>{summary.total}</h2>
            </div>

            <div className="history-summary-card">
              <span>Diseased Leaves</span>
              <h2>{summary.diseased}</h2>
            </div>

            <div className="history-summary-card">
              <span>Healthy Leaves</span>
              <h2>{summary.healthy}</h2>
            </div>

            <div className="history-summary-card">
              <span>Avg Confidence</span>
              <h2>{summary.avgConfidence}%</h2>
            </div>
          </div>

          <div className="history-toolbar">
            <div className="history-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search loaded scans by crop, disease or status..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="history-grid">
            {filteredHistory.map((item) => (
              <div className="history-card" key={item._id}>
                <div className="history-card-header">
                  <div className={`history-status ${item.status}`}>
                    {getStatusIcon(item.status)}
                    <span>{item.status}</span>
                  </div>

                  <span className="history-date">
                    {formatDate(item.created_at)}
                  </span>
                </div>

                <h2>{item.disease}</h2>
                <p className="class-name">{item.class_name}</p>

                <div className="history-confidence">
                  <div>
                    <span>Confidence</span>
                    <strong>{item.confidence}%</strong>
                  </div>
                  <div className="confidence-bar">
                    <div style={{ width: `${item.confidence || 0}%` }}></div>
                  </div>
                </div>

                <div className="history-stats">
                  <div>
                    <Leaf size={18} />
                    <span>Crop</span>
                    <strong>{item.crop}</strong>
                  </div>

                  <div>
                    <ShieldCheck size={18} />
                    <span>Reliability</span>
                    <strong>{item.confidence_level}</strong>
                  </div>

                  <div>
                    <Activity size={18} />
                    <span>Severity</span>
                    <strong>{item.severity}</strong>
                  </div>

                  <div>
                    <Clock size={18} />
                    <span>Time</span>
                    <strong>{formatTime(item.created_at)}</strong>
                  </div>
                </div>

                <div className="feedback-box compact-feedback">
                  <p>Was this prediction correct?</p>

                  <div className="feedback-actions">
                    <button
                      className={
                        item.feedback === "correct"
                          ? "feedback-btn active"
                          : "feedback-btn"
                      }
                      onClick={() => submitFeedback(item, "correct")}
                      disabled={Boolean(item.feedback) || feedbackLoadingId === item._id}
                    >
                      👍 Correct
                    </button>

                    <button
                      className={
                        item.feedback === "wrong"
                          ? "feedback-btn active wrong"
                          : "feedback-btn wrong"
                      }
                      onClick={() => submitFeedback(item, "wrong")}
                      disabled={Boolean(item.feedback) || feedbackLoadingId === item._id}
                    >
                      👎 Wrong
                    </button>
                  </div>

                  {feedbackLoadingId === item._id && (
                    <small>Saving feedback...</small>
                  )}

                  {item.feedback && (
                    <small>Feedback saved: {item.feedback}</small>
                  )}
                </div>

                <button
                  className="report-btn"
                  onClick={() => downloadReport(item)}
                  disabled={reportLoadingId === item._id}
                >
                  <Download size={18} />
                  {reportLoadingId === item._id
                    ? "Generating Report..."
                    : "Download PDF Report"}
                </button>

                <div className="history-advice">
                  <p>
                    <strong>Treatment:</strong> {item.treatment}
                  </p>
                  <p>
                    <strong>Prevention:</strong> {item.prevention}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              className="report-btn"
              onClick={() => loadHistory(page + 1, true)}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading More..." : "Load More Scans"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default History;