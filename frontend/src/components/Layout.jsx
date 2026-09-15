import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const linkStyle = ({ isActive }) => ({
        display: "block",
        padding: "12px 15px",
        marginBottom: "6px",
        borderRadius: "8px",
        textDecoration: "none",
        color: isActive ? "white" : "#374151",
        backgroundColor: isActive
            ? "#2563eb"
            : "transparent",
        fontWeight: isActive ? "600" : "500",
        transition: "0.2s"
    });

    return (
        <div className="app-layout">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        CRM
                    </div>

                    <div>
                        <h2>CRM System</h2>

                        <span>
                            Management Portal
                        </span>
                    </div>
                </div>


                {/* Navigation */}
                <nav className="sidebar-nav">

                    <div className="nav-section-title">
                        MAIN MENU
                    </div>

                    <NavLink
                        to="/dashboard"
                        style={linkStyle}
                    >
                        📊 Dashboard
                    </NavLink>

                    <NavLink
                        to="/customers"
                        style={linkStyle}
                    >
                        👥 Customers
                    </NavLink>

                    <NavLink
                        to="/leads"
                        style={linkStyle}
                    >
                        🎯 Leads
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        style={linkStyle}
                    >
                        ✅ Tasks
                    </NavLink>

                    <NavLink
                        to="/sales"
                        style={linkStyle}
                    >
                        💰 Sales Pipeline
                    </NavLink>

                </nav>


                {/* User section */}
                <div className="sidebar-user">

                    <div className="user-avatar">
                        {user?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <div className="user-info">

                        <strong>
                            {user?.fullName ||
                                "User"}
                        </strong>

                        <span>
                            {user?.role ||
                                "USER"}
                        </span>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="danger-button logout-button"
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default Layout;