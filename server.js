const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when accessing root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve student dashboard
app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Serve teacher dashboard
app.get('/teacher-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher.html'));
});

// Middleware (The "Security Guards")
app.use(cors()); // Allows your HTML to talk to this server
app.use(express.json()); // Allows the server to read JSON data

// The "Mailbox" for Students
app.post('/api/student/login', (req, res) => {
    console.log("--- New Student Login Received ---");
    console.log(req.body); // This prints the data in your terminal
    res.status(200).json({ message: "Server received the data!" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is awake and listening at http://localhost:${PORT}`);
});