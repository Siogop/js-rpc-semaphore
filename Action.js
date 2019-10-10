const WebSocket = require('rpc-websockets').Client;
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const ws = new WebSocket('ws://localhost:8080')

const readInput = () => {
  readline.question(`Enter action:\n`, (input) => {

    const array = input.split(' ');
    const cmd = array[0];
    const i = array[1];

    if (cmd === 'p') {
      console.log('Try semaphore');
      ws.call('p', [i]).then(function(result) {
        console.log('Entered crtical section\n');
        process.exit(1);
      }).catch((e) => {
        console.log(e);
      });
    } else if (cmd === 'v') {
      console.log('Release semaphore\n');
      ws.call('v', [i]).then(function(result) {
        console.log('Released');
        process.exit(1);
      }).catch((e) => {
        console.log(e);
      });
    }
    readline.close();
  })
}

ws.on('open', function() {
  readInput();
})