import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoute from './src/routes/router.js';
import  prototype  from './src/helpers/prototype.js';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const accessLogStream = fs.readFileSync("./logs/access.log",{
    interval: "id",
    path: path.join(__dirname, 'log')
});
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.LISTENING_PORT || 3000;
const app = express();
app.use(cookieParser());
// app.use(morgan(isProduction ? morgan("combined", {stream : accessLogStream}): morgan("dev") ) );
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((error, req, res, next) => {
    res.status(error.errorCode);
    res.json({ message: error.message });
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

app.use(apiRoute);

const server = app.listen(port);
