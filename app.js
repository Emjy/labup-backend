require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('./models/connection');

var usersRouter = require('./routes/users');
var initialPatternsRouter = require('./routes/initialPatterns');
var modifiedPatternsRouter = require('./routes/modifiedPatterns');
var documentsRouter = require("./routes/documents");
var exportsRouter = require("./routes/exports");
var foldersRouter = require("./routes/folders");
var fontsRouter = require("./routes/fonts");
var feedRouter = require("./routes/feed");
var dashboardRouter = require("./routes/dashboard");

var app = express();

const corsOptions = {
    origin: ['https://labup-frontend.vercel.app', 'http://localhost:3001'], // Autorise uniquement ton frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes acceptés
    credentials: true, // Si tu gères des cookies ou des sessions
};

app.use(cors(corsOptions));  // Activer CORS pour toutes les routes

// Gérer les requêtes préflight (OPTIONS)
app.options('*', cors(corsOptions));  // Ajoute les en-têtes CORS pour toutes les routes OPTIONS

// Middleware pour bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour la gestion des fichiers multipart/form-data avec multer
var multer = require('multer');
var upload = multer();

app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', usersRouter);
app.use('/initialPatterns', initialPatternsRouter);
app.use('/modifiedPatterns', upload.single('photoFromFront'), modifiedPatternsRouter);
app.use('/documents', upload.single('photoFromFront'), documentsRouter);
app.use("/exports", upload.single('photoFromFront'), exportsRouter);
app.use("/folders", foldersRouter);
app.use('/fonts', fontsRouter);
app.use('/feed', feedRouter);
app.use('/dashboard', dashboardRouter);

module.exports = app;