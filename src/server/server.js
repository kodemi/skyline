import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fallback from 'express-history-api-fallback';
import config from '../../config';
import mongoose from 'mongoose';
import morgan from 'morgan';

import apiRoutes from './api';

const DB_URL = config.DB_URL;

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL);

const app = new Express();
const port = config.PORT;
const corsOptions = {
    origin: [/tech.skyline-ltd.com$/, /localhost:3000/, 'http://10.98.41.77:3000', 'http://188.227.17.109:8080'],
    credentials: true
};
const root = __dirname + '/../../public/';

app.set('secret', config.SECRET);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(Express.static(root));
app.options('*', cors(corsOptions));
app.use('/api', apiRoutes);
app.use(fallback('index.html', { root: root }))

app.listen(port, '0.0.0.0', (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
    }
});