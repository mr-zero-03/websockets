//Used on the browser

const host = 'localhost';
const port = '3000';

const webSocketUrl = ( 'ws://' + host + ':' + port + '/open-connection' );

let socket;

const p = document.createElement( 'p' );
document.body.appendChild( p );

function createSocket() {
  socket = new WebSocket( webSocketUrl );

  socket.addEventListener( 'open', () => {
    console.log( 'Opened connection.' );
    console.log( 'Please use the sendMessage( "message" ) function to send the messages through the chat' );
    p.innerHTML = 'Connected to the chat<br/>Please use the sendMessage( "message" ) function on the web console to send the messages through the chat';
  } );

  socket.addEventListener( 'message', ( message ) => {
    console.log( message.data );
  } );

  socket.addEventListener( 'close', () => { //If the connection get closed by a side, the client would try to connect again
    console.warn( 'Closed. Trying to connect again' );
    p.innerHTML = 'Disconnected from the chat. Trying to connect again';
    setTimeout( createSocket, 2000 );
  } );

  socket.addEventListener( 'error', ( error ) => {
    console.error( 'WebSocket error:' );
    console.error( error );
  } );

}

const username = prompt( 'Please type your username' );

window.addEventListener( 'load', createSocket );

function sendMessage( message ) {
  const messageToSend = { user: username, message: message };
  socket.send( JSON.stringify( messageToSend ) );
}
