const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config()

const app = express();

// Setup Prisma express session
app.use( expressSession({
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