const express = require('express')
const morgan = require('morgan')
const { createServer } = require('http');
const { Server } = require('socket.io')

const { Err } = require('./lib/error');
const routes = require('./router')
const config = require('./config')

const app = express()

class Application {
  constructor() {
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
      app.listen(port, async (err) => {
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
