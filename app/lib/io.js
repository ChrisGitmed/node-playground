const { Server } = require('socket.io');

const config = require('../config');

class IO {
  static connectSocket = io => {

    // On Socket Connection
    io.on('connection', socket => {
      console.log(`User Connected: ${socket.id}`);

      socket.join('room')
      socket.emit('join', `You are connected!`)
      socket.to('room').emit('join', `Socket id ${socket.id} connected!`);

      socket.on('click', (clicks) => {
        console.log('clicks: ', clicks)
        socket.emit('click', clicks)
        socket.to('room').emit('click', clicks)
      });

      socket.on('disconnect', () => console.log(`User Disconnected: ${socket.id}`));
    });
  }

  static getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };
  
  // Create HTTP Server
  static createHttpServer = server => new Server(server, { cors: { origin: config.FRONT_END_URL }});
};

module.exports = IO;