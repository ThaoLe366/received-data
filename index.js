const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Middleware to log the timestamp of each request
app.use((req, res, next) => {
  console.log(`Request received at ${new Date().toLocaleString()}`);
  next();
});

// API to save request body to a file
app.post('/data', (req, res) => {
  const data = req.body;

  // Create a folder named "data" if it doesn't exist
  const dataFolderPath = path.join(__dirname, 'data');
  if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
  }

  const filePath = path.join(dataFolderPath, 'requestData.json');

  // Read existing data from file (if it exists)
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    existingData = JSON.parse(fileContent);
  }

  // Append new data and write back to the file
  existingData.push({ timestamp: moment().format('DD MM YYYY HH:mm:ss'), data });
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  res.json({ message: 'Request data saved successfully' });
});

// API to get all data from the file
app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'requestData.json');

  // Read data from file (if it exists)
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const allData = JSON.parse(fileContent);
    res.json(allData);
  } else {
    res.json({ message: 'No data found' });
  } 
});

// API to delete all data from the file
app.delete('/data', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'requestData.json');

  // Delete file if it exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'All data deleted successfully' });
  } else {
    res.json({ message: 'No data found to delete' });
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
