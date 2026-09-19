import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8081";

function Devices() {
    const navigate = useNavigate();

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = sessionStorage.getItem("managerUsername");
    const password = sessionStorage.getItem("managerPassword");

    useEffect(() => {
        if (!username || !password) {
            navigate("/login");
            return;
        }

        fetchDevices();
    }, [navigate, username, password]);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            setError("");

            const credentials = btoa(`${username}:${password}`);

            const response = await fetch(`${API_URL}/api/devices`, {
                method: "GET",
                headers: {
                    Authorization: `Basic ${credentials}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                sessionStorage.clear();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load devices");
            }

            const data = await response.json();
            setDevices(data);
        } catch (err) {
            console.error("Device fetch error:", err);
            setError("Unable to load devices.");
        } finally {
            setLoading(false);
        }
    };

    const activeCount = useMemo(
        () =>
            devices.filter(
                (device) =>
                    device.status &&
                    device.status.toUpperCase() === "ACTIVE"
            ).length,
        [devices]
    );

    const inactiveCount = devices.length - activeCount;

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard-page devices-page">

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

                    <button className="nav-item active">
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
                            DEVICE MANAGEMENT
                        </span>

                        <h1>Devices</h1>

                        <p>
                            Monitor and manage registered endpoint devices.
                        </p>
                    </div>

                    <div className="dashboard-header-actions">

                        <button
                            className="action-button"
                            onClick={fetchDevices}
                        >
                            ↻ Refresh
                        </button>

                        <div className="profile">
                            <div className="profile-avatar">
                                {username
                                    ? username.charAt(0).toUpperCase()
                                    : "M"}
                            </div>

                            <div>
                                <strong>{username || "Manager"}</strong>
                                <span>Security Manager</span>
                            </div>
                        </div>

                    </div>

                </header>

                <section className="stats-grid">

                    <div className="stat-card">
                        <span className="stat-label">TOTAL DEVICES</span>
                        <strong>{devices.length}</strong>
                        <small>Registered endpoints</small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">ACTIVE DEVICES</span>
                        <strong>{activeCount}</strong>
                        <small>Currently active</small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">INACTIVE DEVICES</span>
                        <strong>{inactiveCount}</strong>
                        <small>Requires attention</small>
                    </div>

                </section>

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>
                            <h2>Device Directory</h2>
                            <p>
                                All endpoint devices registered with SentinelUBA.
                            </p>
                        </div>

                        <span className="section-count">
                            {devices.length} devices
                        </span>

                    </div>

                    {loading && (
                        <div className="empty-state">
                            <strong>Loading devices...</strong>
                            <span>
                                Retrieving registered endpoints.
                            </span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="empty-state">
                            <strong>Unable to load devices</strong>
                            <span>{error}</span>

                            <button
                                className="action-button"
                                onClick={fetchDevices}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && devices.length === 0 && (
                        <div className="empty-state">
                            <strong>No devices registered</strong>
                            <span>
                                Registered endpoint devices will appear here.
                            </span>
                        </div>
                    )}

                    {!loading && !error && devices.length > 0 && (
                        <div className="device-table">

                            <div className="device-table-header">
                                <span>DEVICE</span>
                                <span>EMPLOYEE</span>
                                <span>HOSTNAME</span>
                                <span>OPERATING SYSTEM</span>
                                <span>STATUS</span>
                            </div>

                            {devices.map((device) => (

                                <div
                                    className="device-row"
                                    key={device.id}
                                >

                                    <div className="device-info">
                                        <div className="device-icon">
                                            ▣
                                        </div>

                                        <div>
                                            <strong>
                                                {device.deviceName ||
                                                    "Unnamed Device"}
                                            </strong>

                                            <span>
                                                {device.deviceId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="device-employee">
                                        <strong>
                                            {device.employeeName ||
                                                "Unassigned"}
                                        </strong>

                                        <span>
                                            {device.employeeId || "—"}
                                        </span>
                                    </div>

                                    <div className="device-hostname">
                                        {device.hostname || "—"}
                                    </div>

                                    <div className="device-os">
                                        {device.operatingSystem || "—"}
                                    </div>

                                    <div>
                                        <span
                                            className={`status-badge ${
                                                device.status &&
                                                device.status.toUpperCase() ===
                                                "ACTIVE"
                                                    ? "status-active"
                                                    : "status-inactive"
                                            }`}
                                        >
                                            {device.status || "UNKNOWN"}
                                        </span>
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

export default Devices;
