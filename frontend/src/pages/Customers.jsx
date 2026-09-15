import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {
    const [customers, setCustomers] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        notes: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/customers"
            );

            setCustomers(
                response.data.customers ||
                response.data ||
                []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load customers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            company: "",
            address: "",
            notes: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!form.name.trim()) {
                setError("Customer name is required.");
                return;
            }

            if (editingId) {
                await api.put(
                    `/customers/${editingId}`,
                    form
                );

                setSuccess(
                    "Customer updated successfully."
                );
            } else {
                await api.post(
                    "/customers",
                    form
                );

                setSuccess(
                    "Customer created successfully."
                );
            }

            resetForm();
            setCurrentPage(1);
            fetchCustomers();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save customer."
            );
        } finally {
            setSaving(false);
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

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
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
            setError("");
            setSuccess("");

            await api.delete(
                `/customers/${id}`
            );

            setSuccess(
                "Customer deleted successfully."
            );

            fetchCustomers();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete customer."
            );
        }
    };

    const totalPages = Math.ceil(
        customers.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedCustomers =
        customers.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <h1>Customers</h1>

                    <p>
                        Manage your customer records.
                    </p>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <div className="form-card">

                <h2>
                    {editingId
                        ? "Edit Customer"
                        : "Add Customer"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Company
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                placeholder="Enter company"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Notes
                            </label>

                            <input
                                type="text"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Enter notes"
                            />
                        </div>

                    </div>

                    <div className="action-buttons">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Customer"
                                    : "Add Customer"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            <div
                className="form-card"
                style={{
                    marginTop: "25px"
                }}
            >

                <div className="page-header">
                    <div>
                        <h2>
                            Customer List
                        </h2>

                        <p>
                            Showing{" "}
                            {paginatedCustomers.length}{" "}
                            of{" "}
                            {customers.length} customers
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Loading customers...
                    </div>
                ) : customers.length === 0 ? (
                    <div className="empty-state">
                        No customers found.
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Company</th>
                                        <th>Assigned Rep</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {paginatedCustomers.map(
                                        (customer) => (
                                            <tr
                                                key={
                                                    customer._id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            customer.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        customer.email ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        customer.phone ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        customer.company ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        customer
                                                            .assignedRep
                                                            ?.fullName ||
                                                        "Not assigned"
                                                    }
                                                </td>

                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="secondary-button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    customer
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {user?.role ===
                                                            "ADMIN" && (
                                                                <button
                                                                    className="danger-button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            customer._id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">

                                <button
                                    className="secondary-button"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page{" "}
                                    {currentPage}{" "}
                                    of{" "}
                                    {totalPages}
                                </span>

                                <button
                                    className="secondary-button"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage + 1
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>
                        )}

                    </>
                )}

            </div>

        </div>
    );
}

export default Customers;