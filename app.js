import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import GetWords from './src/GetWords.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(dirname, 'build');

const router = express.Router();
router.get(/\/.*/, (req, res) => {
  const url = req.url.replace(/^\/flashcards(\/|$)/, '/');
  if (url === '/words') {
    try {
      GetWords(words => res.json(words));
    } catch (err) {
      next(err);
    }
  } else {
    const file = path.join(staticDir, url);
    res.sendFile(path.join(staticDir, url));
  }
});

var app = express();
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(staticDir));
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.error('404:', req.url);
  return next(createError(404));
});

app.use((error, req, res, next) => {
  console.error('error:', error);
  res.status(error.status || 500);
  res.render('error', { url: req.url, error: error });
});

export default app;
