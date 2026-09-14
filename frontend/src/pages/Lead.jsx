import { useEffect, useState } from "react";
import api from "../services/api";

function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        contactInfo: "",
        source: "Referral",
        status: "NEW"
    });

    const fetchLeads = async () => {
        try {
            const response = await api.get("/leads");
            setLeads(response.data.leads);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load leads"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
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
                await api.put(`/leads/${editingId}`, form);
                setEditingId(null);
            } else {
                await api.post("/leads", form);
            }

            resetForm();
            fetchLeads();
        } catch (err) {
            setError(
                err.response?.data?.message || "Operation failed"
            );
        }
    };

    const handleEdit = (lead) => {
        setEditingId(lead._id);

        setForm({
            name: lead.name || "",
            contactInfo: lead.contactInfo || "",
            source: lead.source || "Referral",
            status: lead.status || "NEW"
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
            await api.delete(`/leads/${id}`);
            fetchLeads();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete lead"
            );
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            name: "",
            contactInfo: "",
            source: "Referral",
            status: "NEW"
        });
    };

    if (loading) {
        return <h2>Loading leads...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Leads</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <h2>
                {editingId ? "Edit Lead" : "Add Lead"}
            </h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Lead Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="contactInfo"
                    placeholder="Contact Info"
                    value={form.contactInfo}
                    onChange={handleChange}
                    required
                />

                <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                >
                    <option value="Referral">Referral</option>
                    <option value="Ads">Ads</option>
                    <option value="Web">Web</option>
                </select>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                </select>

                <br />
                <br />

                <button type="submit">
                    {editingId ? "Update Lead" : "Add Lead"}
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

            <h2>Lead List</h2>

            {leads.length === 0 ? (
                <p>No leads found.</p>
            ) : (
                leads.map((lead) => (
                    <div
                        key={lead._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >
                        <h3>{lead.name}</h3>

                        <p>
                            Contact: {lead.contactInfo}
                        </p>

                        <p>
                            Source: {lead.source}
                        </p>

                        <p>
                            Status: {lead.status}
                        </p>

                        <button
                            onClick={() => handleEdit(lead)}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(lead._id)}
                            style={{ marginLeft: "10px" }}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Leads;