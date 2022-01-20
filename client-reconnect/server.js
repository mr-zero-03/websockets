/*https://www.npmjs.com/package/ws*/

const host = 'localhost';
const port = '3000';

const WebSocket = require( 'ws' );
const server = new WebSocket.Server( { host: host, port: port } );

console.log( 'Server started!\n' );

server.on( 'connection', ( socket ) => {
  console.log( '\nConnection established with a Client!\n' );
  socket.send( 'Hello, I am the Server! The connection was established' );

  socket.on( 'message', ( message ) => {
    console.log( 'I received a message from the Client: "' + message + '". ' );
    console.log( 'Sending a message back to the Client...' );
    socket.send( 'Hello Client, I have received your message: "' + message + '". ' );
  } );

} );
