import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectAlertWebSocket } from "../services/websocket";

function Alerts() {
    const navigate = useNavigate();

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [connectionStatus, setConnectionStatus] =
        useState("CONNECTING");

    const username =
        sessionStorage.getItem("managerUsername");

    const password =
        sessionStorage.getItem("managerPassword");

    const getBasicAuth = () => {
        return "Basic " + btoa(`${username}:${password}`);
    };

    const logout = () => {
        sessionStorage.removeItem("managerUsername");
        sessionStorage.removeItem("managerPassword");
        navigate("/login");
    };

    const loadAlerts = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8081/api/alerts",
                {
                    headers: {
                        Authorization: getBasicAuth()
                    }
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load alerts");
            }

            const data = await response.json();

            setAlerts(data);
        } catch (error) {
            console.error("Alerts error:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateAlertStatus = async (alertId, status) => {
        try {
            const response = await fetch(
                `http://localhost:8081/api/alerts/${alertId}/status?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: getBasicAuth()
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update alert");
            }

            await loadAlerts();
        } catch (error) {
            console.error("Alert update error:", error);
            alert("Could not update alert.");
        }
    };

    useEffect(() => {
        if (!username || !password) {
            navigate("/login");
            return;
        }

        loadAlerts();

        const client = connectAlertWebSocket(
            username,
            password,
            () => {
                loadAlerts();
            },
            (status) => {
                setConnectionStatus(status);
            }
        );

        return () => {
            client.deactivate();
        };
    }, []);

    const allAlerts = alerts;

    const openAlerts = alerts.filter(
        (alert) => alert.status === "OPEN"
    );

    const acknowledgedAlerts = alerts.filter(
        (alert) => alert.status === "ACKNOWLEDGED"
    );

    const resolvedAlerts = alerts.filter(
        (alert) => alert.status === "RESOLVED"
    );

    const filteredAlerts =
        activeFilter === "ALL"
            ? allAlerts
            : alerts.filter(
                (alert) =>
                    alert.status === activeFilter
            );

    return (
        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="sidebar-logo">
                    Sentinel<span>UBA</span>
                </div>

                <div className="sidebar-label">
                    SECURITY PLATFORM
                </div>

                <nav className="sidebar-nav">

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>◈</span>
                        Overview
                    </button>

                    <button
                        type="button"
                        className="nav-item active"
                    >
                        <span>⚠</span>
                        Alerts
                    </button>

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/dashboard/employees"
                            )
                        }
                    >
                        <span>♙</span>
                        Employees
                    </button>

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>▣</span>
                        Devices
                    </button>

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>◌</span>
                        Activity
                    </button>

                    <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>⚙</span>
                        Settings
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <div className="connection-status">

                        <span
                            className={
                                connectionStatus ===
                                "CONNECTED"
                                    ? "status-dot"
                                    : "status-dot offline"
                            }
                        />

                        <div>

                            <strong>
                                {
                                    connectionStatus ===
                                    "CONNECTED"
                                        ? "System Online"
                                        : "Connection Issue"
                                }
                            </strong>

                            <small>
                                WebSocket:{" "}
                                {connectionStatus}
                            </small>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={logout}
                    >
                        Sign Out
                    </button>

                </div>

            </aside>


            {/* MAIN */}

            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>

                        <div className="breadcrumb">
                            SECURITY / ALERTS
                        </div>

                        <h1>
                            Security Alerts
                        </h1>

                        <p>
                            Review, investigate and manage
                            detected security incidents.
                        </p>

                    </div>

                    <div className="manager-profile">

                        <div className="profile-avatar">

                            {username
                                ? username
                                    .charAt(0)
                                    .toUpperCase()
                                : "M"}

                        </div>

                        <div>

                            <strong>
                                {username}
                            </strong>

                            <small>
                                Security Manager
                            </small>

                        </div>

                    </div>

                </header>


                {/* FILTER / STATISTICS */}

                <section className="stats-grid">

                    <div
                        className="stat-card"
                        onClick={() =>
                            setActiveFilter("ALL")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-top">

                            <span>
                                TOTAL ALERTS
                            </span>

                            <div className="stat-icon open-icon">
                                !
                            </div>

                        </div>

                        <h2>
                            {allAlerts.length}
                        </h2>

                        <p>
                            All detected incidents
                        </p>

                    </div>


                    <div
                        className="stat-card"
                        onClick={() =>
                            setActiveFilter("OPEN")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-top">

                            <span>
                                OPEN
                            </span>

                            <div className="stat-icon open-icon">
                                !
                            </div>

                        </div>

                        <h2>
                            {openAlerts.length}
                        </h2>

                        <p>
                            Require attention
                        </p>

                    </div>


                    <div
                        className="stat-card"
                        onClick={() =>
                            setActiveFilter(
                                "ACKNOWLEDGED"
                            )
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-top">

                            <span>
                                ACKNOWLEDGED
                            </span>

                            <div className="stat-icon ack-icon">
                                ✓
                            </div>

                        </div>

                        <h2>
                            {acknowledgedAlerts.length}
                        </h2>

                        <p>
                            Under investigation
                        </p>

                    </div>


                    <div
                        className="stat-card critical-stat"
                        onClick={() =>
                            setActiveFilter("RESOLVED")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-top">

                            <span>
                                RESOLVED
                            </span>

                            <div className="stat-icon resolved-icon">
                                ✓
                            </div>

                        </div>

                        <h2>
                            {resolvedAlerts.length}
                        </h2>

                        <p>
                            Completed incidents
                        </p>

                    </div>

                </section>


                {/* ALERT QUEUE */}

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <span className="section-label">
                                INCIDENT MANAGEMENT
                            </span>

                            <h2>
                                Alert Queue
                            </h2>

                        </div>

                        <button
                            type="button"
                            className="refresh-button"
                            onClick={loadAlerts}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    <div className="alert-table">

                        <div className="table-header">

                            <span>
                                RISK
                            </span>

                            <span>
                                USER
                            </span>

                            <span>
                                RISK SCORE
                            </span>

                            <span>
                                MESSAGE
                            </span>

                            <span>
                                STATUS
                            </span>

                            <span>
                                ACTION
                            </span>

                        </div>


                        {loading ? (

                            <div className="table-empty">
                                Loading security alerts...
                            </div>

                        ) : filteredAlerts.length === 0 ? (

                            <div className="table-empty">
                                No alerts found.
                            </div>

                        ) : (

                            filteredAlerts
                                .slice()
                                .sort(
                                    (a, b) =>
                                        b.id - a.id
                                )
                                .map((alert) => (

                                    <div
                                        className="alert-row"
                                        key={alert.id}
                                    >

                                        <div>

                                            <span
                                                className={
                                                    `risk-badge ${
                                                        alert.riskLevel
                                                            ?.toLowerCase()
                                                    }`
                                                }
                                            >
                                                {alert.riskLevel}
                                            </span>

                                        </div>


                                        <div className="user-cell">

                                            <div className="mini-avatar">
                                                U
                                            </div>

                                            <span>
                                                User #
                                                {alert.userId}
                                            </span>

                                        </div>


                                        <div className="risk-score">

                                            <strong>
                                                {alert.riskScore}
                                            </strong>

                                            <div className="score-bar">

                                                <div
                                                    style={{
                                                        width:
                                                            `${Math.min(
                                                                alert.riskScore,
                                                                100
                                                            )}%`
                                                    }}
                                                />

                                            </div>

                                        </div>


                                        <div className="message-cell">
                                            {alert.message}
                                        </div>


                                        <div>

                                            <span
                                                className={
                                                    `status-badge ${
                                                        alert.status
                                                            ?.toLowerCase()
                                                    }`
                                                }
                                            >
                                                {alert.status}
                                            </span>

                                        </div>


                                        <div className="action-cell">

                                            {alert.status ===
                                                "OPEN" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="action-button acknowledge"
                                                            onClick={() =>
                                                                updateAlertStatus(
                                                                    alert.id,
                                                                    "ACKNOWLEDGED"
                                                                )
                                                            }
                                                        >
                                                            Acknowledge
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-button resolve"
                                                            onClick={() =>
                                                                updateAlertStatus(
                                                                    alert.id,
                                                                    "RESOLVED"
                                                                )
                                                            }
                                                        >
                                                            Resolve
                                                        </button>
                                                    </>
                                                )}

                                            {alert.status ===
                                                "ACKNOWLEDGED" && (
                                                    <button
                                                        type="button"
                                                        className="action-button resolve"
                                                        onClick={() =>
                                                            updateAlertStatus(
                                                                alert.id,
                                                                "RESOLVED"
                                                            )
                                                        }
                                                    >
                                                        Resolve
                                                    </button>
                                                )}

                                            {alert.status ===
                                                "RESOLVED" && (
                                                    <span className="resolved-text">
                                                    Completed
                                                </span>
                                                )}

                                        </div>

                                    </div>

                                ))

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Alerts;