import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
        assignedTo: "",
        status: "PENDING"
    });

    const fetchTasks = async () => {
        try {
            const response = await api.get("/tasks");
            setTasks(response.data.tasks);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load tasks"
            );
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
                fetchTasks(),
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
                await api.put(`/tasks/${editingId}`, form);
                setEditingId(null);
            } else {
                await api.post("/tasks", form);
            }

            resetForm();
            fetchTasks();
        } catch (err) {
            setError(
                err.response?.data?.message || "Operation failed"
            );
        }
    };

    const handleEdit = (task) => {
        setEditingId(task._id);

        setForm({
            title: task.title || "",
            description: task.description || "",
            dueDate: task.dueDate
                ? new Date(task.dueDate)
                    .toISOString()
                    .slice(0, 16)
                : "",
            priority: task.priority || "MEDIUM",
            assignedTo: task.assignedTo?._id || task.assignedTo || "",
            status: task.status || "PENDING"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete task"
            );
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            title: "",
            description: "",
            dueDate: "",
            priority: "MEDIUM",
            assignedTo: "",
            status: "PENDING"
        });
    };

    if (loading) {
        return <h2>Loading tasks...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Tasks</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <h2>
                {editingId ? "Edit Task" : "Add Task"}
            </h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Task Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <br />
                <br />

                <label>Due Date:</label>

                <input
                    type="datetime-local"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <label>Priority:</label>

                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

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
                    <option value="COMPLETED">
                        Completed
                    </option>
                </select>

                <br />
                <br />

                <label>Assign To:</label>

                <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select User
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
                    {editingId ? "Update Task" : "Add Task"}
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

            <h2>Task List</h2>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                tasks.map((task) => (
                    <div
                        key={task._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >
                        <h3>{task.title}</h3>

                        <p>
                            Description:{" "}
                            {task.description || "N/A"}
                        </p>

                        <p>
                            Due:{" "}
                            {new Date(
                                task.dueDate
                            ).toLocaleString()}
                        </p>

                        <p>
                            Priority: {task.priority}
                        </p>

                        <p>
                            Status: {task.status}
                        </p>

                        <p>
                            Assigned To:{" "}
                            {task.assignedTo?.fullName ||
                                "N/A"}
                        </p>

                        <button
                            onClick={() => handleEdit(task)}
                        >
                            Edit
                        </button>

                        {JSON.parse(localStorage.getItem("user"))?.role === "ADMIN" && (
                            <button
                                onClick={() => handleDelete(task._id)}
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

export default Tasks;