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
  console.log( 'Received the message: "' + message.toString() + '" sended by the client' );
}

function connectionCallback( socket ) {
  console.log( 'Connection successfully established' );
  socket.send( JSON.stringify( { connection: 'Connection successfully established' } ) );

  socket.on( 'message', ( message ) => {
    messageCallback( message );
  } );
}
//============================================

//============= HTTP Server Stuff ============
function processGets( res, urlPath, GET ) {
  if ( urlPath.includes( '/send-message' ) ) { //This have to be called by the client

    if( GET.language === undefined ) { GET.language = 'Not selected yet'; }

    const language = GET.language;

    let message = '';
    switch( language ) {
      case 'espanol':
        message = 'Hola, fui modificado por el Cliente conectado por WebSocket';
      break;
      case 'english':
        message = 'Hello, I was modified by the Client connected through WebSocket';
      break;
      case 'esperanto':
        message = 'Saluton, mi estis modifita de la Kliento konektita per WebSocket';
      break;
      default:
        message = 'No valid language selected';
    }

    const data = { language: language, message: message };

    wss.clients.forEach( ( client ) => { //This is to display in every connected client. If we did not do the forEach this would only be showed on the last connected client
      if ( client.readyState === WebSocket.OPEN ) {
        client.send( JSON.stringify( data ) );
      }
    } );

    let html = 'You can change the message displayed on the screen where you run the Client connection script by sending here the GET parameter "language" with the value: <br/>';
    html += '<ul> <li>espanol</li> <li>english</li> <li>esperanto</li> </ul>';

    res.writeHead( 200, { 'Content-Type': 'text/html' } );
    res.end( html );

  } else {
    const javaScript = fs.readFileSync( __dirname + '/client.js' ).toString();

    res.writeHead( 200, { 'Content-Type': 'text/html' } );
    res.end( '<html> <body><p>Runing the Client script to connect to the Server :D</p> <script>' + javaScript + '</script> </body> <html>' );
  }
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
