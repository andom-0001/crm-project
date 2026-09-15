import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Sales from "./pages/Sales";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leads"
                    element={
                        <ProtectedRoute>
                            <Leads />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sales"
                    element={
                        <ProtectedRoute>
                            <Sales />
                        </ProtectedRoute>
                    }
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;