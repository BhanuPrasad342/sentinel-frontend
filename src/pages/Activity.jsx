import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Activity() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = sessionStorage.getItem("managerUsername");
    const password = sessionStorage.getItem("managerPassword");

    useEffect(() => {
        if (!username || !password) {
            navigate("/login");
            return;
        }

        fetchEvents();
    }, [navigate, username, password]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const credentials = btoa(`${username}:${password}`);

            const response = await fetch(
                `${API_URL}/api/activity-events`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Basic ${credentials}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                sessionStorage.clear();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load activity events");
            }

            const data = await response.json();

            setEvents(
                [...data].sort(
                    (a, b) =>
                        new Date(b.timestamp) -
                        new Date(a.timestamp)
                )
            );
        } catch (err) {
            console.error("Activity fetch error:", err);
            setError("Unable to load activity events.");
        } finally {
            setLoading(false);
        }
    };

    const downloadCount = useMemo(
        () =>
            events.filter(
                (event) =>
                    event.action?.toUpperCase() === "DOWNLOAD"
            ).length,
        [events]
    );

    const loginCount = useMemo(
        () =>
            events.filter(
                (event) =>
                    event.action?.toUpperCase() === "LOGIN"
            ).length,
        [events]
    );

    const transferCount = useMemo(
        () =>
            events.filter(
                (event) =>
                    event.action?.toUpperCase() ===
                    "EXTERNAL_TRANSFER"
            ).length,
        [events]
    );

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "—";

        const date = new Date(timestamp);

        return date.toLocaleString();
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard-page activity-page">

            <aside className="dashboard-sidebar">

                <div className="sidebar-logo">
                    <div className="sidebar-logo-mark">S</div>

                    <div>
                        <strong>SentinelUBA</strong>
                        <span>INSIDER RISK PLATFORM</span>
                    </div>
                </div>

                <nav className="dashboard-nav">

                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>◉</span>
                        Overview
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard/alerts")
                        }
                    >
                        <span>⚠</span>
                        Alerts
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard/employees")
                        }
                    >
                        <span>♙</span>
                        Employees
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard/devices")
                        }
                    >
                        <span>▣</span>
                        Devices
                    </button>

                    <button className="nav-item active">
                        <span>◌</span>
                        Activity
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/settings")}
                    >
                        <span>⚙</span>
                        Settings
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <div className="monitoring-status">
                        <div className="status-dot"></div>

                        <div>
                            <strong>Monitoring Active</strong>
                            <span>Agent services online</span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>

                </div>

            </aside>

            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>
                        <span className="dashboard-eyebrow">
                            ACTIVITY MONITORING
                        </span>

                        <h1>Activity</h1>

                        <p>
                            Monitor endpoint activity collected
                            by SentinelUBA agents.
                        </p>
                    </div>

                    <div className="dashboard-header-actions">

                        <button
                            className="action-button"
                            onClick={fetchEvents}
                        >
                            ↻ Refresh
                        </button>

                        <div className="profile">
                            <div className="profile-avatar">
                                {username
                                    ? username
                                        .charAt(0)
                                        .toUpperCase()
                                    : "M"}
                            </div>

                            <div>
                                <strong>
                                    {username || "Manager"}
                                </strong>

                                <span>
                                    Security Manager
                                </span>
                            </div>
                        </div>

                    </div>

                </header>

                <section className="stats-grid">

                    <div className="stat-card">
                        <span className="stat-label">
                            TOTAL EVENTS
                        </span>

                        <strong>{events.length}</strong>

                        <small>
                            Agent activity events
                        </small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">
                            DOWNLOADS
                        </span>

                        <strong>{downloadCount}</strong>

                        <small>
                            File download events
                        </small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">
                            LOGINS
                        </span>

                        <strong>{loginCount}</strong>

                        <small>
                            Authentication events
                        </small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">
                            EXTERNAL TRANSFERS
                        </span>

                        <strong>{transferCount}</strong>

                        <small>
                            File transfer events
                        </small>
                    </div>

                </section>

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>
                            <h2>Activity Events</h2>

                            <p>
                                Events received from registered
                                endpoint agents.
                            </p>
                        </div>

                        <span className="section-count">
                            {events.length} events
                        </span>

                    </div>

                    {loading && (
                        <div className="empty-state">
                            <strong>
                                Loading activity...
                            </strong>

                            <span>
                                Retrieving agent events.
                            </span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="empty-state">

                            <strong>
                                Unable to load activity
                            </strong>

                            <span>{error}</span>

                            <button
                                className="action-button"
                                onClick={fetchEvents}
                            >
                                Try Again
                            </button>

                        </div>
                    )}

                    {!loading &&
                        !error &&
                        events.length === 0 && (
                            <div className="empty-state">

                                <strong>
                                    No activity events
                                </strong>

                                <span>
                                    Events collected from
                                    endpoint agents will appear
                                    here.
                                </span>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        events.length > 0 && (
                            <div className="activity-table">

                                <div className="activity-table-header">
                                    <span>TIME</span>
                                    <span>USER</span>
                                    <span>EVENT</span>
                                    <span>ACTION</span>
                                    <span>RESOURCE</span>
                                    <span>IP ADDRESS</span>
                                </div>

                                {events.map((event) => (

                                    <div
                                        className="activity-row"
                                        key={event.id}
                                    >

                                        <div className="activity-time">
                                            {formatTimestamp(
                                                event.timestamp
                                            )}
                                        </div>

                                        <div className="activity-user">
                                            User #{event.userId}
                                        </div>

                                        <div className="activity-event-type">
                                            {event.eventType ||
                                                "—"}
                                        </div>

                                        <div>
                                            <span
                                                className={`activity-action activity-${event.action
                                                    ?.toLowerCase()
                                                    .replace(
                                                        /_/g,
                                                        "-"
                                                    )}`}
                                            >
                                                {event.action ||
                                                    "UNKNOWN"}
                                            </span>
                                        </div>

                                        <div
                                            className="activity-resource"
                                            title={
                                                event.resource ||
                                                ""
                                            }
                                        >
                                            {event.resource ||
                                                "—"}
                                        </div>

                                        <div className="activity-ip">
                                            {event.ipAddress ||
                                                "—"}
                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                </section>

            </main>

        </div>
    );
}

export default Activity;