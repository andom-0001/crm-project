import { useEffect, useState } from "react";
import api from "../services/api";

function Leads() {
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        name: "",
        contactInfo: "",
        source: "Referral",
        status: "NEW",
        assignedRep: ""
    });

    const [filters, setFilters] = useState({
        status: "",
        source: "",
        assignedRep: ""
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

    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/leads"
            );

            setLeads(
                response.data.leads ||
                response.data ||
                []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load leads."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get(
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
        fetchLeads();
        fetchUsers();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });

        setCurrentPage(1);
    };

    const resetForm = () => {
        setForm({
            name: "",
            contactInfo: "",
            source: "Referral",
            status: "NEW",
            assignedRep: ""
        });

        setEditingId(null);
    };

    const clearFilters = () => {
        setFilters({
            status: "",
            source: "",
            assignedRep: ""
        });

        setCurrentPage(1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!form.name.trim()) {
                setError(
                    "Lead name is required."
                );
                return;
            }

            if (!form.contactInfo.trim()) {
                setError(
                    "Contact information is required."
                );
                return;
            }

            const leadData = {
                name: form.name,
                contactInfo: form.contactInfo,
                source: form.source,
                status: form.status
            };

            if (form.assignedRep) {
                leadData.assignedRep =
                    form.assignedRep;
            }

            if (editingId) {
                await api.put(
                    `/leads/${editingId}`,
                    leadData
                );

                setSuccess(
                    "Lead updated successfully."
                );
            } else {
                await api.post(
                    "/leads",
                    leadData
                );

                setSuccess(
                    "Lead created successfully."
                );
            }

            resetForm();
            setCurrentPage(1);
            fetchLeads();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save lead."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (lead) => {
        setEditingId(lead._id);

        setForm({
            name: lead.name || "",
            contactInfo:
                lead.contactInfo || "",
            source:
                lead.source || "Referral",
            status:
                lead.status || "NEW",
            assignedRep:
                lead.assignedRep?._id ||
                lead.assignedRep ||
                ""
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
            "Are you sure you want to delete this lead?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/leads/${id}`
            );

            setSuccess(
                "Lead deleted successfully."
            );

            fetchLeads();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete lead."
            );
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "NEW":
                return "badge badge-blue";

            case "CONTACTED":
                return "badge badge-yellow";

            case "QUALIFIED":
                return "badge badge-purple";

            case "CONVERTED":
                return "badge badge-green";

            case "LOST":
                return "badge badge-red";

            default:
                return "badge";
        }
    };

    const filteredLeads = leads.filter(
        (lead) => {
            const statusMatch =
                !filters.status ||
                lead.status === filters.status;

            const sourceMatch =
                !filters.source ||
                lead.source === filters.source;

            const assignedRepId =
                lead.assignedRep?._id ||
                lead.assignedRep ||
                "";

            const assignedMatch =
                !filters.assignedRep ||
                assignedRepId ===
                    filters.assignedRep;

            return (
                statusMatch &&
                sourceMatch &&
                assignedMatch
            );
        }
    );

    const totalPages = Math.ceil(
        filteredLeads.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedLeads =
        filteredLeads.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <h1>Leads</h1>

                    <p>
                        Manage, filter, and assign
                        your sales leads.
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
                        ? "Edit Lead"
                        : "Add Lead"}
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
                                placeholder="Enter lead name"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Contact Information *
                            </label>

                            <input
                                type="text"
                                name="contactInfo"
                                value={
                                    form.contactInfo
                                }
                                onChange={handleChange}
                                placeholder="Email or phone"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Source
                            </label>

                            <select
                                name="source"
                                value={form.source}
                                onChange={handleChange}
                            >
                                <option value="Referral">
                                    Referral
                                </option>

                                <option value="Ads">
                                    Ads
                                </option>

                                <option value="Web">
                                    Web
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="NEW">
                                    New
                                </option>

                                <option value="CONTACTED">
                                    Contacted
                                </option>

                                <option value="QUALIFIED">
                                    Qualified
                                </option>

                                <option value="CONVERTED">
                                    Converted
                                </option>

                                <option value="LOST">
                                    Lost
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Assigned Representative
                            </label>

                            <select
                                name="assignedRep"
                                value={
                                    form.assignedRep
                                }
                                onChange={handleChange}
                            >
                                <option value="">
                                    Not assigned
                                </option>

                                {users.map(
                                    (userItem) => (
                                        <option
                                            key={
                                                userItem._id
                                            }
                                            value={
                                                userItem._id
                                            }
                                        >
                                            {
                                                userItem.fullName
                                            }{" "}
                                            (
                                            {
                                                userItem.role
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
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Lead"
                                    : "Add Lead"}
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
                            Filter Leads
                        </h2>

                        <p>
                            Showing{" "}
                            {filteredLeads.length} of{" "}
                            {leads.length} leads
                        </p>
                    </div>
                </div>

                <div className="form-grid">

                    <div className="form-group">
                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={filters.status}
                            onChange={
                                handleFilterChange
                            }
                        >
                            <option value="">
                                All Statuses
                            </option>

                            <option value="NEW">
                                New
                            </option>

                            <option value="CONTACTED">
                                Contacted
                            </option>

                            <option value="QUALIFIED">
                                Qualified
                            </option>

                            <option value="CONVERTED">
                                Converted
                            </option>

                            <option value="LOST">
                                Lost
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Source
                        </label>

                        <select
                            name="source"
                            value={filters.source}
                            onChange={
                                handleFilterChange
                            }
                        >
                            <option value="">
                                All Sources
                            </option>

                            <option value="Referral">
                                Referral
                            </option>

                            <option value="Ads">
                                Ads
                            </option>

                            <option value="Web">
                                Web
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Assigned Representative
                        </label>

                        <select
                            name="assignedRep"
                            value={
                                filters.assignedRep
                            }
                            onChange={
                                handleFilterChange
                            }
                        >
                            <option value="">
                                All Representatives
                            </option>

                            {users.map(
                                (userItem) => (
                                    <option
                                        key={
                                            userItem._id
                                        }
                                        value={
                                            userItem._id
                                        }
                                    >
                                        {
                                            userItem.fullName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                </div>

                <div className="action-buttons">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

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
                            Lead List
                        </h2>

                        <p>
                            Page{" "}
                            {totalPages === 0
                                ? 0
                                : currentPage}{" "}
                            of{" "}
                            {totalPages}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Loading leads...
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="empty-state">
                        No leads match the selected
                        filters.
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Source</th>
                                        <th>Status</th>
                                        <th>Assigned Rep</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {paginatedLeads.map(
                                        (lead) => (
                                            <tr
                                                key={
                                                    lead._id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            lead.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        lead.contactInfo
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        lead.source
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            getStatusClass(
                                                                lead.status
                                                            )
                                                        }
                                                    >
                                                        {
                                                            lead.status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        lead
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
                                                                    lead
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
                                                                            lead._id
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

export default Leads;