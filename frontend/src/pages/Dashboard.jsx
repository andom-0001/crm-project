import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
    const [stats, setStats] = useState({
        customers: 0,
        leads: 0,
        tasks: 0,
        sales: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

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

                const customers =
                    customersResponse.data.customers ||
                    customersResponse.data ||
                    [];

                const leads =
                    leadsResponse.data.leads ||
                    leadsResponse.data ||
                    [];

                const tasks =
                    tasksResponse.data.tasks ||
                    tasksResponse.data ||
                    [];

                const sales =
                    salesResponse.data.sales ||
                    salesResponse.data ||
                    [];

                setStats({
                    customers: customers.length,
                    leads: leads.length,
                    tasks: tasks.length,
                    sales: sales.length
                });
            } catch (error) {
                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Welcome back,{" "}
                        <strong>
                            {user?.fullName || "User"}
                        </strong>
                        .
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="empty-state">
                    Loading dashboard...
                </div>
            ) : (
                <>
                    {/* Statistics */}
                    <div className="card-grid">

                        <div className="card">
                            <div className="card-icon">
                                👥
                            </div>

                            <h3>
                                Customers
                            </h3>

                            <div className="card-number">
                                {stats.customers}
                            </div>

                            <p>
                                Total customers
                            </p>
                        </div>


                        <div className="card">
                            <div className="card-icon">
                                🎯
                            </div>

                            <h3>
                                Leads
                            </h3>

                            <div className="card-number">
                                {stats.leads}
                            </div>

                            <p>
                                Total leads
                            </p>
                        </div>


                        <div className="card">
                            <div className="card-icon">
                                ✅
                            </div>

                            <h3>
                                Tasks
                            </h3>

                            <div className="card-number">
                                {stats.tasks}
                            </div>

                            <p>
                                Total tasks
                            </p>
                        </div>


                        <div className="card">
                            <div className="card-icon">
                                💰
                            </div>

                            <h3>
                                Sales
                            </h3>

                            <div className="card-number">
                                {stats.sales}
                            </div>

                            <p>
                                Total sales
                            </p>
                        </div>

                    </div>


                    {/* Welcome Card */}
                    <div
                        className="form-card"
                        style={{
                            marginTop: "30px"
                        }}
                    >
                        <h2>
                            CRM Overview
                        </h2>

                        <p>
                            Use the navigation menu to
                            manage your customers, leads,
                            tasks, and sales pipeline.
                        </p>

                        <div
                            style={{
                                marginTop: "20px",
                                padding: "15px",
                                background: "#f9fafb",
                                borderRadius: "8px"
                            }}
                        >
                            <strong>
                                Your role:
                            </strong>{" "}
                            {user?.role || "USER"}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;