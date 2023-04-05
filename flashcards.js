#!/usr/bin/env node

import http from 'http';
import app from './app.js';

const port = process.env.PORT || '3001';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', () => { console.log('Listening on port', server.address().port); });
