import { useEffect, useState } from "react";
import api from "../services/api";

function Sales() {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] =
        useState([]);
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        customer: "",
        amount: "",
        status: "PENDING",
        date: "",
        assignedRep: ""
    });

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const itemsPerPage = 5;

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/sales"
            );

            setSales(
                response.data.sales ||
                response.data ||
                []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load sales."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response =
                await api.get(
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
        }
    };

    const fetchUsers = async () => {
        try {
            const response =
                await api.get(
                    "/users"
                );

            setUsers(
                response.data.users ||
                response.data ||
                []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load users."
            );
        }
    };

    useEffect(() => {
        fetchSales();
        fetchCustomers();
        fetchUsers();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]:
                event.target.value
        });
    };

    const resetForm = () => {
        setForm({
            customer: "",
            amount: "",
            status: "PENDING",
            date: "",
            assignedRep: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!form.customer) {
                setError(
                    "Please select a customer."
                );
                return;
            }

            if (
                form.amount === "" ||
                Number(form.amount) < 0
            ) {
                setError(
                    "Please enter a valid amount."
                );
                return;
            }

            if (!form.assignedRep) {
                setError(
                    "Please select an assigned representative."
                );
                return;
            }

            const saleData = {
                customer:
                    form.customer,
                amount:
                    Number(form.amount),
                status:
                    form.status,
                assignedRep:
                    form.assignedRep
            };

            if (form.date) {
                saleData.date =
                    form.date;
            }

            if (editingId) {
                await api.put(
                    `/sales/${editingId}`,
                    saleData
                );

                setSuccess(
                    "Sale updated successfully."
                );
            } else {
                await api.post(
                    "/sales",
                    saleData
                );

                setSuccess(
                    "Sale created successfully."
                );
            }

            resetForm();
            setCurrentPage(1);
            fetchSales();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save sale."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (sale) => {
        setEditingId(
            sale._id
        );

        const formattedDate =
            sale.date
                ? new Date(
                    sale.date
                )
                    .toISOString()
                    .slice(0, 16)
                : "";

        setForm({
            customer:
                sale.customer?._id ||
                sale.customer ||
                "",

            amount:
                sale.amount ?? "",

            status:
                sale.status ||
                "PENDING",

            date:
                formattedDate,

            assignedRep:
                sale.assignedRep?._id ||
                sale.assignedRep ||
                ""
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const getStatusClass =
        (status) => {
            switch (status) {
                case "PENDING":
                    return "badge badge-yellow";

                case "IN_PROGRESS":
                    return "badge badge-blue";

                case "WON":
                    return "badge badge-green";

                case "LOST":
                    return "badge badge-red";

                default:
                    return "badge";
            }
        };

    const totalPages =
        Math.ceil(
            sales.length /
            itemsPerPage
        );

    const startIndex =
        (currentPage - 1) *
        itemsPerPage;

    const paginatedSales =
        sales.slice(
            startIndex,
            startIndex +
                itemsPerPage
        );

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <h1>
                        Sales Pipeline
                    </h1>

                    <p>
                        Manage deals and update
                        sales status.
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
                        ? "Edit Sale"
                        : "Add Sale"}
                </h2>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Customer *
                            </label>

                            <select
                                name="customer"
                                value={
                                    form.customer
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="">
                                    Select customer
                                </option>

                                {customers.map(
                                    (
                                        customer
                                    ) => (
                                        <option
                                            key={
                                                customer._id
                                            }
                                            value={
                                                customer._id
                                            }
                                        >
                                            {
                                                customer.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Amount *
                            </label>

                            <input
                                type="number"
                                name="amount"
                                min="0"
                                step="0.01"
                                value={
                                    form.amount
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter amount"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>

                                <option value="WON">
                                    Won
                                </option>

                                <option value="LOST">
                                    Lost
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Date
                            </label>

                            <input
                                type="datetime-local"
                                name="date"
                                value={
                                    form.date
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Assigned Representative *
                            </label>

                            <select
                                name="assignedRep"
                                value={
                                    form.assignedRep
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="">
                                    Select representative
                                </option>

                                {users.map(
                                    (
                                        user
                                    ) => (
                                        <option
                                            key={
                                                user._id
                                            }
                                            value={
                                                user._id
                                            }
                                        >
                                            {
                                                user.fullName
                                            }{" "}
                                            (
                                            {
                                                user.role
                                            }
                                            )
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                    </div>

                    <div className="action-buttons">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                saving
                            }
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Sale"
                                    : "Add Sale"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    resetForm
                                }
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
                    marginTop:
                        "25px"
                }}
            >

                <div className="page-header">
                    <div>
                        <h2>
                            Sales List
                        </h2>

                        <p>
                            Showing{" "}
                            {
                                paginatedSales.length
                            }{" "}
                            of{" "}
                            {
                                sales.length
                            }{" "}
                            sales
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Loading sales...
                    </div>
                ) : sales.length === 0 ? (
                    <div className="empty-state">
                        No sales found.
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Assigned Rep
                                        </th>

                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {paginatedSales.map(
                                        (
                                            sale
                                        ) => (
                                            <tr
                                                key={
                                                    sale._id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            sale
                                                                .customer
                                                                ?.name ||
                                                            "Unknown customer"
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        sale.amount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits:
                                                                2
                                                        }
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            sale.status
                                                        )}
                                                    >
                                                        {
                                                            sale.status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        sale.date
                                                            ? new Date(
                                                                sale.date
                                                            ).toLocaleString()
                                                            : "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        sale
                                                            .assignedRep
                                                            ?.fullName ||
                                                        "Not assigned"
                                                    }
                                                </td>

                                                <td>
                                                    <button
                                                        className="secondary-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                sale
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
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
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage -
                                                1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page{" "}
                                    {
                                        currentPage
                                    }{" "}
                                    of{" "}
                                    {
                                        totalPages
                                    }
                                </span>

                                <button
                                    className="secondary-button"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage +
                                                1
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

export default Sales;