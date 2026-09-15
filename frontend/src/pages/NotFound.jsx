import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">

            <div className="not-found-card">

                <div className="not-found-number">
                    404
                </div>

                <h1>
                    Page Not Found
                </h1>

                <p>
                    The page you are looking for
                    does not exist or may have been moved.
                </p>

                <button
                    className="primary-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default NotFound;