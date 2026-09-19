import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/alerts.jsx";
import Employees from "./pages/employees.jsx";
import Devices from "./pages/Devices";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/alerts" element={<Alerts />} />
                <Route
                    path="/dashboard/employees"
                    element={<Employees />}
                />
                <Route
                    path="/dashboard/devices"
                    element={<Devices />}
                />
                <Route
                    path="/dashboard/activity"
                    element={<Activity />}
                />
                <Route
                    path="/dashboard/settings"
                    element={<Settings />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;