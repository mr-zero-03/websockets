//This file is to create the WebSocket "server"

const WebSocket = require( 'ws' );

module.exports = ( connectionCallback ) => {
  const wsServer = new WebSocket.Server( { noServer: true } );

  wsServer.on( 'connection', ( socket ) => {
    connectionCallback( socket );
  } );

  return( [ wsServer, WebSocket ] );
};
