const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customersRoutes");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
// Test route
app.get("/", (req, res) => {
    res.json({
        message: "CRM Backend is running"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});