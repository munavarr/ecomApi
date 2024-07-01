import express from 'express';
import pool from './db/postgre';
import AppRoutes from "./routes/index"
import { execFileSync, execSync } from "child_process"
import { Client  } from 'pg';
import bodyParser from 'body-parser';
// import pgtools from 'pgtools'
import pg from 'pg'
import path from 'path'
import cors from "cors"
const ff = "f"
const app = express();
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from a specific origin
  methods: ['GET', 'POST'],      // Allow only specified HTTP methods
  allowedHeaders: ['Content-Type'], // Allow only specified headers
}));
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', AppRoutes);

const PORT = process.env.PORT || 3000;

const uploadsDirectory = path.join(__dirname, '..', 'uploads');
console.log(__dirname,uploadsDirectory)
app.use(express.static(uploadsDirectory));

const start = async () => {
  try {
    await pool.connect()
    await app.listen(3000);
    console.log(`Server is running on port ${PORT}`); 
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};
start();


