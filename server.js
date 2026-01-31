import helmet from 'helmet';
import 'dotenv/config'; // Shortcut to load .env immediately
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

// Local imports (MUST include .js extension)
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import product from './routes/product.js'
import {authLimiter} from './utils/ratelimiter.js'

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET, POST, UPDATE, CREATE',
  Credential: true
}
// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());


app.use('/user', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/products', product)

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));