const express = require('express');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files (like your HTML and CSS)
app.use(express.static('public'));

// File path to store user data
const filePath = './users.txt';

// Helper function to read user data from file
function readUsersFromFile() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or there's an error reading it, return an empty array
        return [];
    }
}

// Helper function to write user data to file
function writeUsersToFile(users) {
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(filePath, data);
}

// Routes
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsersFromFile();
    // Check if username is already taken
    if (users.find(user => user.username === username)) {
        return res.send('Username already taken');
    }
    // Store user data temporarily
    users.push({ username, email, password });
    writeUsersToFile(users);
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsersFromFile();
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        req.session.user = user;
        return res.send('Login successful');
    }
    res.send('Invalid username or password');
});

app.get('/profile', (req, res) => {
    const user = req.session.user;
    if (user) {
        return res.send(`Welcome, ${user.username}!`);
    }
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
