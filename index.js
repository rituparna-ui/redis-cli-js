const net = require('net');
const readline = require('readline');
const encoder = require('./encoder');

const client = new net.Socket();
const port = 6379;
const host = '127.0.0.1';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const read = () =>
  new Promise((res, rej) => {
    rl.on('line', (data) => {
      res(data);
    });
  });

const prompt = async () => {
  process.stdout.write('> ');
  read().then((data) => {
    if (data == '') {
      prompt();
      return;
    }
    if (data == 'exit') process.exit(0);
    else {
      client.write(encoder(data));
      // prompt();
    }
  });
};

client.connect(port, host, function (data) {
  console.log('Connected');
  // client.write('*1\r\n$4\r\nPING\r\n');
  // client.write('*3\r\n$3\r\nSET\r\n$5\r\nmykey\r\n$7\r\nmyvalue\r\n');
  // client.write('*2\r\n$3\r\nGET\r\n$5\r\nmykey\r\n');
  // client.write(encoder('SET name Ritu'));
  prompt();
});

client.on('data', (data) => {
  const string = data.toString();
  if (string.startsWith('+')) {
    console.log(string.split('+')[1].trim());
  } else if (string.startsWith('$')) {
    console.log(string.split('\n')[1].trim());
  } else {
    console.log(string);
  }

  prompt();
});

process.on('SIGINT', () => {
  console.log('disconnecting client');
  client.destroy();
  console.log('Disconnected');
  process.exit(0);
});
