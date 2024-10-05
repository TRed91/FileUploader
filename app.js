const express = require('express');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const path = require('node:path')
require('dotenv').config()
const passport = require('passport');
const { localStrategy , serialize, deserialize } = require('./strategy/localStrategy.js');
const indexRouter = require('./routes/indexRoute');

const app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use static files
app.use(express.static('public'));

// Setup Prisma express session
app.use( session({
    cookie: {
        maxAge: 60 * 60 * 24 * 1000
    },
    secret: 'myUploader',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 1000 * 60 * 2,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
    })
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(localStrategy);
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express app listening to port ${PORT}`);
})