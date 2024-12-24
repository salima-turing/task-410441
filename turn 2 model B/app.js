const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const RateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Rate limiter for /ingest endpoint
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit to 100 requests per 15 minutes
    message: 'Too many requests. Please try again later.'
});

app.use('/ingest', limiter);

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, 'your_secret_key', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(403);
    }
};

// Secure data ingestion endpoint
app.post('/ingest', authenticateJWT,
    body('data').isString().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        // Assuming data is valid and signed
        const {data} = req.body;

        // Process and store data
        // Implement your logic to securely store the data (e.g., encrypting it before storage)

        console.log('Data ingested:', data);
        res.status(200).send('Data ingested successfully');
    });

// Start server
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    key: fs.readFileSync('task-410441/turn-2-model-B/private_key.pem'),
    cert: fs.readFileSync('task-410441/turn-2-model-B/certificate.pem')
}, app);

server.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});
