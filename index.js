const fs = require('fs');

const speedTest = require('speedtest-net');
const ping = require('ping');

const speedInterval = setInterval(() => {
  const test = speedTest();
  test.on('data', data => {
    fs.appendFileSync(
      'speed.txt',
      `\n${new Date().toLocaleTimeString()} - ${data.speeds.download} / ${
        data.speeds.upload
      }`,
    );
  });
  test.on('error', error => {
    fs.appendFileSync(
      'speed.txt',
      `\n${new Date().toLocaleTimeString()} - ${JSON.stringify(error)}`,
    );
  });
}, 1000 * 60);

const pingInterval = setInterval(async () => {
  try {
    const res = await ping.promise.probe('google.com');
    fs.appendFileSync(
      'ping.txt',
      `\n${new Date().toLocaleTimeString()} - ${res.time}ms`,
    );
  } catch (e) {
    fs.appendFileSync(
      'ping.txt',
      `\n${new Date().toLocaleTimeString()} - ERROR! ${JSON.stringify(e)}`,
    );
  }
}, 1000);
