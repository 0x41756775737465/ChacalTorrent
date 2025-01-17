/**
 * Server.js - File Upload and WebSocket Server
 *
 * This script sets up an Express server to handle file uploads and JSON data, as well as WebSocket connections.
 * It listens for uploaded files, saves them to designated folders, and processes JSON data, writing it to files.
 * Additionally, it establishes a WebSocket server to provide real-time updates to clients based on log file changes.
 */

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws');
const readline = require('readline');

// Define destination folders
const uploadDestination = 'uploadsTorrent/';
const jsonDestination = 'uploadsJSON/';
let fileName = '';

const app = express();
const upload = multer({ dest: uploadDestination });

// Define listening port
const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: 8080 });
const nbLinesOfLog = 5;

// Configure CORS
app.use(cors());

// Middleware
app.use(express.json()); // JSON data support
app.use(express.urlencoded({ extended: true })); // URL encoded data support

/**
 * POST Route for File Upload
 * Uploads a single file and saves it to the designated folder.
 */
app.post('/uploadFile', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Aucun fichier téléchargé.'); // No file uploaded
    }

    const uploadedFile = req.file;
    const destinationPath = path.join(__dirname, uploadDestination, uploadedFile.originalname);

    // Move uploaded file to destination folder
    fs.renameSync(uploadedFile.path, destinationPath);

    // Get uploaded file name without extension
    fileName = path.parse(uploadedFile.originalname).name;

    res.send('Fichier téléchargé avec succès !'); // File uploaded successfully

  } catch (error) {
    console.error('Une erreur est survenue lors du téléchargement du fichier :', error.message); // Error during file upload
    res.status(500).send('Une erreur est survenue lors du téléchargement du fichier.'); // Error response
  }
});

/**
 * POST Route for JSON Data
 * Receives JSON data and writes it to a file.
 */
app.post('/uploadJSON', (req, res) => {
  try {
    const jsonData = req.body;
    writeJSONToFile(jsonData);
    res.send('Données JSON reçues avec succès !'); // JSON data received successfully
  } catch (error) {
    console.error('Une erreur est survenue lors de la réception des données JSON :', error.message); // Error receiving JSON data
    res.status(500).send('Une erreur est survenue lors de la réception des données JSON.'); // Error response
  }
});

/**
 * Writes JSON Data to File
 * Writes received JSON data to a file in JSON format.
 * @param {Object} jsonData - JSON data to be written to file
 */
function writeJSONToFile(jsonData) {
  try {
    // File path to write JSON
    const filePath = path.join(__dirname, jsonDestination, fileName + '.json');

    // Convert JSON data to JSON string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Write JSON data to file
    fs.writeFileSync(filePath, jsonString);

    // console.log('Données JSON écrites avec succès dans le fichier:', filePath);
  } catch (error) {
    console.error('Une erreur est survenue lors de l\'écriture des données JSON dans le fichier :', error.message); // Error writing JSON data to file
  }
}

/**
 * Starts the HTTP server
 * Starts the Express server on the defined port.
 */
app.listen(port, () => {
  console.log(`Serveur HTTP démarré sur le port ${port}`); // HTTP server started on port
});

/**
 * Reads Last Lines of Log File
 * Reads the last few lines of a specified log file and sends them to WebSocket clients.
 * @param {number} numLines - Number of lines to read from the log file
 */
function readLastLines(numLines) {
  const logFilePath = path.join(__dirname, '../../fileManagement.log');
  const lines = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(logFilePath),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    lines.push(line);
    if (lines.length > numLines) {
      lines.shift(); // Remove first line if list exceeds requested line count
    }
  });

  rl.on('close', () => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(lines.join('\n')); // Send last lines to WebSocket clients
      }
    });
  });
}

// Add watch for log file changes
const logFilePath = path.join(__dirname, '../../fileManagement.log');
fs.watchFile(logFilePath, (curr, prev) => {
  readLastLines(nbLinesOfLog); // Read last lines again when log file is modified
});

// Read last lines on server startup
readLastLines(nbLinesOfLog);
