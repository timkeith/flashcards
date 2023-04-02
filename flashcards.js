#!/usr/bin/env node

import debug from 'debug';
import http from 'http';
import app from './app.js';

debug('valleyvistafarm:server');

const port = process.env.PORT || '3001';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('bind:', bind);
  debug('Listening on ' + bind);
}
