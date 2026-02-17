const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { SERVER_ERROR } = require('./utils/messages');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: SERVER_ERROR });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BillSmithed API running on port ${PORT}`);
});