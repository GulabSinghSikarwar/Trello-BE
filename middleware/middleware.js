const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const redis = require('redis');

const client = redis.createClient();

const app = express();
const port = 3000;

// Define MongoDB schema for tokens
const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});
const Token = mongoose.model('Token', TokenSchema);

// Define MongoDB schema for users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model('User', UserSchema);

// Redis cache functions
function cacheToken(tokenKey, tokenValue) {
  client.set(tokenKey, tokenValue, 'EX', 3600); // Cache token for 1 hour (example)
}

function retrieveToken(tokenKey) {
  return new Promise((resolve, reject) => {
    client.get(tokenKey, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

// Function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
}

// Route for user login (username, password)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Cache token in Redis
    cacheToken(user._id.toString(), token);

    // Store token in MongoDB
    const newToken = new Token({
      userId: user._id,
      token,
      expiration: new Date(Date.now() + 3600000), // Token expires in 1 hour
    });
    await newToken.save();

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Route for token validation (middleware)
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Check Redis cache first
    const cachedToken = await retrieveToken(req.user._id.toString());
    if (cachedToken === token) {
      return next(); // Token valid, proceed to next middleware
    }

    // If not found in Redis, check MongoDB
    const tokenRecord = await Token.findOne({ userId: req.user._id, token });
    if (!tokenRecord || tokenRecord.expiration < new Date()) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Cache token in Redis for future requests
    cacheToken(req.user._id.toString(), token);

    // Token valid, proceed to next middleware
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}

// Example protected route using token validation middleware
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected resource' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
