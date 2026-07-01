import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  CheckCheck,
  Clock,
  FlaskConical,
  Trash2,
} from "lucide-react";

import PageLoader from "../../components/common/PageLoader";
import {
  clearNotifications,
  createTestNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await getNotifications({
        notification_type: filter,
        unread_only: unreadOnly,
      });

      setNotifications(data.items || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error("Notifications load failed", error);
      toast.error("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, unreadOnly]);

  const groupedNotifications = useMemo(() => {
    return {
      today: notifications.filter((item) => getDateGroup(item.created_at) === "today"),
      yesterday: notifications.filter((item) => getDateGroup(item.created_at) === "yesterday"),
      earlier: notifications.filter((item) => getDateGroup(item.created_at) === "earlier"),
    };
  }, [notifications]);

  const handleCreateTest = async () => {
    try {
      await createTestNotification();
      toast.success("Test notification created.");
      loadNotifications();
    } catch (error) {
      console.error("Create test notification failed", error);
      toast.error("Unable to create test notification.");
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      toast.success("Notification marked as read.");
      loadNotifications();
    } catch (error) {
      console.error("Mark read failed", error);
      toast.error("Unable to mark notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read.");
      loadNotifications();
    } catch (error) {
      console.error("Mark all read failed", error);
      toast.error("Unable to mark all as read.");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      toast.success("Notification deleted.");
      loadNotifications();
    } catch (error) {
      console.error("Delete notification failed", error);
      toast.error("Unable to delete notification.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all notifications?")) return;

    try {
      await clearNotifications();
      toast.success("All notifications cleared.");
      loadNotifications();
    } catch (error) {
      console.error("Clear notifications failed", error);
      toast.error("Unable to clear notifications.");
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Notifications"
        subtitle="Checking your latest AgriAI alerts and updates..."
      />
    );
  }

  return (
    <div className="notifications-page">
      <section className="notifications-hero">
        <div>
          <p className="eyebrow">NOTIFICATION CENTER</p>
          <h1>Notifications</h1>
          <p>
            Review crop alerts, reports, system messages and future weather advisories.
          </p>
        </div>

        <div className="notifications-hero-pill">
          <Bell size={16} />
          {unreadCount} Unread
        </div>
      </section>

      <section className="notifications-toolbar">
        <div className="notifications-filters">
          <button
            className={filter === "" ? "active" : ""}
            onClick={() => setFilter("")}
          >
            All
          </button>
          <button
            className={filter === "prediction" ? "active" : ""}
            onClick={() => setFilter("prediction")}
          >
            Prediction
          </button>
          <button
            className={filter === "report" ? "active" : ""}
            onClick={() => setFilter("report")}
          >
            Reports
          </button>
          <button
            className={filter === "system" ? "active" : ""}
            onClick={() => setFilter("system")}
          >
            System
          </button>
        </div>

        <div className="notifications-actions">
          <button onClick={() => setUnreadOnly((previous) => !previous)}>
            {unreadOnly ? "Show All" : "Unread Only"}
          </button>

          <button onClick={handleMarkAllRead}>
            <CheckCheck size={15} />
            Mark All Read
          </button>

          <button onClick={handleCreateTest}>
            <FlaskConical size={15} />
            Test
          </button>

          <button className="danger" onClick={handleClearAll}>
            <Trash2 size={15} />
            Clear All
          </button>
        </div>
      </section>

      <section className="notifications-list-card">
        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <Bell size={42} />
            <h2>No notifications found</h2>
            <p>New prediction, report and system updates will appear here.</p>
          </div>
        ) : (
          <>
            <NotificationGroup
              title="Today"
              items={groupedNotifications.today}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />

            <NotificationGroup
              title="Yesterday"
              items={groupedNotifications.yesterday}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />

            <NotificationGroup
              title="Earlier"
              items={groupedNotifications.earlier}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          </>
        )}
      </section>
    </div>
  );
}

function NotificationGroup({ title, items, onMarkRead, onDelete }) {
  if (!items.length) return null;

  return (
    <div className="notification-group">
      <h3>{title}</h3>

      <div className="notification-group-list">
        {items.map((item) => (
          <NotificationItem
            key={item.notification_id}
            item={item}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function NotificationItem({ item, onMarkRead, onDelete }) {
  return (
    <div className={item.is_read ? "notification-item read" : "notification-item unread"}>
      <div className={`notification-type-dot ${item.type}`} />

      <div className="notification-content">
        <div className="notification-title-row">
          <h4>{item.title}</h4>
          <span>{item.type}</span>
        </div>

        <p>{item.message}</p>

        <small>
          <Clock size={13} />
          {formatDateTime(item.created_at)}
        </small>
      </div>

      <div className="notification-item-actions">
        {!item.is_read && (
          <button onClick={() => onMarkRead(item.notification_id)}>
            <CheckCheck size={15} />
          </button>
        )}

        <button onClick={() => onDelete(item.notification_id)}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function getDateGroup(value) {
  if (!value) return "earlier";

  const date = new Date(value);
  const now = new Date();

  const today = now.toDateString();

  const yesterdayDate = new Date();
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = yesterdayDate.toDateString();

  if (date.toDateString() === today) return "today";
  if (date.toDateString() === yesterday) return "yesterday";
  return "earlier";
}

function formatDateTime(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default Notifications;