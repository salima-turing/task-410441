const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Rate limiter for the /ingest endpoint
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // includes rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // disables the `X-RateLimit-*` headers
});

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

// Secure data ingestion endpoint with rate limiting
app.post('/ingest', [authenticateJWT, limiter],
    body('data').isString().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Assuming data is valid and signed
        const { data } = req.body;

        // Process and store data securely
        console.log('Data ingested:', data);
        res.status(200).send('Data ingested successfully');
    });

// Start server
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    key: fs.readFileSync('task-410441/turn-2-model-A/private_key.pem'),
    cert: fs.readFileSync('task-410441/turn-2-model-A/certificate.pem')
}, app);

server.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});
