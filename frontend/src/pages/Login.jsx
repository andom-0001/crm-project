import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/login", {
                email,
                password
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard");

        } catch (error) {
            console.log("LOGIN ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h1 style={styles.title}>CRM Login</h1>

                <p style={styles.subtitle}>
                    Sign in to your CRM account
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Email
                        </label>

                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        style={styles.button}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial, sans-serif"
    },

    card: {
        width: "380px",
        padding: "35px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.12)"
    },

    title: {
        marginBottom: "8px",
        textAlign: "center"
    },

    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "25px"
    },

    formGroup: {
        marginBottom: "18px"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        fontWeight: "bold"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px"
    },

    button: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "16px",
        cursor: "pointer"
    },

    error: {
        padding: "12px",
        marginBottom: "18px",
        backgroundColor: "#ffe5e5",
        color: "#c00",
        borderRadius: "6px"
    }
};

export default Login;