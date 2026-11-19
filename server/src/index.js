const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');


// Route imports
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const expertRoutes = require('./routes/expertRoutes');
const reviewerRoutes = require('./routes/reviewerRoutes');
const outcomeRoutes = require('./routes/outcomeRoutes');
const passportRoutes = require('./routes/passportRoutes');
const meritRoutes = require('./routes/meritRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect database
connectDB();

// Middlewares with dynamic CORS for all local development ports
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or any localhost port (5173, 5174, 3000, etc.)
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploaded documents statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'U-RAIEE API Server Active',
    timestamp: new Date().toISOString()
  });
});

// Mount application API routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/reviewer', reviewerRoutes);
app.use('/api/outcomes', outcomeRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/merit', meritRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// Global 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'Requested API endpoint not found.' });
});

// Start listener
app.listen(PORT, () => {
  console.log(`U-RAIEE Server running on port ${PORT}`);
});
