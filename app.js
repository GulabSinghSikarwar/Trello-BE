const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser'); // Import body-parser
const mongoose = require('mongoose');
const { connectDB, dbName } = require('./config/db');
const { logger, morganMiddleware } = require('./services/logger');
const routes = require('./routes/index');
const passport = require("passport");
const passportStrategy = require("./config/passport");
require('dotenv').config({ path: '.env.local' });

const app = express();
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);

const sessionStore = new MongoDBStore({
    uri: `mongodb+srv://gulab:gulab@cluster0.9otpy.mongodb.net/${dbName}`,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24, // Session expiration in milliseconds (1 day)
});

app.use(cors());

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // Example: session cookie valid for 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

app.use(morganMiddleware);
app.use(routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    connectDB();
    logger.info(`Server running on port ${PORT}`);
});
