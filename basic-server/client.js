//Used on the browser

const host = 'localhost';
const port = '3000';

const socket = new WebSocket( 'ws://' + host + ':' + port + '/' );

socket.addEventListener( 'open', ( event ) => {
  console.log( 'Connection established with the Server!' );
  socket.send( 'Hello, I am the Client! The connection was established' );

  setTimeout( () => {
    console.log( 'Sending a message to the Server...' );
    socket.send( 'Hello world!' );
  }, 3000 );
} );

socket.addEventListener( 'message', ( message ) => {
  console.log( 'Server says: "' + message.data + '"' );

  if( message.data === '*Handshake*' ) {
    console.log( 'Sending back the handshake to the Server...' );
    socket.send( '*Handshake*' );
  }

} );

socket.addEventListener( 'error', ( error ) => {
  console.error( error );
} );

/*
* You can send more messages to the server using socket.message( 'Hello World' );
*/
