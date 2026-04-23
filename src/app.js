import express from "express";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

app.use("/api/profiles", profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[app] Unhandled error:", err.message);
  res.status(500).json({ status: "error", message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[app] Server running on port ${PORT}`);
});
