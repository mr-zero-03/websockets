/*
* This is a server created using the http NodeJS module and the WebSocket connection can be established using the ws NodeJS module
** You can find a simple NodeJS server using http here: https://gist.github.com/mr-zero-03/f47649238e2265649c5b4e905bd25987
*/
const wsServer = require( './libs/wss-core' );
const server = require( './libs/server-core' );

const fs = require( 'fs' );

const host = 'localhost';
const port = 3000;

let wss;
let WebSocket;

//============= WebSockets Stuff =============
function messageCallback( message ) {
  message = JSON.parse( message );
  let user = message.user;
  if( user === undefined || user === '' ) { user = 'anonymous'; }

  const date = ( new Date ).toISOString().split( '.' )[ 0 ];

  const messageToSend = ( date + '  ' + user + ': ' + message.message );

  console.log( 'Received the message: "' + message.message + '" sended by the user: "' + user + '" at the "' + date + '"' );

  wss.clients.forEach( ( client ) => { //Send a user message to each user on the chat
    if ( client.readyState === WebSocket.OPEN ) {
      client.send( messageToSend );
    }
  } );
}

function connectionCallback( socket ) {
  console.log( 'Connection successfully established with a Client' );

  socket.on( 'message', ( message ) => {
    messageCallback( message );
  } );
}
//============================================

//============= HTTP Server Stuff ============
function processGets( res, urlPath, GET ) {
  res.writeHead( 200, { 'Content-Type': 'text/html' } );
  const javaScript = fs.readFileSync( __dirname + '/client.js' ).toString();
  res.end( '<html> <body><p>Runing the Client script to connect to chat the Server :D</p> <script>' + javaScript + '</script> </body> <html>' );
}

function processPosts( res, urlPath, GET, POST ) {}

function upgradeCallback( req, socket, head ) {
  const urlPath = req.url;

  console.log( '\nServer "upgrade" call...' );

  if ( urlPath.includes( '/open-connection' ) ) { //This is called by the client to connect through a WebSocket
    console.log( 'Open WebSockets connection. Upgrade was requested' );
    wss.handleUpgrade( req, socket, head, function done( ws ) {
      wss.emit( 'connection', ws, req );
    } );
  } else {
    console.log( 'The connection was destroyed' );
    socket.write( 'HTTP/1.1 404 Not Found\r\n\r\n' );
    socket.destroy();
  }
}
//============================================

server( port, host, processGets, processPosts, upgradeCallback ); //Creating HTTP server
[ wss, WebSocket ] = wsServer( connectionCallback ); //Creating WebSockets server
