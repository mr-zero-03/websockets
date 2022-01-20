const http = require( 'http' );
const url = require( 'url' );

module.exports = ( port, host, processGetsCallback, processPostsCallback, upgradeCallback ) => {
  const server = http.createServer( ( req, res ) => {
    const urlPath = req.url;
    const GET = url.parse( urlPath, true ).query;
    let postBody = '';

    console.log( 'I did received the following parameters through GET:' );
    console.log( GET );

    req.on( 'data', ( chunk ) => {
      postBody += chunk;
    } );

    req.on( 'end', () => {
      if ( req.method === 'POST' ) {
        let POST = {};

        if ( postBody !== '' ) {
          try {
            POST = JSON.parse( postBody );
          } catch( e ) {
            POST = postBody;
          }

          console.log( 'I did received the following parameters through POST:' );
          console.log( POST );
        }

        processPostsCallback( res, urlPath, GET, POST );
      } else {
        processGetsCallback( res, urlPath, GET );
      }
    } );
  } );

  server.on( 'upgrade', upgradeCallback ); //To make the upgrade and make handshake with the client

  server.listen( port, host, () => {
    console.log( 'Listening for "' + host + '" requests in "' + port + '" port...\n' );
  } );

  return( server );
};
