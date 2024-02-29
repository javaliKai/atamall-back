const express = require('express');

const app = express();
const connectDb = require('./util/db.js');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const productRoutes = require('./routes/productRoutes.js');

// DB CONNECTION
connectDb();

// UTILITY MIDDLEWARES
app.use(express.json()); // parsing req body to json data

// API ROUTES
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);

// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err.stack); // log the error for debugging purpose

  const statusCode = err.status || 500;
  const message = err.message;
  const data = err.data;
  res.status(statusCode).json({ message, data });
});

// SERVER CONFIG
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
