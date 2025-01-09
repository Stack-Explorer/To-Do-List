// app.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); 
const dotenv = require('dotenv'); 
dotenv.config(); 

const app = express();
const port = 3000; 

// Connect to PostgreSQL database
const pool = new Pool({
  user: 'your_user', 
  host: 'your_host', 
  database: 'your_database', 
  password: 'your_password', 
  port:  5432 // default port
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files (CSS)

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.render('index', { todos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching todos');
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { task } = req.body;
    await pool.query('INSERT INTO todos (task) VALUES ($1)', [task]);
    res.redirect('/'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding todo');
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    await pool.query('UPDATE todos SET task = $1 WHERE id = $2', [task, id]);
    res.json({ message: 'Task updated successfully' }); // Send JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating todo');
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' }); // Send JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting todo');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});