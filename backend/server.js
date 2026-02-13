require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Global error handler (must be registered last) ───────────────
app.use(errorHandler);

// ── Connect to MongoDB (non-blocking) ────────────────────────────
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) =>
        console.error('⚠️  MongoDB connection failed:', err.message, '— server running without DB')
    );

// ── Start server (always) ────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
