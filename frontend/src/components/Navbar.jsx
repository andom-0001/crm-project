import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav
            style={{
                padding: "15px 30px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                gap: "20px",
                alignItems: "center"
            }}
        >
            <strong>CRM</strong>

            <Link to="/dashboard">Dashboard</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/leads">Leads</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/sales">Sales</Link>
            {user?.role === "ADMIN" && (
                <Link to="/users">Users</Link>
            )}

            <span style={{ marginLeft: "auto" }}>
                {user?.fullName} ({user?.role})
            </span>

            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;