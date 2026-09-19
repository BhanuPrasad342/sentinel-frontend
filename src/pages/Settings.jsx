import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const [backendStatus, setBackendStatus] = useState("CHECKING");
    const [websocketStatus, setWebsocketStatus] = useState("NOT CONNECTED");

    const username = sessionStorage.getItem("managerUsername");
    const password = sessionStorage.getItem("managerPassword");

    useEffect(() => {
        if (!username || !password) {
            navigate("/login");
            return;
        }

        checkBackend();

        const wsClient = window.sentinelAlertWebSocket;

        if (wsClient?.connected) {
            setWebsocketStatus("CONNECTED");
        }
    }, [navigate, username, password]);

    const checkBackend = async () => {
        try {
            const credentials = btoa(`${username}:${password}`);

            const response = await fetch(
                "http://localhost:8081/api/alerts",
                {
                    headers: {
                        Authorization: `Basic ${credentials}`
                    }
                }
            );

            if (response.ok) {
                setBackendStatus("CONNECTED");
            } else {
                setBackendStatus("ERROR");
            }
        } catch (error) {
            console.error("Backend connection check failed:", error);
            setBackendStatus("OFFLINE");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard-page settings-page">

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

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard/activity")
                        }
                    >
                        <span>◌</span>
                        Activity
                    </button>

                    <button className="nav-item active">
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
                            SYSTEM CONFIGURATION
                        </span>

                        <h1>Settings</h1>

                        <p>
                            View SentinelUBA platform and
                            connection information.
                        </p>
                    </div>

                    <div className="profile">
                        <div className="profile-avatar">
                            {username
                                ? username.charAt(0).toUpperCase()
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

                </header>

                <section className="settings-grid">

                    <div className="settings-card">

                        <div className="settings-card-header">
                            <span className="settings-icon">♙</span>

                            <div>
                                <h2>Manager Profile</h2>
                                <p>Current authenticated account</p>
                            </div>
                        </div>

                        <div className="settings-list">

                            <div className="settings-row">
                                <span>Username</span>
                                <strong>
                                    {username || "Manager"}
                                </strong>
                            </div>

                            <div className="settings-row">
                                <span>Role</span>
                                <strong>Security Manager</strong>
                            </div>

                            <div className="settings-row">
                                <span>Authentication</span>
                                <strong>Basic Authentication</strong>
                            </div>

                        </div>

                    </div>

                    <div className="settings-card">

                        <div className="settings-card-header">
                            <span className="settings-icon">◉</span>

                            <div>
                                <h2>System Status</h2>
                                <p>Current platform connectivity</p>
                            </div>
                        </div>

                        <div className="settings-list">

                            <div className="settings-row">
                                <span>Backend API</span>

                                <strong
                                    className={
                                        backendStatus === "CONNECTED"
                                            ? "settings-status online"
                                            : "settings-status"
                                    }
                                >
                                    {backendStatus}
                                </strong>
                            </div>

                            <div className="settings-row">
                                <span>WebSocket</span>

                                <strong
                                    className={
                                        websocketStatus === "CONNECTED"
                                            ? "settings-status online"
                                            : "settings-status"
                                    }
                                >
                                    {websocketStatus}
                                </strong>
                            </div>

                            <div className="settings-row">
                                <span>Monitoring</span>

                                <strong className="settings-status online">
                                    ACTIVE
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="settings-card">

                        <div className="settings-card-header">
                            <span className="settings-icon">▣</span>

                            <div>
                                <h2>Platform</h2>
                                <p>SentinelUBA environment</p>
                            </div>
                        </div>

                        <div className="settings-list">

                            <div className="settings-row">
                                <span>Application</span>
                                <strong>SentinelUBA</strong>
                            </div>

                            <div className="settings-row">
                                <span>Backend</span>
                                <strong>Spring Boot</strong>
                            </div>

                            <div className="settings-row">
                                <span>Database</span>
                                <strong>PostgreSQL</strong>
                            </div>

                            <div className="settings-row">
                                <span>Frontend</span>
                                <strong>React</strong>
                            </div>

                        </div>

                    </div>

                    <div className="settings-card">

                        <div className="settings-card-header">
                            <span className="settings-icon">⚙</span>

                            <div>
                                <h2>Monitoring Configuration</h2>
                                <p>Endpoint monitoring information</p>
                            </div>
                        </div>

                        <div className="settings-list">

                            <div className="settings-row">
                                <span>Agent Monitoring</span>
                                <strong className="settings-status online">
                                    ENABLED
                                </strong>
                            </div>

                            <div className="settings-row">
                                <span>Event Collection</span>
                                <strong className="settings-status online">
                                    ENABLED
                                </strong>
                            </div>

                            <div className="settings-row">
                                <span>Real-time Alerts</span>
                                <strong className="settings-status online">
                                    ENABLED
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Settings;