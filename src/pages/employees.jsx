import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = sessionStorage.getItem("managerUsername");
    const password = sessionStorage.getItem("managerPassword");

    const goToDashboard = () => {
        navigate("/dashboard");
    };

    const goToAlerts = () => {
        navigate("/dashboard/alerts");
    };

    const goToEmployees = () => {
        navigate("/dashboard/employees");
    };

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            const credentials = btoa(`${username}:${password}`);

            const response = await fetch(
                `${API_BASE}/api/users`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Basic ${credentials}`,
                    },
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                sessionStorage.clear();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to load employees"
                );
            }

            const data = await response.json();

            setEmployees(data);

        } catch (err) {
            console.error(
                "Employee loading error:",
                err
            );

            setError(
                "Unable to load employees."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const getStatusClass = (status) => {
        if (!status) {
            return "employee-status inactive";
        }

        const normalized = status.toLowerCase();

        if (
            normalized === "active" ||
            normalized === "enabled"
        ) {
            return "employee-status active";
        }

        return "employee-status inactive";
    };

    useEffect(() => {
        if (!username || !password) {
            navigate("/login");
            return;
        }

        loadEmployees();
    }, []);

    return (
        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-logo">

                    <div className="sidebar-logo-mark">
                        S
                    </div>

                    <div>
                        <strong>
                            SentinelUBA
                        </strong>

                        <span>
                            SECURITY PLATFORM
                        </span>
                    </div>

                </div>


                <nav className="dashboard-nav">

                    {/* OVERVIEW */}

                    <button
                        type="button"
                        className="nav-item"
                        onClick={goToDashboard}
                    >
                        <span>◉</span>
                        Overview
                    </button>


                    {/* ALERTS */}

                    <button
                        type="button"
                        className="nav-item"
                        onClick={goToAlerts}
                    >
                        <span>⚠</span>
                        Alerts
                    </button>


                    {/* EMPLOYEES */}

                    <button
                        type="button"
                        className="nav-item active"
                        onClick={goToEmployees}
                    >
                        <span>♙</span>
                        Employees
                    </button>


                    {/* DEVICES */}

                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/devices")}
                    >
                        <span>▣</span>
                        Devices
                    </button>


                    {/* ACTIVITY */}
                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/activity")}
                    >
                        <span>◌</span>
                        Activity
                    </button>


                    {/* SETTINGS */}

                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard/settings")}
                    >
                        <span>⚙</span>
                        Settings
                    </button>

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <div className="monitoring-status">

                        <span className="status-dot"></span>

                        <div>
                            <strong>
                                MONITORING ACTIVE
                            </strong>

                            <small>
                                All systems operational
                            </small>
                        </div>

                    </div>


                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="dashboard-main">

                {/* HEADER */}

                <header className="dashboard-header">

                    <div>

                        <span className="page-kicker">
                            ORGANIZATION
                        </span>

                        <h1>
                            Employees
                        </h1>

                        <p>
                            Manage monitored employees
                            and their access.
                        </p>

                    </div>


                    <div className="dashboard-profile">

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
                                SECURITY MANAGER
                            </span>

                        </div>

                    </div>

                </header>


                {/* EMPLOYEE SUMMARY */}

                <section className="employee-summary-grid">

                    <div className="employee-summary-card">

                        <span>
                            TOTAL EMPLOYEES
                        </span>

                        <strong>
                            {employees.length}
                        </strong>

                        <small>
                            Registered users
                        </small>

                    </div>


                    <div className="employee-summary-card">

                        <span>
                            ACTIVE
                        </span>

                        <strong>
                            {
                                employees.filter(
                                    (employee) =>
                                        employee.status &&
                                        employee.status
                                            .toLowerCase() ===
                                        "active"
                                ).length
                            }
                        </strong>

                        <small>
                            Currently active
                        </small>

                    </div>


                    <div className="employee-summary-card">

                        <span>
                            INACTIVE
                        </span>

                        <strong>
                            {
                                employees.filter(
                                    (employee) =>
                                        !employee.status ||
                                        employee.status
                                            .toLowerCase() !==
                                        "active"
                                ).length
                            }
                        </strong>

                        <small>
                            Inactive accounts
                        </small>

                    </div>

                </section>


                {/* EMPLOYEE LIST */}

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <span className="section-kicker">
                                USER DIRECTORY
                            </span>

                            <h2>
                                Employee Directory
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="refresh-button"
                            onClick={loadEmployees}
                        >
                            Refresh
                        </button>

                    </div>


                    {loading && (
                        <div className="employee-empty-state">
                            Loading employees...
                        </div>
                    )}


                    {!loading && error && (
                        <div className="employee-empty-state error">
                            {error}
                        </div>
                    )}


                    {!loading &&
                        !error &&
                        employees.length === 0 && (

                            <div className="employee-empty-state">
                                No employees found.
                            </div>

                        )}


                    {!loading &&
                        !error &&
                        employees.length > 0 && (

                            <div className="employee-table-wrapper">

                                <table className="employee-table">

                                    <thead>

                                    <tr>
                                        <th>EMPLOYEE</th>
                                        <th>EMPLOYEE ID</th>
                                        <th>EMAIL</th>
                                        <th>ROLE</th>
                                        <th>DEPARTMENT</th>
                                        <th>STATUS</th>
                                    </tr>

                                    </thead>


                                    <tbody>

                                    {employees.map(
                                        (employee) => (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                <td>

                                                    <div className="employee-name-cell">

                                                        <div className="employee-avatar">

                                                            {employee.name
                                                                ? employee.name
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()
                                                                : "U"}

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    employee.name ||
                                                                    "Unknown"
                                                                }
                                                            </strong>

                                                            <small>
                                                                User #
                                                                {
                                                                    employee.id
                                                                }
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                        <span className="employee-id">
                                                            {
                                                                employee.employeeId ||
                                                                "—"
                                                            }
                                                        </span>

                                                </td>


                                                <td>
                                                    {
                                                        employee.email ||
                                                        "—"
                                                    }
                                                </td>


                                                <td>

                                                        <span className="employee-role">
                                                            {
                                                                employee.role ||
                                                                "—"
                                                            }
                                                        </span>

                                                </td>


                                                <td>

                                                    {
                                                        employee.departmentId
                                                            ? `Department ${employee.departmentId}`
                                                            : "—"
                                                    }

                                                </td>


                                                <td>

                                                        <span
                                                            className={getStatusClass(
                                                                employee.status
                                                            )}
                                                        >
                                                            {
                                                                employee.status ||
                                                                "UNKNOWN"
                                                            }
                                                        </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </section>

            </main>

        </div>
    );
}

export default Employees;