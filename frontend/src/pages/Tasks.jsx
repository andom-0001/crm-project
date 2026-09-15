import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [view, setView] = useState("ALL");

    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
        assignedTo: "",
        status: "PENDING"
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [completingId, setCompletingId] =
        useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/tasks"
            );

            setTasks(
                response.data.tasks ||
                response.data ||
                []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load tasks."
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
        fetchTasks();
        fetchUsers();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            dueDate: "",
            priority: "MEDIUM",
            assignedTo: "",
            status: "PENDING"
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!form.title.trim()) {
                setError(
                    "Task title is required."
                );
                return;
            }

            if (!form.dueDate) {
                setError(
                    "Due date is required."
                );
                return;
            }

            if (!form.assignedTo) {
                setError(
                    "Please select a user to assign the task."
                );
                return;
            }

            if (editingId) {
                await api.put(
                    `/tasks/${editingId}`,
                    form
                );

                setSuccess(
                    "Task updated successfully."
                );
            } else {
                await api.post(
                    "/tasks",
                    form
                );

                setSuccess(
                    "Task created successfully."
                );
            }

            resetForm();
            setCurrentPage(1);
            fetchTasks();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save task."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (task) => {
        setEditingId(task._id);

        const formattedDate = task.dueDate
            ? new Date(task.dueDate)
                .toISOString()
                .slice(0, 16)
            : "";

        setForm({
            title: task.title || "",
            description:
                task.description || "",
            dueDate: formattedDate,
            priority:
                task.priority || "MEDIUM",
            assignedTo:
                task.assignedTo?._id ||
                task.assignedTo ||
                "",
            status:
                task.status || "PENDING"
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
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/tasks/${id}`
            );

            setSuccess(
                "Task deleted successfully."
            );

            fetchTasks();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete task."
            );
        }
    };

    const handleMarkDone = async (task) => {
        if (
            task.status ===
            "COMPLETED"
        ) {
            return;
        }

        try {
            setCompletingId(task._id);
            setError("");
            setSuccess("");

            await api.put(
                `/tasks/${task._id}`,
                {
                    title: task.title,
                    description:
                        task.description || "",
                    dueDate: task.dueDate,
                    priority: task.priority,
                    assignedTo:
                        task.assignedTo?._id ||
                        task.assignedTo,
                    status: "COMPLETED"
                }
            );

            setSuccess(
                "Task marked as completed."
            );

            fetchTasks();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to mark task as completed."
            );
        } finally {
            setCompletingId(null);
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "LOW":
                return "badge badge-green";

            case "MEDIUM":
                return "badge badge-yellow";

            case "HIGH":
                return "badge badge-red";

            default:
                return "badge";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "PENDING":
                return "badge badge-yellow";

            case "IN_PROGRESS":
                return "badge badge-blue";

            case "COMPLETED":
                return "badge badge-green";

            default:
                return "badge";
        }
    };

    const filteredTasks = tasks.filter(
        (task) => {
            if (view === "MY") {
                const assignedUserId =
                    task.assignedTo?._id ||
                    task.assignedTo ||
                    "";

                return (
                    assignedUserId ===
                        user?.userId ||
                    assignedUserId ===
                        user?._id
                );
            }

            return true;
        }
    );

    const totalPages = Math.ceil(
        filteredTasks.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedTasks =
        filteredTasks.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <h1>Tasks</h1>

                    <p>
                        Create, assign, and track tasks.
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
                        ? "Edit Task"
                        : "Add Task"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Description
                            </label>

                            <input
                                type="text"
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={handleChange}
                                placeholder="Enter task description"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Due Date *
                            </label>

                            <input
                                type="datetime-local"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option value="LOW">
                                    Low
                                </option>

                                <option value="MEDIUM">
                                    Medium
                                </option>

                                <option value="HIGH">
                                    High
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Assigned To *
                            </label>

                            <select
                                name="assignedTo"
                                value={
                                    form.assignedTo
                                }
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select user
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

                        <div className="form-group">
                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>
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
                                    ? "Update Task"
                                    : "Add Task"}
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
                            Task List
                        </h2>

                        <p>
                            Showing{" "}
                            {filteredTasks.length}{" "}
                            of{" "}
                            {tasks.length} tasks
                        </p>
                    </div>
                </div>

                <div className="action-buttons">

                    <button
                        className={
                            view === "ALL"
                                ? "primary-button"
                                : "secondary-button"
                        }
                        onClick={() => {
                            setView("ALL");
                            setCurrentPage(1);
                        }}
                    >
                        All Tasks
                    </button>

                    <button
                        className={
                            view === "MY"
                                ? "primary-button"
                                : "secondary-button"
                        }
                        onClick={() => {
                            setView("MY");
                            setCurrentPage(1);
                        }}
                    >
                        My Tasks
                    </button>

                </div>

                {loading ? (
                    <div className="empty-state">
                        Loading tasks...
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        {view === "MY"
                            ? "You have no assigned tasks."
                            : "No tasks found."}
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Due Date</th>
                                        <th>Priority</th>
                                        <th>Assigned To</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {paginatedTasks.map(
                                        (task) => (
                                            <tr
                                                key={
                                                    task._id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            task.title
                                                        }
                                                    </strong>

                                                    {task.description && (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "4px",
                                                                fontSize:
                                                                    "12px",
                                                                color:
                                                                    "#6b7280"
                                                            }}
                                                        >
                                                            {
                                                                task.description
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {task.dueDate
                                                        ? new Date(
                                                            task.dueDate
                                                        ).toLocaleString()
                                                        : "-"}
                                                </td>

                                                <td>
                                                    <span
                                                        className={getPriorityClass(
                                                            task.priority
                                                        )}
                                                    >
                                                        {
                                                            task.priority
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        task.assignedTo
                                                            ?.fullName ||
                                                        "Not assigned"
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            task.status
                                                        )}
                                                    >
                                                        {task.status ===
                                                        "IN_PROGRESS"
                                                            ? "IN PROGRESS"
                                                            : task.status}
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="secondary-button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    task
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {task.status !==
                                                            "COMPLETED" && (
                                                                <button
                                                                    className="primary-button"
                                                                    onClick={() =>
                                                                        handleMarkDone(
                                                                            task
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        completingId ===
                                                                        task._id
                                                                    }
                                                                >
                                                                    {completingId ===
                                                                    task._id
                                                                        ? "Updating..."
                                                                        : "Mark Done"}
                                                                </button>
                                                            )}

                                                        {user?.role ===
                                                            "ADMIN" && (
                                                                <button
                                                                    className="danger-button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            task._id
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

export default Tasks;