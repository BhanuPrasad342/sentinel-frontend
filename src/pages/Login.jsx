import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!username || !password) {
            setError("Please enter your username and password.");
            return;
        }

        setLoading(true);

        try {
            const credentials = btoa(`${username}:${password}`);

            const response = await fetch(
                "http://localhost:8081/api/alerts",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Basic ${credentials}`,
                    },
                }
            );

            if (response.status === 401 || response.status === 403) {
                setError("Invalid manager credentials.");
                return;
            }

            if (!response.ok) {
                setError("Unable to connect to SentinelUBA server.");
                return;
            }

            /*
             * Store credentials temporarily for the current
             * browser session so the dashboard can use them.
             */
            sessionStorage.setItem("managerUsername", username);
            sessionStorage.setItem("managerPassword", password);

            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            setError(
                "Could not connect to SentinelUBA server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                <div className="login-brand">
                    Sentinel<span>UBA</span>
                </div>

                <div className="login-badge">
                    SECURE MANAGER ACCESS
                </div>

                <h1>
                    Welcome back
                </h1>

                <p className="login-description">
                    Sign in to access the SentinelUBA security
                    monitoring dashboard.
                </p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter manager username"
                            autoComplete="username"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                    </div>


                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Authenticating..."
                            : "Sign In →"}
                    </button>

                </form>


                <div className="login-security">

                    <span>●</span>

                    Secure connection to SentinelUBA

                </div>


                <button
                    className="back-home"
                    onClick={() => navigate("/")}
                >
                    ← Back to SentinelUBA
                </button>

            </div>

        </div>
    );
}

export default Login;