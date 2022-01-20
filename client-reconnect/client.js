//Used on the browser

const host = 'localhost';
const port = '3000';

const webSocketUrl = ( 'ws://' + host + ':' + port + '/' );

let socket;

function createSocket() {
  socket = new WebSocket( webSocketUrl ); //Here is where the connection happens

  socket.addEventListener( 'open', () => {
    console.log( 'Opened connection.' );
    console.log( 'Now you can send messages using: socket.message( "Hello World" );' );
    console.log( 'Also, please try closing the connection with: socket.close();' );
    socket.send( 'Hello, I am the Client!' );
  } );

  socket.addEventListener( 'message', ( message ) => {
    console.log( 'Server says: "' + message.data + '"' );
  } );

  socket.addEventListener( 'error', ( error ) => {
    console.error( 'WebSocket error:' );
    console.error( error );
  } );

  socket.addEventListener( 'close', () => { //If the connection get closed by a side, the client would try to connect until gets the connection
    console.log( 'Closed. Trying to connect again' );
    setTimeout( createSocket, 2000 );
  } );

}

createSocket();
