const WebSocketServer = require('rpc-websockets').Server;
const { Subject } = require('await-notify');
const subject = new Subject();

let semaphore = 1;

// instantiate Server and start listening for requests
let server = new WebSocketServer({
  port: 8080,
  host: 'localhost'
})
   
// register an RPC method
server.register('v', (params) => {  
  return new Promise((resolve) => {
    semaphore += Number(params[0]);
    console.log(`Semaphore value: ${semaphore}`);
    subject.notify();
    resolve();
  });
})

server.register('p', (params) => {
  return new Promise((resolve) => {
    counter = 0;

    const trySemaphore = () => {      
      if (semaphore >= params[0]) {
        semaphore -= Number(params[0]);
        console.log(`Semaphore value: ${semaphore}`);
        resolve();
      } else {
        if (counter) {
          subject.notify();
        }
        subject.wait().then(() => {
          counter += 1;
          trySemaphore();
        })
      }
    };
    trySemaphore();
});
})