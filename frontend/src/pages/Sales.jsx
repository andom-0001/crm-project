import { useEffect, useState } from "react";
import api from "../services/api";

function Sales() {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        customer: "",
        amount: "",
        status: "PENDING",
        date: "",
        assignedRep: ""
    });

    const fetchSales = async () => {
        try {
            const response = await api.get("/sales");
            setSales(response.data.sales);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load sales"
            );
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get("/customers");
            setCustomers(response.data.customers || []);
        } catch (err) {
            console.log("Could not load customers");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data.users || []);
        } catch (err) {
            console.log("Could not load users");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchSales(),
                fetchCustomers(),
                fetchUsers()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingId) {
                await api.put(`/sales/${editingId}`, form);
                setEditingId(null);
            } else {
                await api.post("/sales", form);
            }

            resetForm();
            fetchSales();
        } catch (err) {
            setError(
                err.response?.data?.message || "Operation failed"
            );
        }
    };

    const handleEdit = (sale) => {
        setEditingId(sale._id);

        setForm({
            customer: sale.customer?._id || sale.customer || "",
            amount: sale.amount || "",
            status: sale.status || "PENDING",
            date: sale.date
                ? new Date(sale.date).toISOString().slice(0, 16)
                : "",
            assignedRep:
                sale.assignedRep?._id ||
                sale.assignedRep ||
                ""
        });
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            customer: "",
            amount: "",
            status: "PENDING",
            date: "",
            assignedRep: ""
        });
    };

    if (loading) {
        return <h2>Loading sales...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Sales Pipeline</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <h2>
                {editingId ? "Edit Sale" : "Add Sale"}
            </h2>

            <form onSubmit={handleSubmit}>
                <label>Customer:</label>

                <select
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select Customer
                    </option>

                    {customers.map((customer) => (
                        <option
                            key={customer._id}
                            value={customer._id}
                        >
                            {customer.name}
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <label>Amount:</label>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <br />
                <br />

                <label>Status:</label>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">
                        In Progress
                    </option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                </select>

                <br />
                <br />

                <label>Date:</label>

                <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                />

                <br />
                <br />

                <label>Assigned Representative:</label>

                <select
                    name="assignedRep"
                    value={form.assignedRep}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select Representative
                    </option>

                    {users.map((user) => (
                        <option
                            key={user._id}
                            value={user._id}
                        >
                            {user.fullName} ({user.role})
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <button type="submit">
                    {editingId ? "Update Sale" : "Add Sale"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            <h2>Sales List</h2>

            {sales.length === 0 ? (
                <p>No sales found.</p>
            ) : (
                sales.map((sale) => (
                    <div
                        key={sale._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >
                        <h3>
                            {sale.customer?.name ||
                                "Unknown Customer"}
                        </h3>

                        <p>
                            Amount: ₹{sale.amount}
                        </p>

                        <p>
                            Status: {sale.status}
                        </p>

                        <p>
                            Date:{" "}
                            {sale.date
                                ? new Date(
                                      sale.date
                                  ).toLocaleString()
                                : "N/A"}
                        </p>

                        <p>
                            Assigned Rep:{" "}
                            {sale.assignedRep?.fullName ||
                                "N/A"}
                        </p>

                        <button
                            onClick={() => handleEdit(sale)}
                        >
                            Edit
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Sales;