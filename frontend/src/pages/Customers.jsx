import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        notes: ""
    });

    const fetchCustomers = async () => {
        try {
            const response = await api.get("/customers");
            setCustomers(response.data.customers);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load customers"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
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
                await api.put(`/customers/${editingId}`, form);
                setEditingId(null);
            } else {
                await api.post("/customers", form);
            }

            setForm({
                name: "",
                email: "",
                phone: "",
                company: "",
                address: "",
                notes: ""
            });

            fetchCustomers();
        } catch (err) {
            setError(
                err.response?.data?.message || "Operation failed"
            );
        }
    };

    const handleEdit = (customer) => {
        setEditingId(customer._id);

        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            company: customer.company || "",
            address: customer.address || "",
            notes: customer.notes || ""
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete customer"
            );
        }
    };

    const cancelEdit = () => {
        setEditingId(null);

        setForm({
            name: "",
            email: "",
            phone: "",
            company: "",
            address: "",
            notes: ""
        });
    };

    if (loading) {
        return <h2>Loading customers...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Customers</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <h2>
                {editingId ? "Edit Customer" : "Add Customer"}
            </h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                />

                <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                />

                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    {editingId ? "Update Customer" : "Add Customer"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            <h2>Customer List</h2>

            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                customers.map((customer) => (
                    <div
                        key={customer._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >
                        <h3>{customer.name}</h3>

                        <p>Email: {customer.email || "N/A"}</p>
                        <p>Phone: {customer.phone || "N/A"}</p>
                        <p>Company: {customer.company || "N/A"}</p>
                        <p>Address: {customer.address || "N/A"}</p>

                        <button
                            onClick={() => handleEdit(customer)}
                        >
                            Edit
                        </button>

                        {JSON.parse(localStorage.getItem("user"))?.role === "ADMIN" && (
                            <button
                                onClick={() => handleDelete(customer._id)}
                                style={{ marginLeft: "10px" }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Customers;