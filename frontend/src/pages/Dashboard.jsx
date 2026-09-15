import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [stats, setStats] = useState({
        customers: 0,
        leads: 0,
        tasks: 0,
        sales: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    customersResponse,
                    leadsResponse,
                    tasksResponse,
                    salesResponse
                ] = await Promise.all([
                    api.get("/customers"),
                    api.get("/leads"),
                    api.get("/tasks"),
                    api.get("/sales")
                ]);

                setStats({
                    customers:
                        customersResponse.data.customers.length,

                    leads:
                        leadsResponse.data.leads.length,

                    tasks:
                        tasksResponse.data.tasks.length,

                    sales:
                        salesResponse.data.sales.length
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    return (
        <div style={styles.container}>

            <h1>CRM Dashboard</h1>

            <p>
                Welcome, <strong>{user?.fullName}</strong>
            </p>

            <p>
                Role: <strong>{user?.role}</strong>
            </p>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <div style={styles.grid}>

                <div style={styles.card}>
                    <h2>{stats.customers}</h2>
                    <p>Customers</p>
                    <button
                        onClick={() => navigate("/customers")}
                    >
                        View Customers
                    </button>
                </div>

                <div style={styles.card}>
                    <h2>{stats.leads}</h2>
                    <p>Leads</p>
                    <button
                        onClick={() => navigate("/leads")}
                    >
                        View Leads
                    </button>
                </div>

                <div style={styles.card}>
                    <h2>{stats.tasks}</h2>
                    <p>Tasks</p>
                    <button
                        onClick={() => navigate("/tasks")}
                    >
                        View Tasks
                    </button>
                </div>

                <div style={styles.card}>
                    <h2>{stats.sales}</h2>
                    <p>Sales</p>
                    <button
                        onClick={() => navigate("/sales")}
                    >
                        View Sales
                    </button>
                </div>

            </div>

            <button
                onClick={handleLogout}
                style={styles.logout}
            >
                Logout
            </button>

        </div>
    );
}

const styles = {
    container: {
        padding: "30px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "30px"
    },

    card: {
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fff"
    },

    logout: {
        marginTop: "30px",
        padding: "10px 20px"
    }
};

export default Dashboard;