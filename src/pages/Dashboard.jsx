import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectAlertWebSocket } from "../services/websocket";

function Dashboard() {

    const navigate = useNavigate();

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] =
        useState("CONNECTING");

    const username =
        sessionStorage.getItem("managerUsername");

    const password =
        sessionStorage.getItem("managerPassword");


    const getBasicAuth = () => {

        return "Basic " +
            btoa(`${username}:${password}`);

    };


    const logout = () => {

        sessionStorage.removeItem(
            "managerUsername"
        );

        sessionStorage.removeItem(
            "managerPassword"
        );

        navigate("/login");
    };


    const loadAlerts = async () => {

        try {

            setLoading(true);

            const response =
                await fetch(
                    "http://localhost:8081/api/alerts",
                    {
                        headers: {
                            Authorization:
                                getBasicAuth()
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

                throw new Error(
                    "Failed to load alerts"
                );
            }


            const data =
                await response.json();

            setAlerts(data);

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    const updateAlertStatus =
        async (alertId, status) => {

            try {

                const response =
                    await fetch(
                        `http://localhost:8081/api/alerts/${alertId}/status?status=${status}`,
                        {
                            method: "PUT",

                            headers: {
                                Authorization:
                                    getBasicAuth()
                            }
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to update alert"
                    );
                }


                await loadAlerts();

            } catch (error) {

                console.error(error);

                alert(
                    "Could not update alert."
                );
            }
        };


    useEffect(() => {

        if (!username || !password) {

            navigate("/login");

            return;
        }


        loadAlerts();


        const client =
            connectAlertWebSocket(
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


    const openAlerts =
        alerts.filter(
            alert =>
                alert.status === "OPEN"
        );


    const acknowledgedAlerts =
        alerts.filter(
            alert =>
                alert.status === "ACKNOWLEDGED"
        );


    const resolvedAlerts =
        alerts.filter(
            alert =>
                alert.status === "RESOLVED"
        );


    const criticalAlerts =
        alerts.filter(
            alert =>
                alert.riskLevel === "CRITICAL"
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
                        className="nav-item active"
                    >
                        <span>◈</span>
                        Overview
                    </button>


                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/alerts")}
                    >
                        <span>⚠</span>
                        Alerts
                    </button>


                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/employees")}
                    >
                        <span>♙</span>
                        Employees
                    </button>


                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/devices")}
                    >
                        <span>▣</span>
                        Devices
                    </button>


                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/activity")}
                    >
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

                    <div className="connection-status">

                        <span
                            className={
                                connectionStatus ===
                                "CONNECTED"
                                    ? "status-dot"
                                    : "status-dot offline"
                            }
                        >
                        </span>


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
                        className="logout-button"
                        onClick={logout}
                    >
                        Sign Out
                    </button>

                </div>

            </aside>


            {/* MAIN */}

            <main className="dashboard-main">


                {/* HEADER */}

                <header className="dashboard-header">

                    <div>

                        <div className="breadcrumb">
                            SECURITY / OVERVIEW
                        </div>


                        <h1>
                            Security Overview
                        </h1>


                        <p>
                            Monitor endpoint activity and
                            security alerts across your
                            organization.
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


                {/* STATISTICS */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <div className="stat-top">

                            <span>
                                OPEN ALERTS
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


                    <div className="stat-card">

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


                    <div className="stat-card">

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
                            Resolved incidents
                        </p>

                    </div>


                    <div className="stat-card critical-stat">

                        <div className="stat-top">

                            <span>
                                CRITICAL
                            </span>

                            <div className="stat-icon critical-icon">
                                !
                            </div>

                        </div>


                        <h2>
                            {criticalAlerts.length}
                        </h2>


                        <p>
                            Critical risk alerts
                        </p>

                    </div>

                </section>


                {/* ALERTS */}

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <span className="section-label">
                                REAL-TIME MONITORING
                            </span>

                            <h2>
                                Recent Security Alerts
                            </h2>

                        </div>


                        <button
                            className="refresh-button"
                            onClick={loadAlerts}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    <div className="alert-table">

                        <div className="table-header">

                            <span>RISK</span>
                            <span>USER</span>
                            <span>RISK SCORE</span>
                            <span>MESSAGE</span>
                            <span>STATUS</span>
                            <span>ACTION</span>

                        </div>


                        {loading ? (

                            <div className="table-empty">
                                Loading security alerts...
                            </div>

                        ) : alerts.length === 0 ? (

                            <div className="table-empty">
                                No security alerts found.
                            </div>

                        ) : (

                            alerts
                                .slice()
                                .sort(
                                    (a, b) =>
                                        b.id - a.id
                                )
                                .map(alert => (

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
                                                User #{alert.userId}
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


                {/* INFORMATION */}

                <section className="dashboard-bottom">


                    <div className="info-card">

                        <div className="info-card-header">

                            <div>

                                <span className="section-label">
                                    DETECTION ENGINE
                                </span>

                                <h3>
                                    Monitoring Status
                                </h3>

                            </div>


                            <span
                                className={
                                    `online-badge ${
                                        connectionStatus ===
                                        "CONNECTED"
                                            ? "connected"
                                            : "disconnected"
                                    }`
                                }
                            >
                                ● {connectionStatus}
                            </span>

                        </div>


                        <div className="monitoring-list">

                            <div>
                                <span>
                                    Endpoint Monitoring
                                </span>

                                <strong>
                                    ACTIVE
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Behavioral Detection
                                </span>

                                <strong>
                                    ACTIVE
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Risk Scoring
                                </span>

                                <strong>
                                    ACTIVE
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Real-Time Alerts
                                </span>

                                <strong>
                                    ACTIVE
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div className="info-card">

                        <div className="info-card-header">

                            <div>

                                <span className="section-label">
                                    PLATFORM
                                </span>

                                <h3>
                                    SentinelUBA
                                </h3>

                            </div>

                        </div>


                        <p className="platform-description">

                            Centralized endpoint activity
                            monitoring, behavioral detection,
                            risk scoring and real-time
                            security alert management.

                        </p>


                        <div className="platform-version">

                            <span>
                                Platform
                            </span>

                            <strong>
                                SentinelUBA v1.0
                            </strong>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;