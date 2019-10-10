const WebSocket = require('rpc-websockets').Client;
const ws = new WebSocket('ws://localhost:8080')

const trySemaphore = () => {
  console.log('Try semaphore');
  ws.call('p', [1]).then(() => {
    console.log('Entered crtical section');
    
    setTimeout(() => {
      ws.call('v', [1]).then(() => {
        console.log('Exited crtical section');
      }).then(() => {
        setTimeout(trySemaphore, 1000);
      }).catch((e) => {
        console.log(e);
      });
    }, 3000);
  
  }).catch((e) => {
    console.log(e);
  });
}

ws.on('open', () => {
  // call an RPC method with parameters
  trySemaphore();
})