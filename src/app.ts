import express from 'express';
import pool from './db/postgre';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, TypeScript Express!');
});
const PORT = process.env.PORT || 3000;

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
