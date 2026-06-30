import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Activity,
  Download,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";

import { getHistory } from "../../services/historyService";
import { submitFeedback } from "../../services/feedbackService";
import { generateReport } from "../../services/reportService";

function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoadingId, setFeedbackLoadingId] = useState(null);
  const [reportLoadingId, setReportLoadingId] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    severity: "",
    sort: "-created_at",
  });

  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalRecords / filters.limit));

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(filters);
      setRecords(data.items || []);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("History fetch failed", error);
      setRecords([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilter = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
      page: field === "page" ? value : 1,
    }));
  };

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

      setRecords((previous) =>
        previous.map((record) =>
          record._id === item._id
            ? { ...record, feedback: feedbackValue }
            : record
        )
      );
    } catch (error) {
      console.error("Feedback failed", error);
      toast.error("Unable to submit feedback.");
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
      toast.error("Unable to download report.");
    } finally {
      setReportLoadingId(null);
    }
  };

  return (
    <div className="history-page enterprise-history-page">
      <section className="history-hero">
        <div>
          <p className="eyebrow">SCAN RECORDS</p>
          <h1>Prediction History</h1>
          <p>
            Search, filter and manage crop disease predictions with feedback and report downloads.
          </p>
        </div>

        <div className="history-total-pill">
          {totalRecords} Records
        </div>
      </section>

      <section className="history-control-panel">
        <div className="history-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search crop, disease, class, status..."
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
          />
        </div>

        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="uncertain">Uncertain</option>
          <option value="poor_quality">Poor Quality</option>
        </select>

        <select
          value={filters.severity}
          onChange={(event) => updateFilter("severity", event.target.value)}
        >
          <option value="">All Severity</option>
          <option value="None">None</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Very High">Very High</option>
        </select>

        <select
          value={filters.sort}
          onChange={(event) => updateFilter("sort", event.target.value)}
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-confidence">Confidence High</option>
          <option value="confidence">Confidence Low</option>
        </select>
      </section>

      <section className="history-table-card">
        <div className="history-table-header">
          <span>Crop</span>
          <span>Disease</span>
          <span>Status</span>
          <span>Confidence</span>
          <span>Severity</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="history-empty-row">
            <Activity size={22} />
            Loading prediction records...
          </div>
        ) : records.length === 0 ? (
          <div className="history-empty-row">
            No prediction records found.
          </div>
        ) : (
          records.map((item) => (
            <div className="history-table-row" key={item._id}>
              <div className="history-crop-cell">
                <div className="crop-avatar">
                  {(item.crop || "A").charAt(0)}
                </div>
                <strong>{item.crop || "N/A"}</strong>
              </div>

              <div>
                <strong>{item.disease || "Unknown"}</strong>
                <small>{item.class_name || "N/A"}</small>
              </div>

              <div>
                <span className={`status-badge ${item.status || "unknown"}`}>
                  {item.status || "unknown"}
                </span>
              </div>

              <div className="confidence-cell">
                <strong>{item.confidence || 0}%</strong>
                <div className="mini-confidence-bar">
                  <div style={{ width: `${item.confidence || 0}%` }} />
                </div>
              </div>

              <div>
                <span className="severity-badge-table">
                  {item.severity || "Unknown"}
                </span>
              </div>

              <div className="date-cell">
                {formatDate(item.created_at)}
              </div>

              <div className="table-actions">
                <button
                  title="Mark correct"
                  onClick={() => handleFeedbackSubmit(item, "correct")}
                  disabled={Boolean(item.feedback) || feedbackLoadingId === item._id}
                >
                  <ThumbsUp size={14} />
                </button>

                <button
                  title="Mark wrong"
                  onClick={() => handleFeedbackSubmit(item, "wrong")}
                  disabled={Boolean(item.feedback) || feedbackLoadingId === item._id}
                >
                  <ThumbsDown size={14} />
                </button>

                <button
                  title="Download report"
                  onClick={() => downloadReport(item)}
                  disabled={reportLoadingId === item._id}
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="history-pagination">
        <span>
          Page {filters.page} of {totalPages}
        </span>

        <div>
          <button
            disabled={filters.page <= 1}
            onClick={() => updateFilter("page", filters.page - 1)}
          >
            Previous
          </button>

          <button
            disabled={filters.page >= totalPages}
            onClick={() => updateFilter("page", filters.page + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default History;