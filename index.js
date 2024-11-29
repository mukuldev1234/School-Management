const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();

const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

// Add School API
app.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Input validation
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Latitude and Longitude must be numbers.' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    res.status(201).json({ message: 'School added successfully.', schoolId: result.insertId });
  });
});

// List Schools API
app.get('/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  // Input validation
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required.' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitude and Longitude must be valid numbers.' });
  }

  const userLat = parseFloat(latitude);
  const userLng = parseFloat(longitude);

  const query = 'SELECT *, (3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance FROM schools ORDER BY distance';
  
  db.query(query, [userLat, userLng, userLat], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(200).json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
