const { createServer } = require('http');
const express = require('express')
const morgan = require('morgan')
const { Server } = require('socket.io')

const { Err } = require('./lib/error');
const routes = require('./router')
const config = require('./config')


const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: config.FRONT_END_URL }});

class Application {
  constructor() {

    let interval;
    const clients = [];
    io.on('connection', socket => {
      console.log(`User Connected: ${socket.id}`);
      clients.push(socket.id);
      socket.join('room')
      socket.emit("newActivity", `You are connected!`)
      socket.to('room').emit("newActivity", `Socket id ${socket.id} connected`);

      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => getApiAndEmit(socket), 1000);

      socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        clients.splice(clients.indexOf(socket.id), 1);
      });
    });

    const getApiAndEmit = socket => {
      const response = new Date();
      // Emitting a new message. Will be consumed by the client
      socket.emit("FromAPI", response);
    };

    app.use(express.json())
      .use(morgan('dev'))
      .use('/api', routes)

      // Top level error handling
      .use(async (err, req, res, next) => {
        if (err instanceof Err) {
          if (res.headersSent) return next(err);
          console.log('::::ERR::::');
          console.log('::::UUID: ', err.uuid);
          console.log('::::CODE: ', err.code);
          console.log('::::MSG: ', err.message);
          return res.status(err.code).json({ message: err.message });
        };

        // Unknown error
        if (res.headersSent) return next(err);
        console.log('::::ERR - UNKNOWN::::');
        console.log('::::CODE: ', err.code);
        console.log('::::MSG: ', err.message);
        return res.status(500).json({ message: `Uknown error occured: ${err.message}` });
      });

    this.app = app;
  };

  async start (port) {
    process.on('uncaughtException', e => console.error('Top-Level exception', e, e.stack));

    return new Promise((resolve, reject) => {

      httpServer.listen(port, async (err) => {
        if (err) {
          console.log(err);
          reject(err);
        };
        console.info(`Server now listening on port: ${port}`);
        resolve();
      });
    });
  };
};

const APP = new Application();

(async function main() { if (require.main === module) await APP.start(config.port || 8080) })();

module.exports = APP.app;
