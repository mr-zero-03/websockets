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
  } );

  socket.addEventListener( 'message', ( message ) => {
    const data = JSON.parse( message.data );
    console.log( 'Server says:' );
    console.log( data );

    if ( data.message !== undefined ) {
      p.innerHTML = ( 'Language: ' + data.language + '<br/>Message: ' + data.message );
    }
  } );

  socket.addEventListener( 'close', () => { //If the connection get closed by a side, the client would try to connect again
    console.log( 'Closed. Trying to connect again' );
    setTimeout( createSocket, 2000 );
  } );

  socket.addEventListener( 'error', ( error ) => {
    console.error( 'WebSocket error:' );
    console.error( error );
  } );

}

createSocket();
