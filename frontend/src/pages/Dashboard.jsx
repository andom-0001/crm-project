import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div style={styles.container}>

            <div style={styles.card}>

                <h1>CRM Dashboard</h1>

                <p>
                    Welcome, {user?.fullName}
                </p>

                <p>
                    Role: {user?.role}
                </p>

                <button
                    onClick={handleLogout}
                    style={styles.button}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        padding: "40px",
        background: "#f4f6f8"
    },

    card: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },

    button: {
        marginTop: "20px",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default Dashboard;